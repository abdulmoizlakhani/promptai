import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/User";

// In Next.js, all server routes are called serverless function or lambda

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GCP_CLIENT_ID,
      clientSecret: process.env.GCP_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
  
      session.user.id = sessionUser._id.toString();
  
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
  
        // check if user already exist
        const userExists = await User.findOne({
          email: profile.email,
        });
        // if not, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
  
        return true;
      } catch (error) {
        console.log("Sign In Error: ", error);
        return false;
      }
    },
  }
});

export { handler as GET, handler as POST };
