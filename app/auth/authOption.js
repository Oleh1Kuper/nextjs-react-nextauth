import { verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credantials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await connectToDatabase();
        const user = await client.db('next-auth').collection('users').findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error('User is not found');
        }

        const isMatched = await verifyPassword(
          credentials?.password,
          user.password,
        );

        if (!isMatched) {
          client.close();
          throw new Error('Incorrect password');
        }

        client.close();

        return { email: user.email };
      },
    }),
  ],
};

export default authOptions;
