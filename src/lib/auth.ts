import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the GitHub user id to the token right after signin. The OAuth
      // access token is intentionally not stored: nothing uses it, and the
      // session callback would otherwise expose it to client-side JS.
      if (account && profile) {
        token.githubId = profile.id?.toString();
        token.githubUsername = profile.login;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like the user id from the provider.
      if (session.user) {
        session.user.githubId = token.githubId as string;
        session.user.githubUsername = token.githubUsername as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}; 