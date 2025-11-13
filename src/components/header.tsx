// components/Header.tsx (or your Header file)
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Firebase and Auth Context imports
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

// Your existing components
import { SearchForm } from './search-form';
import DeploymentHistory from './deployment-history';
import { ThemeToggle } from './theme-toggle';
import ConnectWallet from './connect-wallet';

// Shadcn UI and Lucide Icons
import { Button } from './ui/button';
import { BookOpen, Sparkles, FileCode, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const { user, isLoading } = useAuth(); // Auth state ko get karein
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/signin'); // Logout ke baad signin page par bhej dein
    setIsOpen(false); // Close mobile menu
  };

  const MobileMenu = () => (
    <div className="flex flex-col space-y-4 p-4">
      {/* Search Form */}
      <div className="w-full">
        <SearchForm />
      </div>
      
      {/* Navigation Links */}
      <div className="flex flex-col space-y-3">
        <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
          <Link href="/create">
            <BookOpen className="h-4 w-4 mr-2" />
            Create NFT
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
          <Link href="/create-ai">
            <Sparkles className="h-4 w-4 mr-2" />
            Create with AI
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
          <Link href="/contract">
            <FileCode className="h-4 w-4 mr-2" />
            Smart Contract
          </Link>
        </Button>
      </div>

      {/* Theme Toggle & Deployment History */}
      <div className="flex items-center gap-2 pt-2">
        <ConnectWallet />
        <DeploymentHistory />
        <ThemeToggle />
      </div>

      {/* Auth Section */}
      <div className="pt-4 border-t border-border">
        {isLoading ? (
          <div className="h-9 w-full bg-muted rounded-md animate-pulse"></div>
        ) : user ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-secondary/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || ''} alt="User Avatar" />
                <AvatarFallback>
                  {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">My Account</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="justify-start" 
              onClick={() => {
                router.push(`/profile/${user.uid}`);
                setIsOpen(false);
              }}
            >
              Profile & Wallet
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start text-red-500 hover:text-red-600" 
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Button variant="ghost" asChild className="justify-start" onClick={() => setIsOpen(false)}>
              <Link href="/signin">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button asChild className="justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" onClick={() => setIsOpen(false)}>
              <Link href="/signup">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 font-headline text-lg font-semibold"
            >
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EpicMint
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-between ml-6">
            <div className="w-full max-w-sm">
              <SearchForm />
            </div>
            <nav className="flex items-center gap-1 ml-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/create">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/create-ai">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contract">
                  <FileCode className="h-4 w-4 mr-2" />
                  Contract
                </Link>
              </Button>
              <ConnectWallet />
              <DeploymentHistory />
              <ThemeToggle />
              
              {/* Desktop Auth Section */}
              <div className="ml-2">
                {isLoading ? (
                  <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || ''} alt="User Avatar" />
                          <AvatarFallback className="text-xs">
                            {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">My Account</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/profile/${user.uid}`)}>
                        Profile & Wallet
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/signin">
                        <LogIn className="h-4 w-4 mr-1" />
                        <span className="hidden lg:inline">Sign In</span>
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link href="/signup">
                        <UserPlus className="h-4 w-4 mr-1" />
                        <span className="hidden lg:inline">Sign Up</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      EpicMint
                    </span>
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Web3 Marketplace for Stories, Comics & Poems
                  </SheetDescription>
                </SheetHeader>
                <MobileMenu />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
