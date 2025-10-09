'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';

const contactReasons = [
  'General Questions',
  'Technical Support',
  'Account Issues',
  'NFT Minting Problems',
  'Wallet Connection',
  'Payment Issues',
  'Report a Bug',
  'Feature Request',
  'Partnership Inquiry',
  'Other'
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'General Questions',
    message: '',
    subscribe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to your API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: `Thank you ${formData.name}, we'll get back to you within 24 hours.`,
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          reason: 'General Questions',
          message: '',
          subscribe: false
        });
      } else {
        throw new Error('Failed to send message');
      }

    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Contact Support
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-2">
              What can we help you with?
            </label>
            <select 
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {contactReasons.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea 
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Please describe your issue or question in detail..."
              rows={6}
              required
            />
          </div>
          
          <div className="flex items-start gap-2">
            <input 
              type="checkbox" 
              id="subscribe" 
              name="subscribe"
              checked={formData.subscribe}
              onChange={handleInputChange}
              className="mt-1" 
            />
            <label htmlFor="subscribe" className="text-sm text-muted-foreground">
              I'd like to receive updates about new features and improvements to EpicMint
            </label>
          </div>
          
          <Button 
            type="submit"
            size="lg" 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            We typically respond within 24 hours during business days
          </p>
        </form>
      </CardContent>
    </Card>
  );
}