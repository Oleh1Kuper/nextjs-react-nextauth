import authOptions from '@/app/auth/authOption';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function PATCH(req) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const email = session.user.email;
  const oldPassword = body.old_password;
  const newPassword = body.new_password;

  try {
    const client = await connectToDatabase();
    const db = client.db('next-auth');
    const usersColection = db.collection('users');
    const user = await usersColection.findOne({ email });

    if (!user) {
      client.close();

      return Response.json({}, { status: 404 });
    }

    const isMatched = await verifyPassword(oldPassword, user.password);

    if (!isMatched) {
      client.close();

      return Response({ message: 'Incorrect password' }, { status: 422 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await usersColection.updateOne(
      { email },
      { $set: { password: hashedPassword } },
    );
    client.close();

    return Response.json({ message: 'Password was updated' }, { status: 200 });
  } catch (error) {
    throw error;
  }
}
