import { NextRequest, NextResponse } from 'next/server';

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

    const fs = require('fs').promises;
    const path = require('path');
    
    const submission = {
      name,
      email,
      reason,
      message,
      subscribe,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    try {
      const submissionsDir = path.join(process.cwd(), 'data');
      await fs.mkdir(submissionsDir, { recursive: true });
      
      const submissionsFile = path.join(submissionsDir, 'contact-submissions.json');
      let submissions = [];
      
      try {
        const data = await fs.readFile(submissionsFile, 'utf8');
        submissions = JSON.parse(data);
      } catch (error) {
        submissions = [];
      }
      
      submissions.push(submission);
      
      await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));
      
      
    } catch (fileError) {
      console.error('Error saving submission to file:', fileError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      id: submission.id
    });

  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}