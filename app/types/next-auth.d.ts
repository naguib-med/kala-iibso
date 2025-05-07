declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      phone?: string | null;
      bio?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    phone?: string | null;
    bio?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    phone?: string | null;
    bio?: string | null;
  }
}
