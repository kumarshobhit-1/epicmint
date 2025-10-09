// components/auth/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/db-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, UserPlus, Chrome, ArrowRight, Sparkles, Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await createUserProfile({
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || email.split('@')[0],
        bio: '',
        photoURL: user.photoURL || undefined,
        walletAddress: undefined,
        favorites: [],
        collections: [],
        createdNfts: [],
        ownedNfts: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      toast({ title: "Success", description: "Account created successfully! Redirecting..." });
      router.push(`/profile/${user.uid}`);
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      // Firebase error codes ko check karein
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please sign in instead.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. It should be at least 6 characters long.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
      }

      toast({ 
        title: "Sign-Up Failed", 
        description: errorMessage, 
        variant: 'destructive' 
      });
    }
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user profile in Firestore (will merge if exists)
      await createUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        bio: '',
        photoURL: user.photoURL || undefined,
        walletAddress: undefined,
        favorites: [],
        collections: [],
        createdNfts: [],
        ownedNfts: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      toast({ title: "Success", description: "Signed in with Google successfully!" });
      router.push(`/profile/${user.uid}`);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-2 border-purple-500/20 dark:border-purple-500/30">
      <CardHeader className="space-y-3">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-base">
          Join EpicMint and start your NFT journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="pl-10 h-11 border-2 focus:border-purple-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" />
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="pl-10 pr-10 h-11 border-2 focus:border-purple-500 transition-colors"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 font-semibold" 
          onClick={handleGoogleSignIn}
        >
          <Chrome className="w-5 h-5" />
          Sign up with Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}