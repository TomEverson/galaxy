import AstroAuth from "@astro-auth/core";
import { CredentialProvider } from "@astro-auth/providers";
import clientPromise from "../../../../lib/mongodb";
import { passwordHash, passwordCheck } from "../../../../utils/password";
import type { User } from "../../../../types/user";

const client = await clientPromise;
const db = client.db('spaceship');

export const all = AstroAuth({
  authProviders: [
    // You can also try other providers. Check https://github.com/astro-community/astro-auth
    CredentialProvider({
      // Here, we are simply checking if the email matches and allow the user to login
      authorize: async (properties) => {
        
/*      Auth Flow

        You can here check the email and password by querying the database and if there the email and password are same, you can simply return the properties
        Also before adding to database, don't forget to encrpyt the password .... */
        const user  = await db.collection<User>('user').findOne({email: properties.email});
        if (!user) {
          const password = await passwordHash(properties.password)
          const user: User = { email : properties.email, password }
          await db.collection<User>('user').insertOne(user)
          return properties
      }
        else if(user){
          const check = await passwordCheck(properties.password, user.password)
          if (check){
            return properties
          }
          return null
        }
        return null
      },
    }),
  ],
});
