import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, Globe, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - EpicMint',
  description: 'EpicMint Privacy Policy - Learn how we protect and handle your personal information',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 mb-6">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Legal</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: October 8, 2025
            </p>
            
            <p className="text-muted-foreground">
              This Privacy Policy explains how EpicMint collects, uses, and protects your information when you use our NFT marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Email address and display name</li>
                    <li>Profile information and biography</li>
                    <li>Avatar and profile images</li>
                    <li>Social media links</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Wallet Information</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Wallet addresses and public keys</li>
                    <li>Transaction history and blockchain data</li>
                    <li>NFT ownership records</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Content Information</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Stories, comics, and poems you create</li>
                    <li>Images and multimedia content</li>
                    <li>NFT metadata and properties</li>
                    <li>Comments and interactions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Usage Information</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Pages visited and features used</li>
                    <li>Search queries and preferences</li>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Provision</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Create and manage your account</li>
                    <li>Process NFT minting and transactions</li>
                    <li>Display your content in the marketplace</li>
                    <li>Facilitate buying and selling of NFTs</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Communication</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Send transaction confirmations</li>
                    <li>Provide customer support</li>
                    <li>Send platform updates and notifications</li>
                    <li>Respond to your inquiries</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Platform Improvement</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Analyze usage patterns and trends</li>
                    <li>Improve our services and features</li>
                    <li>Develop new functionality</li>
                    <li>Ensure platform security and stability</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Public Information</h3>
                  <p className="text-muted-foreground mb-2">The following information is publicly visible on the blockchain and our platform:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Your wallet address and transaction history</li>
                    <li>NFTs you own, create, or trade</li>
                    <li>Public profile information you choose to share</li>
                    <li>Content you publish as NFTs</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Service Providers</h3>
                  <p className="text-muted-foreground mb-2">We may share information with trusted third parties who help us operate our platform:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Cloud hosting and storage providers</li>
                    <li>Analytics and monitoring services</li>
                    <li>Payment processors</li>
                    <li>Customer support tools</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-muted-foreground">We may disclose information when required by law or to protect our rights and users' safety.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication</li>
                  <li>Secure hosting infrastructure</li>
                  <li>Regular security updates and patches</li>
                </ul>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Important:</strong> While we take security seriously, no method of transmission over the internet is 100% secure. Please keep your wallet and account credentials safe.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Access and Control</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>View and update your profile information</li>
                    <li>Download your data</li>
                    <li>Delete your account</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Blockchain Considerations</h3>
                  <p className="text-muted-foreground">Information stored on the blockchain (transactions, NFT ownership) cannot be deleted as it's part of the permanent public record.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze platform usage and performance</li>
                  <li>Provide personalized content</li>
                  <li>Maintain your login session</li>
                </ul>
                
                <p className="text-muted-foreground">You can control cookies through your browser settings. See our <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> for more details.</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">EpicMint is not intended for users under 13 years old. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">If you have questions about this Privacy Policy or how we handle your information, please contact us:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Email:</strong> <a href="mailto:privacy@epicmint.com" className="text-primary hover:underline">privacy@epicmint.com</a></li>
                  <li><strong>Support:</strong> <Link href="/support" className="text-primary hover:underline">Visit our Support Center</Link></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}