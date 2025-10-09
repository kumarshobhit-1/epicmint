import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Globe, Users, Target, Zap, Shield, Home, Award, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";


const features = [
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: "AI-Powered Creation",
    description: "Generate unique NFTs using advanced AI technology for stories, poems, and digital art."
  },
  {
    icon: <Shield className="h-8 w-8 text-green-500" />,
    title: "Secure Blockchain",
    description: "Built on secure blockchain technology ensuring authentic ownership and transparent transactions."
  },
  {
    icon: <Users className="h-8 w-8 text-purple-500" />,
    title: "Community Driven",
    description: "Join a vibrant community of creators, collectors, and digital art enthusiasts."
  },
  {
    icon: <Target className="h-8 w-8 text-red-500" />,
    title: "Easy to Use",
    description: "User-friendly interface makes NFT creation and trading accessible to everyone."
  }
];

export default function AboutPage() {
  return (
    <div id="top" className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Home Button */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About EpicMint
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            EpicMint is a revolutionary NFT marketplace that combines the power of artificial intelligence 
            with blockchain technology to democratize digital content creation and ownership.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Launched in 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>4-Member Team</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>AI-Powered Platform</span>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-card/70 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-foreground mb-4">Our Mission</CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-4xl mx-auto">
                We believe that everyone should have the opportunity to create, own, and trade unique digital content. 
                EpicMint empowers creators by providing AI-assisted tools to generate compelling stories, poems, and artwork, 
                while ensuring true ownership through blockchain technology.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-500" />
                  Our Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  EpicMint was born from a simple idea: what if anyone could create professional-quality digital content 
                  and truly own it? Our team of passionate developers and blockchain enthusiasts came together to build 
                  a platform that makes NFT creation accessible to everyone.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Starting as a college project, EpicMint has evolved into a comprehensive platform that bridges the gap 
                  between creativity and technology, empowering creators worldwide to monetize their imagination.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-500" />
                  Why EpicMint?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>No Technical Barriers:</strong> Create NFTs without any coding knowledge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>AI-Powered:</strong> Generate content with cutting-edge AI technology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>True Ownership:</strong> Blockchain ensures authentic ownership rights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Community First:</strong> Built by creators, for creators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Makes Us Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        

        {/* Technology Stack */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-card/70 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground mb-4">Our Technology Stack</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Built with modern technologies to ensure performance, security, and scalability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "React", "Next.js", "TypeScript", "Tailwind CSS", 
                  "Firebase", "Node.js", "Solidity", "Web3.js",
                  "Blockchain", "MetaMask", "Vercel", "CSS Module", "Smart Contracts"
                ].map((tech, index) => (
                  <div key={index} className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <span className="font-medium text-foreground">{tech}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Development Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Development Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-card/70 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <CardTitle className="text-xl">Research & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We thoroughly research user needs, market trends, and emerging technologies to plan features that truly matter.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/70 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <CardTitle className="text-xl">Agile Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Using agile methodologies, we iterate quickly, test frequently, and continuously improve based on feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/70 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <CardTitle className="text-xl">Deploy & Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We deploy robust, scalable solutions and continuously monitor performance to ensure the best user experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground mb-8">Project Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-muted-foreground">Responsive Design</div>
                </div>
                <div className="p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-muted-foreground">Platform Availability</div>
                </div>
                <div className="p-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">AI</div>
                  <div className="text-muted-foreground">Powered Creation</div>
                </div>
                <div className="p-6">
                  <div className="text-4xl font-bold text-red-600 mb-2">∞</div>
                  <div className="text-muted-foreground">Creative Possibilities</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vision Section */}
        <div className="text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-bold mb-4">Our Vision</CardTitle>
              <CardDescription className="text-lg text-white/90 max-w-3xl mx-auto">
                We envision a future where creativity knows no bounds, where anyone can transform their ideas 
                into valuable digital assets, and where blockchain technology empowers true digital ownership. 
                EpicMint is not just a marketplace—it's a launchpad for the next generation of digital creators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/create">
                    Start Creating
                  </Link>
                </Button>
                {/* <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600" asChild>
                  <Link href="/support">
                    Contact Us
                  </Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-12">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href="#top" className="scroll-smooth">
              ↑ Back to Top
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}