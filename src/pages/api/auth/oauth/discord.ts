import type { APIRoute } from "astro";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { jwtSign } from "../../../../../utils/jwt";

const prisma = new PrismaClient();

export const get: APIRoute = async ({ request, redirect }) => {
  const code: string = new URL(request.url).search.slice(6);
  const id = import.meta.env.DISCORD_CLIENT_ID;
  const secret = import.meta.env.DISCORD_CLIENT_SECRET;
  const params = new URLSearchParams({
    client_id: id,
    client_secret: secret,
    grant_type: "authorization_code",
    code: code.toString(),
    redirect_uri: "http://localhost:3000/api/auth/oauth/discord",
  });
  const fetch = async () => {
    try {
      const response = await axios.post(
        "https://discord.com/api/v10/oauth2/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "*",
          },
        }
      );
      const { access_token } = await response.data;
      const { data: res } = await axios.get(
        "https://discord.com/api/v10/users/@me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ message: "Success" }), {
        status: 404,
      });
    }
  };
  const check = await fetch();
  const payload = { id: check, email: check.email };
  const user = await prisma.user.findFirst({ where: { email: check.email } });
  const token: string = await jwtSign(payload);
  if (!user) {
    await prisma.user.create({ data: { email: check.email, password: null } });
    return (
      new Response(JSON.stringify({ message: "Success" }), {
        status: 200,
        headers: { "Set-Cookie": token },
      }),
      redirect("/")
    );
  }
  return (
    new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Set-Cookie": token },
    }),
    redirect("/")
  );
};
