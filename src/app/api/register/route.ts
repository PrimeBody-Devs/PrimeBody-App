import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define the expected request body schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email } = validation.data;

    // In a real app, you would:
    // 1. Check if user with this email already exists
    // 2. Hash the password
    // 3. Create the user in your database
    // 4. Generate a session token
    // 5. Return the user data (excluding sensitive info)

    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response with user data (excluding password)
    return NextResponse.json({
      success: true,
      user: {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        createdAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
