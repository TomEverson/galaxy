import type { APIRoute } from "astro";
import { passwordHash } from "../../../../utils/password";
import clientPromise from "../../../../lib/mongodb";
import type { User } from "../../../../types/user";
import sgMail from "../../../../lib/sendgrid";


export const post: APIRoute = async ({ request }) => {
  const client = await clientPromise;
  const db = client.db("spaceship");
  const sender = import.meta.env.SENDGRID_EMAIL
  const body: User = await request.json()
  const password = await passwordHash(body.password);
  const code = Math.floor(100000 + Math.random() * 900000)
  const user = await db.collection<User>("user").findOne({ email: body.email });
  if (user) { return new Response(JSON.stringify({ message: "Account Existed" }), { status: 500 }) }
  const session = await db.collection("session").findOne({email: body.email });
  if (session) { 
    await db.collection("session").updateOne({name:body.email},{$set:{email: body.email, password , code }}); 
    const msg = {
      to: body.email, // Change to your recipient
      from: sender, // Change to your verified sender
      subject: "Verification Code",
      text: "Verification Code",
      html: `Your Verification Code is <strong>${code}</strong>`,
    };
    sgMail.send(msg)
    return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
  }
  await db.collection("session").insertOne({email: body.email, password , code });
  const msg = {
    to: body.email, // Change to your recipient
    from: sender, // Change to your verified sender
    subject: "Verification Code",
    text: "Verification Code",
    html: `Your Verification Code is <strong>${code}</strong>`,
  };
  sgMail.send(msg)
  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
};
