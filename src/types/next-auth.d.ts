import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubId?: string;
      githubUsername?: string;
    };
  }

  interface JWT {
    githubId?: string;
    githubUsername?: string;
  }

  interface Profile {
    id?: string;
    login?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
  }
} 