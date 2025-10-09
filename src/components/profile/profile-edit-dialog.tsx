'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { updateUserProfile } from '@/lib/db-service';
import { Edit2, Loader2, Twitter, Instagram, Globe, Github, Linkedin } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';

type ProfileEditDialogProps = {
  user: User;
  userProfile: UserProfile | null;
  onProfileUpdated: () => void;
};

export function ProfileEditDialog({ user, userProfile, onProfileUpdated }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields (removed profile image states)
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  
  // Social links
  const [twitter, setTwitter] = useState(userProfile?.socialLinks?.twitter || '');
  const [instagram, setInstagram] = useState(userProfile?.socialLinks?.instagram || '');
  const [website, setWebsite] = useState(userProfile?.socialLinks?.website || '');
  const [github, setGithub] = useState(userProfile?.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(userProfile?.socialLinks?.linkedin || '');

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update Firebase Auth profile (no photoURL update)
      await updateProfile(user, {
        displayName: displayName.trim() || undefined,
      });

      // Build complete social links object (including empty strings to clear fields)
      const socialLinks = {
        twitter: twitter.trim() || '',
        instagram: instagram.trim() || '',
        website: website.trim() || '',
        github: github.trim() || '',
        linkedin: linkedin.trim() || '',
      };

      // Update Firestore profile - always update socialLinks to clear removed values
      await updateUserProfile(user.uid, {
        uid: user.uid, // ✅ Add missing uid field!
        email: user.email || '',
        displayName: displayName.trim(),
        bio: bio.trim(),
        socialLinks: socialLinks,
      });

      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved successfully',
      });

      setOpen(false);
      onProfileUpdated();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      setOpen(newOpen);
      if (newOpen) {
        // Reset form when opening
        setDisplayName(userProfile?.displayName || user.displayName || '');
        setBio(userProfile?.bio || '');
        setTwitter(userProfile?.socialLinks?.twitter || '');
        setInstagram(userProfile?.socialLinks?.instagram || '');
        setWebsite(userProfile?.socialLinks?.website || '');
        setGithub(userProfile?.socialLinks?.github || '');
        setLinkedin(userProfile?.socialLinks?.linkedin || '');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and social media links
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              {displayName.length}/50 characters
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={200}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/200 characters
            </p>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Links</h3>
            
            {/* Twitter */}
            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-blue-400" />
                Twitter
              </Label>
              <Input
                id="twitter"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/username"
                type="url"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/username"
                type="url"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                Website
              </Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                type="url"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                type="url"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-600" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
