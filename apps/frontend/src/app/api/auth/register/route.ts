//apps/frontend/../register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required for registration');
}

if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
}

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, age } = await request.json();

    // Validation
    if (!username || !email || !password || !age) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (age < 13) {
      return NextResponse.json(
        { message: 'You must be at least 13 years old' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      age,
      name: username,
      provider: 'credentials',
      emailVerified: null,
      createdAt: new Date(),
      piCoins: 100, // Welcome bonus
      role: 'user',
      preferences: {
        sports: [],
        teams: [],
        leagues: [],
        notifications: {
          email: true,
          push: true,
          matchUpdates: true,
          predictionReminders: true
        }
      }
    };

    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: result.insertedId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}