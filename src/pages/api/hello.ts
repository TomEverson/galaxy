// You can run APIRoute or Backend Function here depending on your preference.

// API Route
import type { APIRoute } from "astro";

export const get: APIRoute = () => {
  return {
    body: JSON.stringify({
      text: "Hello",
      url: "https://astro.build/",
    }),
  };
};

// Backend Function

/* export async function sayHello() {
    return new Response(JSON.stringify({
          text: 'Hello',
          url: 'https://astro.build/',
        });
} */
