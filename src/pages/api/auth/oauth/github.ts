import type { APIRoute } from "astro";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { jwtSign } from "../../../../utils/jwt";

const prisma = new PrismaClient();

export const post: APIRoute = async ({ redirect }) => {
  const url = import.meta.env.GITHUB_OAUTH_URL;
  return redirect(url);
};

export const get: APIRoute = async ({ request }) => {
  const code: string = new URL(request.url).search.slice(6);
  const id = import.meta.env.GITHUB_CLIENT_ID;
  const secret = import.meta.env.GITHUB_CLIENT_SECRET;
  const fetch = async () => {
    try {
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: id,
          client_secret: secret,
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const { access_token } = await response.data;
      const { data: profile } = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { data: mail } = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return {
        id: profile.id,
        name: profile.login,
        email: mail[0].email,
      };
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ message: "Error" }), {
        status: 404,
      });
    }
  };
  const check: any = await fetch();
  const payload = { id: check.id, email: check.email };
  const user = await prisma.user.findFirst({ where: { email: check.email } });
  const token: string = await jwtSign(payload);
  if (!user) {
    await prisma.user.create({ data: { email: check.email, password: null } });
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 302,
      // prettier-ignore
      headers: { "Set-Cookie": token, "Location": "/"  },
    });
  }
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 302,
    // prettier-ignore
    headers: { "Set-Cookie": token, "Location" : "/" },
  });
};
