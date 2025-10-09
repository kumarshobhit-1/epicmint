import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pen, 
  Sparkles, 
  Wallet, 
  Globe, 
  Shield, 
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Palette,
  FileText
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works - EpicMint',
  description: 'Learn how EpicMint works and start creating NFTs from your stories, comics, and poems',
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Write Your Content",
      description: "Create amazing stories, comics, or poems using our intuitive editor or AI assistance",
      icon: Pen,
      color: "from-purple-600 to-purple-700",
      details: [
        "Choose from Stories, Comics, or Poems",
        "Use our built-in rich text editor",
        "Get AI assistance for creative inspiration",
        "Add images and multimedia content"
      ]
    },
    {
      step: 2,
      title: "Connect Your Wallet",
      description: "Link your Web3 wallet to interact with the blockchain and manage your NFTs",
      icon: Wallet,
      color: "from-pink-600 to-pink-700",
      details: [
        "Support for MetaMask and other wallets",
        "Secure connection to the blockchain",
        "Manage your digital assets",
        "View transaction history"
      ]
    },
    {
      step: 3,
      title: "Mint as NFT",
      description: "Transform your creative work into a unique, verifiable digital asset on the blockchain",
      icon: Sparkles,
      color: "from-blue-600 to-blue-700",
      details: [
        "Create unique digital certificates",
        "Immutable ownership records",
        "Set royalties for future sales",
        "Add metadata and properties"
      ]
    },
    {
      step: 4,
      title: "Share & Earn",
      description: "List your NFTs in our marketplace and start earning from your creative work",
      icon: Globe,
      color: "from-green-600 to-green-700",
      details: [
        "Set your own prices",
        "Reach a global audience",
        "Earn from initial sales",
        "Collect royalties on resales"
      ]
    }
  ];

  const features = [
    {
      title: "Ownership & Authenticity",
      description: "Every NFT is unique and verifiable on the blockchain",
      icon: Shield,
      benefits: [
        "Immutable proof of ownership",
        "Verified authenticity",
        "Protection against counterfeits",
        "Transparent transaction history"
      ]
    },
    {
      title: "Creator Economy",
      description: "Build a sustainable income from your creative work",
      icon: TrendingUp,
      benefits: [
        "Direct sales to collectors",
        "Ongoing royalty payments",
        "No intermediaries",
        "Global marketplace reach"
      ]
    },
    {
      title: "Community Building",
      description: "Connect with readers and build your creative community",
      icon: Users,
      benefits: [
        "Engage with your audience",
        "Build a follower base",
        "Collaborate with other creators",
        "Join creator events and contests"
      ]
    }
  ];

  const contentTypes = [
    {
      title: "Stories",
      description: "Craft compelling narratives that captivate readers",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      examples: [
        "Short fiction",
        "Novel chapters", 
        "Sci-fi adventures",
        "Romance tales"
      ]
    },
    {
      title: "Comics",
      description: "Create visual stories with panels and characters",
      icon: Palette,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      examples: [
        "Superhero comics",
        "Webcomics",
        "Manga style",
        "Graphic novels"
      ]
    },
    {
      title: "Poems",
      description: "Express emotions through beautiful verses",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      examples: [
        "Haiku collections",
        "Love sonnets",
        "Free verse",
        "Song lyrics"
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
              <Globe className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">How It Works</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6">
              From Idea to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                NFT Income
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Learn how EpicMint transforms your creative writing into valuable digital assets that can be owned, traded, and monetized on the blockchain.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/create">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/docs">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started with EpicMint in just a few easy steps
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.step} className="mb-12 last:mb-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <step.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                              Step {step.step}
                            </div>
                            <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                          {step.description}
                        </p>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardHeader>
                    </Card>
                  </div>
                  
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} text-center`}>
                    <div className="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}>
                        <step.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8">
                    <ArrowRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">What You Can Create</h2>
            <p className="text-muted-foreground text-lg">Turn any form of creative writing into valuable NFTs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contentTypes.map((type) => (
              <Card key={type.title} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl ${type.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <type.icon className={`w-8 h-8 ${type.color}`} />
                  </div>
                  <CardTitle className="font-headline text-xl">{type.title}</CardTitle>
                  <p className="text-muted-foreground">{type.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {type.examples.map((example, i) => (
                      <li key={i} className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {example}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full mt-6" variant="outline">
                    <Link href="/create">
                      Create {type.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">Why Choose EpicMint?</h2>
            <p className="text-muted-foreground text-lg">Powerful features designed for creative success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Creative Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already earning from their stories, comics, and poems on EpicMint.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-purple-600">
              <Link href="/create">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your First NFT
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link href="/">
                <Globe className="w-5 h-5 mr-2" />
                Explore Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}