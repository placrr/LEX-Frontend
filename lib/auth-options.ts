import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: {
      params: {
        prompt: "select_account",   
        hd: "kiit.ac.in"
      }
    }
  })
],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET!, // IMPORTANT

  callbacks: {
    async signIn({ profile, account }) {
      if (account?.provider !== "google") return false
      if (!profile?.email?.endsWith("@kiit.ac.in")) return false
      return true
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/after-oauth`
    }
  }
}