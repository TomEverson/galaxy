import clientPromise from "../../../../lib/mongodb";
import { passwordCheck } from "../../../../utils/password";
import { jwtSign } from "../../../../utils/jwt";
import type { APIRoute } from "astro";
import type { User } from "../../../../types/user";

export const post: APIRoute = async ({ request }) => {
  const client = await clientPromise;
  const db = client.db("spaceship");
  const body: User = await request.json();
  const user = await db.collection<User>("user").findOne({ email: body.email });
  if (!user) { return new Response(JSON.stringify({ message: "Account Doesn't Exist" }), { status: 500 }); }
  const check = await passwordCheck(body.password, user.password);
    if (check) {
      const payload = { id: user._id, email: user.email };
      const token = await jwtSign(payload);
      return new Response(JSON.stringify({ message: "Success" }), { status: 200, headers: {'Set-Cookie': token} });
    }
  return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
}