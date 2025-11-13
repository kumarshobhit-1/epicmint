import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, reason, message, subscribe } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to Firestore
    const submissionData = {
      name,
      email,
      reason,
      message,
      subscribe: subscribe || false,
      status: 'unread',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'contact-submissions'), submissionData);

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      id: docRef.id
    });

  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
