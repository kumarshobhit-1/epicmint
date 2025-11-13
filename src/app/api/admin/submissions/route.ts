import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

// Get all submissions
export async function GET() {
  try {
    const q = query(
      collection(db, 'contact-submissions'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
    
    return NextResponse.json(submissions);
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

    const submissionRef = doc(db, 'contact-submissions', id);
    let updateData: any = {};

    // Handle different actions
    switch (action) {
      case 'markAsRead':
        updateData = {
          status: 'read',
          readAt: Timestamp.now(),
        };
        break;
        
      case 'markAsDone':
        updateData = {
          status: 'done',
          completedAt: Timestamp.now(),
        };
        break;
        
      case 'reply':
        if (!data.replyMessage) {
          return NextResponse.json(
            { error: 'Reply message is required' },
            { status: 400 }
          );
        }
        
        updateData = {
          reply: {
            message: data.replyMessage,
            repliedAt: new Date().toISOString(),
            repliedBy: data.repliedBy || 'Admin'
          },
          status: 'replied',
        };
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await updateDoc(submissionRef, updateData);

    return NextResponse.json({ 
      success: true, 
      message: `Submission ${action} successfully`,
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const submissionRef = doc(db, 'contact-submissions', id);
    await deleteDoc(submissionRef);

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
