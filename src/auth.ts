import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const providers = [];

// Always include Credentials provider for Demo / Instant login
providers.push(
  Credentials({
    id: 'credentials',
    name: 'Demo Account',
    credentials: {
      name: { label: 'Name', type: 'text' },
      email: { label: 'Email', type: 'email' },
    },
    async authorize(credentials) {
      const name = (credentials?.name as string)?.trim() || 'DevOps Explorer';
      const email = (credentials?.email as string)?.trim() || 'learner@devops90.local';
      return {
        id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name,
        email,
        image: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
      };
    },
  })
);

// Conditionally enable Google OAuth when credentials are present
if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'faf14da9b8a4da30d541f9581c4cf3e4c683fc639567220fed3925d6c9f0b71a',
  trustHost: true,
});

