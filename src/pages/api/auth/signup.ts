import type { APIRoute } from "astro";
import { passwordHash } from "../../../../utils/password";
import { PrismaClient } from "@prisma/client";
import type { User } from "../../../../types/user";
import sgMail from "../../../../lib/sendgrid";
const prisma = new PrismaClient();

export const post: APIRoute = async ({ request }) => {
  const sender = import.meta.env.SENDGRID_EMAIL;
  const body: User = await request.json();
  const password = await passwordHash(body.password);
  const code = Math.floor(100000 + Math.random() * 900000);
  const user = await prisma.user.findFirst({ where: { email: body.email } });
  if (user) {
    return new Response(JSON.stringify({ message: "Account Existed" }), {
      status: 500,
    });
  }
  const session = await prisma.session.findFirst({
    where: { email: body.email },
  });
  if (session) {
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        email: body.email,
        password: password,
        code: code,
      },
    });
    const msg = {
      to: body.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: "Verification Code",
      text: "Verification Code",
      html: `Your Verification Code is <strong>${code}</strong>`,
    };
    sgMail.send(msg);
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  }
  await prisma.session.create({
    data: {
      email: body.email,
      password: password,
      code: code,
    },
  });
  const msg = {
    to: body.email, // Change to your recipient
    from: sender, // Change to your verified sender
    subject: "Verification Code",
    text: "Verification Code",
    html: `Your Verification Code is <strong>${code}</strong>`,
  };
  sgMail.send(msg);
  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
};
