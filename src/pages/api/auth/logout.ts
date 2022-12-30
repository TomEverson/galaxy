import type { APIRoute } from "astro";
//@ts-expect-error
import * as cookie from "cookie";

export const post: APIRoute = async () => {
  const Cookie = cookie.serialize("token", "", {
    path: "/",
    maxAge: 0,
  });
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 302,
    // prettier-ignore
    headers: {
      "Set-Cookie": Cookie,
      "Location": "/",
    },
  });
};
