'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, User, MessageSquare, Download, Trash2, Send, Loader2, Reply, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot 
} from 'firebase/firestore';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  reason: string;
  message: string;
  subscribe: boolean;
  timestamp: string;
  createdAt?: string;
  status?: string;
  reply?: {
    message: string;
    repliedAt: string;
    repliedBy: string;
  };
  readAt?: string;
  completedAt?: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [showReplyFor, setShowReplyFor] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch submissions from Firestore directly
  const fetchSubmissions = async () => {
    try {
      const q = query(
        collection(db, 'contact-submissions'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const submissionsData = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as ContactSubmission;
      });
      
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Real-time listener for submissions
    const q = query(
      collection(db, 'contact-submissions'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as ContactSubmission;
      });
      
      setSubmissions(submissionsData);
    }, (error) => {
      console.error('Error listening to submissions:', error);
    });

    return () => unsubscribe();
  }, []);

  // Mark as read
  const handleMarkAsRead = async (id: string) => {
    setLoading(prev => ({ ...prev, [`read-${id}`]: true }));
    
    try {
      const submissionRef = doc(db, 'contact-submissions', id);
      await updateDoc(submissionRef, {
        status: 'read',
        readAt: Timestamp.now(),
      });

      toast({
        title: "Success",
        description: "Submission marked as read!",
      });
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark submission as read",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [`read-${id}`]: false }));
    }
  };

  // Mark as done
  const handleMarkAsDone = async (id: string) => {
    setLoading(prev => ({ ...prev, [`done-${id}`]: true }));
    
    try {
      const submissionRef = doc(db, 'contact-submissions', id);
      await updateDoc(submissionRef, {
        status: 'done',
        completedAt: Timestamp.now(),
      });

      toast({
        title: "Success",
        description: "Submission marked as done!",
      });
    } catch (error) {
      console.error('Error marking as done:', error);
      toast({
        title: "Error",
        description: "Failed to mark submission as done",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [`done-${id}`]: false }));
    }
  };

  // Send reply
  const handleSendReply = async (id: string) => {
    const replyMessage = replyTexts[id]?.trim();
    if (!replyMessage) return;

    setLoading(prev => ({ ...prev, [`reply-${id}`]: true }));
    
    try {
      const submissionRef = doc(db, 'contact-submissions', id);
      await updateDoc(submissionRef, {
        reply: {
          message: replyMessage,
          repliedAt: new Date().toISOString(),
          repliedBy: 'Admin'
        },
        status: 'replied',
      });

      setReplyTexts(prev => ({ ...prev, [id]: '' }));
      setShowReplyFor(null);
      toast({
        title: "Success",
        description: "Reply sent successfully!",
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [`reply-${id}`]: false }));
    }
  };

  // Delete submission
  const handleDelete = async (id: string) => {
    setLoading(prev => ({ ...prev, [`delete-${id}`]: true }));
    
    try {
      const submissionRef = doc(db, 'contact-submissions', id);
      await deleteDoc(submissionRef);

      toast({
        title: "Success",
        description: "Submission deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [`delete-${id}`]: false }));
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'unread': return 'destructive';
      case 'read': return 'secondary';
      case 'replied': return 'default';
      case 'done': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-headline text-3xl font-bold mb-2">Contact Form Submissions</h1>
                <p className="text-muted-foreground">
                  Total submissions: {submissions.length}
                </p>
              </div>
              {submissions.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              )}
            </div>
          </div>

          {submissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground">
                  Contact form submissions will appear here once users start submitting forms.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{submission.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <a 
                                href={`mailto:${submission.email}`}
                                className="hover:text-primary transition-colors"
                              >
                                {submission.email}
                              </a>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(submission.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{submission.reason}</Badge>
                        {submission.status && (
                          <Badge variant={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                        )}
                        {submission.subscribe && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Newsletter
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(submission.id)}
                          disabled={loading[`delete-${submission.id}`]}
                        >
                          {loading[`delete-${submission.id}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2">Message:</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {submission.message}
                      </p>
                    </div>

                    {submission.reply && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Admin Reply:</h4>
                        <p className="text-blue-700 mb-2">{submission.reply.message}</p>
                        <p className="text-xs text-blue-600">
                          Replied by {submission.reply.repliedBy} on {new Date(submission.reply.repliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {showReplyFor === submission.id && (
                      <div className="border rounded-lg p-4 mb-4 bg-muted/20">
                        <h4 className="font-medium mb-3">Send Reply:</h4>
                        <Textarea
                          placeholder="Type your reply here..."
                          value={replyTexts[submission.id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({
                            ...prev,
                            [submission.id]: e.target.value
                          }))}
                          className="mb-3"
                          rows={4}
                        />
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleSendReply(submission.id)}
                            disabled={!replyTexts[submission.id]?.trim() || loading[`reply-${submission.id}`]}
                          >
                            {loading[`reply-${submission.id}`] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-1" />
                            )}
                            {loading[`reply-${submission.id}`] ? 'Sending...' : 'Send Reply'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowReplyFor(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {submission.id}</span>
                        {submission.subscribe !== undefined && (
                          <span>
                            Subscribe to updates: {submission.subscribe ? 'Yes' : 'No'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowReplyFor(showReplyFor === submission.id ? null : submission.id)}
                          disabled={submission.status === 'done'}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsRead(submission.id)}
                          disabled={loading[`read-${submission.id}`] || submission.status === 'read' || submission.status === 'done'}
                        >
                          {loading[`read-${submission.id}`] ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <MessageSquare className="h-4 w-4 mr-1" />
                          )}
                          {loading[`read-${submission.id}`] ? 'Marking...' : 'Mark as Read'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsDone(submission.id)}
                          disabled={loading[`done-${submission.id}`] || submission.status === 'done'}
                        >
                          {loading[`done-${submission.id}`] ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          {loading[`done-${submission.id}`] ? 'Marking...' : 'Mark as Done'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
