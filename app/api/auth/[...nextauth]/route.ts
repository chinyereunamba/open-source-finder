import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

async function fetchGitHubProfile(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) return null;
  return res.json();
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // Add more providers here if needed
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // If logging in with GitHub, fetch extra profile data
      if (account && account.provider === "github" && account.access_token) {
        const ghProfile = await fetchGitHubProfile(
          account.access_token as string
        );
        if (ghProfile) {
          token.login = ghProfile.login;
          token.bio = ghProfile.bio;
          token.location = ghProfile.location;
          token.blog = ghProfile.blog;
          token.html_url = ghProfile.html_url;
          token.twitter_username = ghProfile.twitter_username;
          token.company = ghProfile.company;
          token.public_repos = ghProfile.public_repos;
          token.followers = ghProfile.followers;
          token.following = ghProfile.following;
          token.avatar_url = ghProfile.avatar_url;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as any;
        user.login = token.login;
        user.bio = token.bio;
        user.location = token.location;
        user.blog = token.blog;
        user.html_url = token.html_url;
        user.twitter_username = token.twitter_username;
        user.company = token.company;
        user.public_repos = token.public_repos;
        user.followers = token.followers;
        user.following = token.following;
        user.image = token.avatar_url || user.image;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
