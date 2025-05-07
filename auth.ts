import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import { compare } from 'bcrypt';

import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

interface ExtendedSession extends Session {
  accessToken?: string;
  user: {
    id: string;
    role: string;
    phone?: string | null;
    bio?: string | null;
  } & Session['user'];
}

interface Credentials {
  email: string;
  password: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials', credentials);
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials as Credentials;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
            emailVerified: true,
            role: true,
            phone: true,
            bio: true,
          },
        });

        console.log('found user', user);

        if (!user || !user.password) {
          return null;
        }

        if (!user.emailVerified) {
          return null;
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }): Promise<ExtendedSession> {
      if (!token.sub) {
        throw new Error('No user ID in token');
      }

      // Fetch user data from database to get the latest image
      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          phone: true,
          bio: true,
        },
      });

      return {
        ...session,
        accessToken: token.accessToken as string,
        user: {
          ...session.user,
          id: token.sub,
          image: user?.image || session.user?.image,
          name: user?.name || session.user?.name,
          email: user?.email || session.user?.email,
          role: user?.role || 'USER',
          phone: user?.phone || undefined,
          bio: user?.bio || undefined,
        },
      };
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        return {
          ...token,
          picture: session.user.image || token.picture,
          name: session.user.name || token.name,
          email: session.user.email || token.email,
          role: session.user.role || token.role,
          phone: session.user.phone || token.phone,
          bio: session.user.bio || token.bio,
        };
      }

      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.bio = user.bio;
      }

      return token;
    },
  },
});
