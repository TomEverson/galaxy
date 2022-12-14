# 🚀Spaceship Stack

## Ship Fast Website To The User With Just A Sprinkle Of Javascript

### The Spaceship Stack
1. Astro
2. Tailwind 
3. Mongo
4. Astro-Auth
5. Typescript

#### This Stack Is Already Setup With Authentication, SSR and Database. So with Just A Few Configuration, it is a piece of cake to start building your website. 

## How To Extend

### Authentication
Authentication for now is just simple sign-in process. However, in production, I recommened adding email verification process as user can't spam with bot account. Email verification can be easy to setup with Sendgrid, Mailchimp. 

#### Verification Flow
##### Create-account
Make a new API route -> Create A Session (collection here for example) In Database -> Store verification email, password and verification number -> Send verification number to user with email service -> Request User To Verify -> If Verification Number are same, delete the session and store the email and password back in user collection. 

#### Log-In ( [...astroauth].ts )
Remove the hook that if account on exist, create a new account. 

### Database
If you need relational database or schema typed-ORM, I recommened [Prisma](https://www.prisma.io/). 