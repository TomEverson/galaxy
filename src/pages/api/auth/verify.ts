import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";
import type { Session } from "../../../../types/user";
const prisma = new PrismaClient();

export const post: APIRoute = async ({ request }) => {
  const body: Session = await request.json();
  const session = await prisma.session.findFirst({
    where: { email: body.email },
  });
  if (!session) {
    return new Response(JSON.stringify({ message: "User Doesn't Exist" }), {
      status: 500,
    });
  }
  if (body.code == session.code) {
    await prisma.user.create({
      data: { email: body.email, password: session.password },
    });
    await prisma.session.delete({ where: { id: session.id } });
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
};
