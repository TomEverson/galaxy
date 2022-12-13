import AstroAuth from "@astro-auth/core";
import { CredentialProvider } from "@astro-auth/providers";
// import clientPromise from "../../../../lib/mongodb";

export const all = AstroAuth({
  authProviders: [
    // You can also try other providers. Check https://github.com/astro-community/astro-auth
    CredentialProvider({
      // Here, we are simply checking if the email matches and allow the user to login
      authorize: async (properties) => {
        
/*      Auth Flow

        You can here check the email and password by querying the database and if there the email and password are same, you can simply return the properties
        Also before adding to database, don't forget to encrpyt the password

        const client = await clientPromise;
        const db = client.db('your-database');
        const user = await db.collection('your-collection').find(properties.email).toArray();
        if (user) { check email and password } ...
        if (!user) { add to database and return properties }.... */

        if (
          properties.email == "astro@astro.build" &&
          properties.password == "astro"
        ) {
          return properties;
        }

        return null;
      },
    }),
  ],
});
