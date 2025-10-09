// components/footer.tsx
'use client';

import Link from 'next/link';
import { Github, Twitter, Mail, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    marketplace: [
      { label: 'Explore NFTs', href: '/' },
      { label: 'Create NFT', href: '/create' },
      { label: 'Create with AI', href: '/create-ai' },
      { label: 'My Profile', href: '/profile' },
    ],
    categories: [
      { label: 'Stories', href: '/?category=story' },
      { label: 'Comics', href: '/?category=comic' },
      { label: 'Poems', href: '/?category=poem' },
      { label: 'All NFTs', href: '/' },
    ],
    resources: [
      { label: 'About Us', href: '/about' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Smart Contract', href: '/contract' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Support', href: '/support' },
      { label: 'Admin', href: '/admin' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'License', href: '/license' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:codeminted0@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="border-t bg-secondary/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8">
            {/* Brand Section */}
            <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-headline text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EpicMint
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                The Web3 marketplace for creators to write, own, and earn from their stories, comics, and poems as NFTs.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg border border-transparent hover:border-primary/20"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Marketplace Links */}
            <div className="col-span-1">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                Marketplace
              </h3>
              <ul className="space-y-2">
                {footerLinks.marketplace.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories Links */}
            <div className="col-span-1">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                Categories
              </h3>
              <ul className="space-y-2">
                {footerLinks.categories.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="col-span-1">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                Resources
              </h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="col-span-1">
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                Legal
              </h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left order-2 md:order-1">
            © {currentYear} EpicMint. All rights reserved.
          </p>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground order-1 md:order-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by EpicMint Team</span>
          </div>

          <div className="items-center gap-4 text-xs text-muted-foreground order-3 hidden sm:flex">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
