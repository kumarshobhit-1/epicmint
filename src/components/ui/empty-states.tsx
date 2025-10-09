'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Plus, 
  Heart, 
  User, 
  FileText, 
  Image, 
  MessageCircle, 
  Bell,
  TrendingUp,
  Wallet,
  Star,
  Shield,
  Wifi,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction 
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center max-w-md mx-auto">
      <div className="mb-6 flex justify-center">
        <div className="p-4 rounded-full bg-secondary/50">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
      
      <div className="space-y-3">
        {action && (
          action.href ? (
            <Link href={action.href}>
              <Button variant={action.variant || "default"} className="w-full">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button 
              variant={action.variant || "default"} 
              className="w-full"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <Link href={secondaryAction.href}>
              <Button variant="outline" className="w-full">
                {secondaryAction.label}
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    </Card>
  );
}

// Pre-built Empty States
interface NoNFTsFoundProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  showCreateButton?: boolean;
}

export function NoNFTsFound({ 
  title = "No NFTs Found",
  description = "We couldn't find any NFTs matching your search criteria. Try adjusting your filters or search terms.",
  actionLabel = "Clear Filters",
  actionHref = "/",
  showCreateButton = true
}: NoNFTsFoundProps) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title={title}
      description={description}
      action={{
        label: actionLabel,
        href: actionHref,
        variant: "outline"
      }}
      secondaryAction={showCreateButton ? {
        label: "Create NFT",
        href: "/create"
      } : undefined}
    />
  );
}

export function NoNFTsCreated() {
  return (
    <EmptyState
      icon={<Plus className="h-8 w-8 text-muted-foreground" />}
      title="No NFTs Created Yet"
      description="You haven't created any NFTs yet. Start by creating your first digital artwork, story, or comic."
      action={{
        label: "Create Your First NFT",
        href: "/create"
      }}
      secondaryAction={{
        label: "Create with AI",
        href: "/create-ai"
      }}
    />
  );
}

export function NoFavorites() {
  return (
    <EmptyState
      icon={<Heart className="h-8 w-8 text-muted-foreground" />}
      title="No Favorites Yet"
      description="You haven't favorited any NFTs yet. Explore the marketplace and save NFTs you love."
      action={{
        label: "Browse NFTs",
        href: "/"
      }}
      secondaryAction={{
        label: "View Trending",
        href: "/?sort=popular"
      }}
    />
  );
}

export function NoProfile() {
  return (
    <EmptyState
      icon={<User className="h-8 w-8 text-muted-foreground" />}
      title="Profile Not Found"
      description="This user profile doesn't exist or has been removed. Check the URL and try again."
      action={{
        label: "Go Home",
        href: "/"
      }}
      secondaryAction={{
        label: "Browse Creators",
        href: "/creators"
      }}
    />
  );
}

export function NoComments() {
  return (
    <EmptyState
      icon={<MessageCircle className="h-8 w-8 text-muted-foreground" />}
      title="No Comments Yet"
      description="Be the first to share your thoughts about this NFT. Your feedback helps creators improve."
      action={{
        label: "Add First Comment",
        onClick: () => {
          // Scroll to comment form
          const commentForm = document.getElementById('comment-form');
          commentForm?.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    />
  );
}

export function NoNotifications() {
  return (
    <EmptyState
      icon={<Bell className="h-8 w-8 text-muted-foreground" />}
      title="No Notifications"
      description="You're all caught up! When you get new followers, likes, or comments, they'll appear here."
      action={{
        label: "Browse NFTs",
        href: "/",
        variant: "outline"
      }}
    />
  );
}

export function NoActivity() {
  return (
    <EmptyState
      icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
      title="No Activity Yet"
      description="Start creating, buying, or favoriting NFTs to see your activity timeline here."
      action={{
        label: "Create an NFT",
        href: "/create"
      }}
      secondaryAction={{
        label: "Explore Marketplace",
        href: "/"
      }}
    />
  );
}

export function WalletNotConnected() {
  return (
    <EmptyState
      icon={<Wallet className="h-8 w-8 text-muted-foreground" />}
      title="Wallet Not Connected"
      description="Connect your wallet to access this feature and interact with NFTs on the blockchain."
      action={{
        label: "Connect Wallet",
        onClick: () => {
          // Trigger wallet connection
          const event = new CustomEvent('connect-wallet');
          window.dispatchEvent(event);
        }
      }}
    />
  );
}

export function NoCollections() {
  return (
    <EmptyState
      icon={<Image className="h-8 w-8 text-muted-foreground" />}
      title="No Collections"
      description="You haven't created any collections yet. Group your NFTs into collections to organize and showcase them better."
      action={{
        label: "Create Collection",
        href: "/collections/create"
      }}
    />
  );
}

export function NoReviews() {
  return (
    <EmptyState
      icon={<Star className="h-8 w-8 text-muted-foreground" />}
      title="No Reviews Yet"
      description="This NFT hasn't been reviewed yet. Be the first to rate and review this artwork."
      action={{
        label: "Write Review",
        onClick: () => {
          const reviewForm = document.getElementById('review-form');
          reviewForm?.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    />
  );
}

export function Offline() {
  return (
    <EmptyState
      icon={<Wifi className="h-8 w-8 text-muted-foreground" />}
      title="You're Offline"
      description="Check your internet connection and try again. Some features may not work without an internet connection."
      action={{
        label: "Try Again",
        onClick: () => window.location.reload(),
        variant: "outline"
      }}
    />
  );
}

export function ServerError() {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
      title="Something Went Wrong"
      description="We're experiencing technical difficulties. Please try again in a few moments or contact support if the problem persists."
      action={{
        label: "Try Again",
        onClick: () => window.location.reload()
      }}
      secondaryAction={{
        label: "Go Home",
        href: "/"
      }}
    />
  );
}

export function AccessDenied() {
  return (
    <EmptyState
      icon={<Shield className="h-8 w-8 text-muted-foreground" />}
      title="Access Denied"
      description="You don't have permission to view this content. Please log in or contact the owner if you believe this is an error."
      action={{
        label: "Sign In",
        href: "/signin"
      }}
      secondaryAction={{
        label: "Go Home",
        href: "/"
      }}
    />
  );
}

export function MaintenanceMode() {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-8 w-8 text-amber-500" />}
      title="Under Maintenance"
      description="We're currently performing scheduled maintenance to improve your experience. Please check back in a few minutes."
      action={{
        label: "Check Status",
        href: "/status",
        variant: "outline"
      }}
    />
  );
}

// Large Empty State for Full Pages
export function LargeEmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction 
}: EmptyStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="mb-8 flex justify-center">
          <div className="p-6 rounded-full bg-secondary/30">
            {icon}
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button variant={action.variant || "default"} size="lg" className="w-full sm:w-auto">
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button 
                variant={action.variant || "default"} 
                size="lg"
                className="w-full sm:w-auto"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )
          )}
          
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {secondaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}