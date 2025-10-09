import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Get all submissions
export async function GET() {
  try {
    const submissionsFile = path.join(process.cwd(), 'data', 'contact-submissions.json');
    const data = await fs.readFile(submissionsFile, 'utf8');
    const submissions = JSON.parse(data);
    return NextResponse.json(submissions.reverse());
  } catch (error) {
    console.error('Error reading submissions:', error);
    return NextResponse.json([]);
  }
}

// Update submission (mark as read, reply, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, data } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const submissionsFile = path.join(process.cwd(), 'data', 'contact-submissions.json');
    let submissions = [];
    
    try {
      const fileData = await fs.readFile(submissionsFile, 'utf8');
      submissions = JSON.parse(fileData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Submissions file not found' },
        { status: 404 }
      );
    }

    const submissionIndex = submissions.findIndex((sub: any) => sub.id === id);
    
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'markAsRead':
        submissions[submissionIndex].status = 'read';
        submissions[submissionIndex].readAt = new Date().toISOString();
        break;
        
      case 'markAsDone':
        submissions[submissionIndex].status = 'done';
        submissions[submissionIndex].completedAt = new Date().toISOString();
        break;
        
      case 'reply':
        if (!data.replyMessage) {
          return NextResponse.json(
            { error: 'Reply message is required' },
            { status: 400 }
          );
        }
        
        submissions[submissionIndex].reply = {
          message: data.replyMessage,
          repliedAt: new Date().toISOString(),
          repliedBy: data.repliedBy || 'Admin'
        };
        submissions[submissionIndex].status = 'replied';
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Save updated submissions
    await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: `Submission ${action} successfully`,
      submission: submissions[submissionIndex]
    });

  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete submission
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const submissionsFile = path.join(process.cwd(), 'data', 'contact-submissions.json');
    let submissions = [];
    
    try {
      const fileData = await fs.readFile(submissionsFile, 'utf8');
      submissions = JSON.parse(fileData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Submissions file not found' },
        { status: 404 }
      );
    }

    const originalLength = submissions.length;
    submissions = submissions.filter((sub: any) => sub.id !== id);
    
    if (submissions.length === originalLength) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Save updated submissions
    await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Submission deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
