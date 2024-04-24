import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

const regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export async function POST(req, res) {
  const body = await req.json();
  const { email, password } = body;
  const condition = password.length < 6 || !regexEmail.test(email);

  if (condition) {
    Response.json({ message: 'Invalid data' }, { status: 422 });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('next-auth');

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      client.close();

      return Response.json({ message: 'User already exists' }, { status: 422 });
    }

    const hashedPassword = await hashPassword(password);
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    client.close();

    return Response.json(
      { message: 'Success', id: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    throw error;
  }
}
