import { PrismaClient } from "@prisma/client";
import { passwordCheck } from "../../../../utils/password";
import { jwtSign } from "../../../../utils/jwt";
import type { APIRoute } from "astro";
import type { User } from "../../../../types/user";
const prisma = new PrismaClient();

export const post: APIRoute = async ({ request }) => {
  const body: User = await request.json();
  const user = await prisma.user.findFirst({ where: { email: body.email } });
  console.log(user, body);
  if (!user) {
    return new Response(JSON.stringify({ message: "Account Doesn't Exist" }), {
      status: 500,
    });
  }
  const check = await passwordCheck(body.password, user.password);
  if (check) {
    const payload = { id: user.id, email: user.email };
    const token = await jwtSign(payload);
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Set-Cookie": token },
    });
  }
  return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
};
