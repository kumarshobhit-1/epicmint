import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Scale, Shield, AlertTriangle, Users, Coins } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - EpicMint',
  description: 'EpicMint Terms of Service - Legal terms and conditions for using our NFT marketplace',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6">
              <Scale className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Legal</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: October 8, 2025
            </p>
            
            <p className="text-muted-foreground">
              These Terms of Service govern your use of EpicMint, an NFT marketplace for creative content.
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
                  <FileText className="w-5 h-5 text-blue-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing or using EpicMint, you agree to be bound by these Terms of Service and our Privacy Policy. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Important:</strong> These terms constitute a legally binding agreement between you and EpicMint.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  User Accounts and Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Eligibility Requirements</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>You must be at least 13 years old to use EpicMint</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You must comply with all applicable laws and regulations</li>
                    <li>You must not be prohibited from using our services</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Account Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Keep your account credentials secure</li>
                    <li>Maintain accurate and up-to-date information</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>You are responsible for all activities under your account</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Content and Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Your Content</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>You retain ownership of content you create and upload</li>
                    <li>You grant us license to display, distribute, and promote your content</li>
                    <li>You must own or have rights to all content you upload</li>
                    <li>You are responsible for ensuring your content doesn't infringe on others' rights</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Prohibited Content</h3>
                  <p className="text-muted-foreground mb-2">You may not upload content that:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Infringes on intellectual property rights</li>
                    <li>Contains hate speech, harassment, or discrimination</li>
                    <li>Is pornographic, violent, or harmful to minors</li>
                    <li>Violates any laws or regulations</li>
                    <li>Contains malware or malicious code</li>
                    <li>Is spam or misleading content</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Platform Content</h3>
                  <p className="text-muted-foreground">EpicMint and its licensors own all rights to the platform, including design, code, and trademarks.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  NFTs and Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">NFT Creation and Ownership</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>NFTs represent ownership of digital assets on the blockchain</li>
                    <li>You retain copyright to the underlying content</li>
                    <li>NFT ownership is recorded on the blockchain</li>
                    <li>We do not control blockchain transactions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Marketplace Transactions</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>All sales are final once confirmed on the blockchain</li>
                    <li>We may charge platform fees for transactions</li>
                    <li>You are responsible for applicable taxes</li>
                    <li>Gas fees and blockchain costs are separate from our fees</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Wallet Integration</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>You must connect a compatible cryptocurrency wallet</li>
                    <li>We are not responsible for wallet security or recovery</li>
                    <li>Lost private keys cannot be recovered</li>
                    <li>Verify all transaction details before confirming</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-2">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Use the platform for illegal activities</li>
                  <li>Attempt to hack, disrupt, or compromise our systems</li>
                  <li>Create fake accounts or impersonate others</li>
                  <li>Manipulate prices or engage in market manipulation</li>
                  <li>Upload malicious content or spam</li>
                  <li>Circumvent our security measures</li>
                  <li>Use bots or automated tools without permission</li>
                  <li>Interfere with other users' use of the platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Platform Availability and Modifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Availability</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>We strive to maintain platform availability but cannot guarantee 100% uptime</li>
                    <li>Maintenance and updates may temporarily interrupt service</li>
                    <li>Blockchain network issues may affect functionality</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Platform Modifications</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>We may modify, update, or discontinue features at any time</li>
                    <li>We will provide reasonable notice for significant changes</li>
                    <li>Continued use constitutes acceptance of modifications</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Disclaimers and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Disclaimers</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>EpicMint is provided "as is" without warranties</li>
                    <li>We do not guarantee the accuracy of user-generated content</li>
                    <li>Blockchain transactions are irreversible</li>
                    <li>NFT values can fluctuate and may become worthless</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                  <p className="text-muted-foreground">To the maximum extent permitted by law, EpicMint shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless EpicMint from any claims, damages, or expenses arising from your use of the platform, your content, or your violation of these terms.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Termination</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>You may delete your account at any time</li>
                    <li>We may suspend or terminate accounts for terms violations</li>
                    <li>Termination does not affect blockchain-recorded transactions</li>
                    <li>Some data may be retained as required by law</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Effect of Termination</h3>
                  <p className="text-muted-foreground">Upon termination, your right to use the platform ceases, but NFTs you own remain on the blockchain.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Governing Law</h3>
                  <p className="text-muted-foreground">These terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Dispute Resolution Process</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>First, contact our support team to resolve issues</li>
                    <li>If unresolved, disputes may be subject to binding arbitration</li>
                    <li>Class action lawsuits are waived where legally permitted</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may update these Terms of Service from time to time. We will notify users of material changes and update the "Last updated" date. 
                  Continued use of the platform constitutes acceptance of the updated terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">For questions about these Terms of Service, please contact us:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Email:</strong> <a href="mailto:legal@epicmint.com" className="text-primary hover:underline">legal@epicmint.com</a></li>
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