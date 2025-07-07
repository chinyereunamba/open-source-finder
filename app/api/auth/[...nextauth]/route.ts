import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // Add more providers here if needed
  ],
  // Add more NextAuth config here (callbacks, pages, etc.)
});

export { handler as GET, handler as POST };
