import NextAuth, { User, Session, AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Assuming prisma is still exported from lib/prisma
import bcrypt from "bcryptjs";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Specify the login page
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name, // Include name if available
            image: user.image, // Include image if available
          };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
};

const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export async function GET(req: Request, ctx: any) {
  return handlers.GET(req, ctx);
}

export async function POST(req: Request, ctx: any) {
  return handlers.POST(req, ctx);
}