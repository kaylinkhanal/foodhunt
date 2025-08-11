
import axios from 'axios';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const values = await request.json();
    const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`,values)
    if (data && data.token) {
        console.log('Authentication Token Received:', data.token);
        const cookieStore = await cookies()
        await cookieStore.set('auth_token', data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          maxAge: 60 * 60 * 24 * 7,
          path: '/', 
          sameSite: 'lax', 
        });
      }
      if (data) {
        return NextResponse.json(data, { status: 200 });
      }

  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 } // Internal Server Error
    );
  }
}