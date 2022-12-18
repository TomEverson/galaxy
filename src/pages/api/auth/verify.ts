import type { APIRoute } from "astro";
import clientPromise from "../../../../lib/mongodb";
import type { Session } from "../../../../types/user";


export const post: APIRoute = async ({ request }) => {
  const client = await clientPromise;
  const db = client.db("spaceship");
  const body: Session = await request.json();
  const session = await db.collection("session").findOne({ email: body.email });
  if (!session) { return new Response(JSON.stringify({ message: "Error" }), { status: 500 })}
  if (body.code == session.code ){
    await db.collection("user").insertOne({ email: body.email, password: session.password })
    await db.collection("session").deleteOne({ email: body.email })
    return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
  }

  return new Response(JSON.stringify({ message: "Error" }), { status: 500 });
};
