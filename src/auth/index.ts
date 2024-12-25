import NextAuth, { User, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials){
        const users = [
          {
            id: "test-user-1",
            userName: "owner",
            name: "Owner",
            password: "pass",
            email: "test1@donotreply.com",
            role: 'owner'
          },
          {
            id: "test-user-2",
            userName: "chef",
            name: "Chef",
            password: "pass",
            email: "test2@donotreply.com",
            role: 'chef'
          },
        ];
        const user = users.find(
          (user) =>
            user.userName === credentials.username &&
            user.password === credentials.password
        );
        return user
          ? { id: user.id, name: user.name, email: user.email, role: user.role }
          : null;
      }
    }),
  ],
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = (token as JWT).role as string;
      }
      return session;
    },
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);