import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ContactForm from '@/components/contact-form';
import { 
  MessageCircle, 
  Mail, 
  Clock, 
  Users, 
  BookOpen, 
  Shield,
  ExternalLink,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support - EpicMint',
  description: 'Get help and support for using EpicMint NFT marketplace',
};

export default function SupportPage() {
  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      color: "from-purple-600 to-purple-700",
      status: "Available",
      statusColor: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      action: "Start Chat",
      href: "#chat"
    },
    {
      title: "Email Support", 
      description: "Send us a detailed message about your issue",
      icon: Mail,
      color: "from-pink-600 to-pink-700",
      status: "24h Response",
      statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      action: "Send Email",
      href: "mailto:support@epicmint.com"
    },
    {
      title: "Documentation",
      description: "Find answers in our comprehensive guides",
      icon: BookOpen,
      color: "from-blue-600 to-blue-700",
      status: "Self-Service",
      statusColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
      action: "Browse Docs",
      href: "/docs"
    }
  ];

  const faqItems = [
    {
      question: "How do I connect my wallet?",
      answer: "Click the 'Connect Wallet' button in the header and select your preferred wallet (MetaMask, WalletConnect, etc.). Make sure you have a Web3 wallet installed in your browser.",
      category: "Getting Started"
    },
    {
      question: "What are gas fees and why do I need to pay them?",
      answer: "Gas fees are transaction costs required by the blockchain network to process your NFT minting, buying, or selling transactions. These fees go to network validators, not to EpicMint.",
      category: "Blockchain"
    },
    {
      question: "How do I set a price for my NFT?",
      answer: "When listing your NFT for sale, you can set a fixed price in ETH. Consider factors like content quality, rarity, and market demand when pricing your work.",
      category: "Selling"
    },
    {
      question: "Can I edit my NFT after minting?",
      answer: "Once minted on the blockchain, the core content cannot be changed. However, you can update the listing price, description, and some metadata through your profile.",
      category: "NFTs"
    },
    {
      question: "How do royalties work?",
      answer: "You can set a royalty percentage (typically 5-10%) when minting. This means you'll earn a percentage of every future sale of your NFT automatically.",
      category: "Earnings"
    },
    {
      question: "What file formats are supported?",
      answer: "For text content, we support rich text formatting. For images, we accept JPG, PNG, GIF, and WebP files up to 10MB. Comics can include multiple images.",
      category: "Technical"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 mb-6">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Support Center</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6">
              We're Here to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Help You
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Get quick answers to your questions or contact our support team for personalized assistance with EpicMint.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search for help articles..."
                className="pl-10 pr-4 py-3 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">Choose Your Support Method</h2>
            <p className="text-muted-foreground text-lg">Multiple ways to get the help you need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportOptions.map((option) => (
              <Card key={option.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="font-headline text-xl">{option.title}</CardTitle>
                  <p className="text-muted-foreground">{option.description}</p>
                  <Badge className={`mx-auto ${option.statusColor}`}>
                    {option.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={option.href}>
                      {option.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Quick answers to common questions</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="group hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {item.question}
                      </CardTitle>
                    </div>
                    <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/docs">
                <BookOpen className="w-5 h-5 mr-2" />
                View All Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground text-lg">
                Can't find what you're looking for? Send us a detailed message and we'll get back to you soon.
              </p>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Status & Emergency */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Marketplace</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">NFT Minting</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Generation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href="https://status.epicmint.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Detailed Status
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Emergency Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For critical issues affecting your account security or transactions:
                  </p>
                  <div className="space-y-2">
                    <Button asChild variant="destructive" size="sm" className="w-full">
                      <a href="mailto:emergency@epicmint.com">
                        <Mail className="w-4 h-4 mr-2" />
                        emergency@epicmint.com
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href="https://discord.gg/epicmint" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Join Discord
                      </a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Emergency support is available 24/7 for security-related issues
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}