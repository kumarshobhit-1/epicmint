import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Sparkles, 
  FileCode, 
  Users, 
  Shield, 
  Zap,
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation - EpicMint',
  description: 'Complete guide to using EpicMint NFT marketplace for stories, comics, and poems',
};

export default function DocumentationPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn the basics of creating and managing NFTs on EpicMint",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      items: [
        { title: "Create Your First NFT", href: "/create", description: "Step by step guide to mint your first story, comic, or poem" },
        { title: "Set Up Your Wallet", href: "#wallet-setup", description: "Connect and configure your Web3 wallet" },
        { title: "Understanding Gas Fees", href: "#gas-fees", description: "Learn about transaction costs on the blockchain" },
      ]
    },
    {
      title: "Creating Content",
      description: "Master the art of creating compelling digital content",
      icon: BookOpen,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      items: [
        { title: "Writing Stories", href: "#stories", description: "Best practices for creating engaging story NFTs" },
        { title: "Comic Creation", href: "#comics", description: "Tips for designing and structuring comic NFTs" },
        { title: "Poetry Guidelines", href: "#poems", description: "Craft beautiful poem NFTs that resonate" },
        { title: "AI-Assisted Creation", href: "/create-ai", description: "Use AI to enhance your creative process" },
      ]
    },
    {
      title: "Marketplace",
      description: "Buy, sell, and trade NFTs in the EpicMint marketplace",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      items: [
        { title: "Buying NFTs", href: "#buying", description: "How to purchase NFTs from other creators" },
        { title: "Selling Your Work", href: "#selling", description: "List your NFTs for sale in the marketplace" },
        { title: "Transfer Ownership", href: "#transfer", description: "Send NFTs to other wallet addresses" },
        { title: "Pricing Strategies", href: "#pricing", description: "Set competitive prices for your creations" },
      ]
    },
    {
      title: "Smart Contracts",
      description: "Technical details about the underlying blockchain technology",
      icon: FileCode,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      items: [
        { title: "Contract Overview", href: "/contract", description: "Understand the smart contract powering EpicMint" },
        { title: "Security Features", href: "#security", description: "Built-in protections and safety measures" },
        { title: "Verification Process", href: "#verification", description: "How NFT authenticity is guaranteed" },
      ]
    },
    {
      title: "Community",
      description: "Connect with other creators and build your following",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      items: [
        { title: "Profile Setup", href: "/profile", description: "Create an attractive creator profile" },
        { title: "Building Audience", href: "#audience", description: "Grow your follower base and engagement" },
        { title: "Community Guidelines", href: "#guidelines", description: "Rules and best practices for the community" },
      ]
    },
    {
      title: "Troubleshooting",
      description: "Solutions to common issues and problems",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      items: [
        { title: "Common Issues", href: "#issues", description: "Solutions to frequently encountered problems" },
        { title: "Wallet Problems", href: "#wallet-issues", description: "Fix wallet connection and transaction issues" },
        { title: "Contact Support", href: "/support", description: "Get help from our support team" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 mb-6">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Documentation</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6">
              Complete Guide to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EpicMint
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Everything you need to know about creating, buying, and selling NFTs for stories, comics, and poems on our Web3 marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/create">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#quick-start">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Quick Start Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Card key={section.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <CardTitle className="font-headline text-xl">{section.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <Link 
                          href={item.href}
                          className="flex items-start gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors group/item"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm group-hover/item:text-primary transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="quick-start" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">Quick Start Guide</h2>
            <p className="text-muted-foreground text-lg">Get up and running in just a few steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Connect your Web3 wallet to start creating and trading NFTs",
                icon: Shield,
              },
              {
                step: "02", 
                title: "Create Content",
                description: "Write your story, comic, or poem and mint it as an NFT",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Share & Earn",
                description: "List your NFT in the marketplace and start earning",
                icon: Users,
              }
            ].map((item) => (
              <Card key={item.step} className="text-center relative overflow-hidden">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 text-6xl font-bold text-purple-100 dark:text-purple-900/20">
                    {item.step}
                  </div>
                  <CardTitle className="font-headline text-xl relative z-10">{item.title}</CardTitle>
                  <CardDescription className="relative z-10">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/support">
                  <Users className="w-5 h-5 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://discord.gg/epicmint" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Join Discord
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}