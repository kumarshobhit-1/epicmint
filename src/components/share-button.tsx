'use client';

import { Share2, Twitter, Facebook, Link as LinkIcon, MessageCircle, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
}

export function ShareButton({ title, description, url }: ShareButtonProps) {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link Copied',
        description: 'Link copied to clipboard',
      });
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${title} - ${url}`
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleRedditShare = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl, '_blank', 'width=550,height=420');
  };

  const handleEmailShare = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${description}\n\n${url}`)}`;
    window.location.href = emailUrl;
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const supportsNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {supportsNativeShare && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share via...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="h-4 w-4 mr-2 text-sky-500" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLinkedInShare}>
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTelegramShare}>
          <Send className="h-4 w-4 mr-2 text-sky-400" />
          Share on Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRedditShare}>
          <svg className="h-4 w-4 mr-2 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
          Share on Reddit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEmailShare}>
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Share via Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
