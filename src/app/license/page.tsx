import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Award, Code, Users, Globe, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'License - EpicMint',
  description: 'EpicMint License Information - Software licenses and intellectual property rights',
};

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-6">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Legal</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">
              License Information
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: October 8, 2025
            </p>
            
            <p className="text-muted-foreground">
              Information about software licenses, intellectual property rights, and open source components used in EpicMint.
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
                  <Shield className="w-5 h-5 text-blue-600" />
                  EpicMint Platform License
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Proprietary Software</h3>
                  <p className="text-muted-foreground">
                    The EpicMint platform, including its source code, design, and proprietary technologies, is owned by EpicMint and protected by copyright and other intellectual property laws.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Usage Rights</h3>
                  <p className="text-muted-foreground mb-2">Subject to our Terms of Service, you are granted a limited, non-exclusive, non-transferable license to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Access and use the EpicMint platform</li>
                    <li>Create, upload, and manage your content</li>
                    <li>Participate in the NFT marketplace</li>
                    <li>Use our API for personal or commercial purposes (where applicable)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Restrictions</h3>
                  <p className="text-muted-foreground mb-2">You may not:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Reverse engineer, decompile, or disassemble our software</li>
                    <li>Copy, modify, or create derivative works</li>
                    <li>Redistribute or sublicense our platform</li>
                    <li>Use our trademarks without permission</li>
                    <li>Remove or alter copyright notices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-600" />
                  Open Source Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  EpicMint is built using various open source libraries and frameworks. We acknowledge and appreciate the contributions of the open source community.
                </p>
                
                <div>
                  <h3 className="font-semibold mb-2">Core Framework</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Component</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">License</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Version</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Next.js</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">MIT</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">15.x</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">React</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">MIT</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">18.x</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">TypeScript</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Apache 2.0</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">5.x</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Tailwind CSS</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">MIT</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">3.x</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">UI Libraries</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Component</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">License</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Radix UI</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">MIT</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Accessible UI components</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Lucide React</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ISC</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Icon library</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Framer Motion</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">MIT</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Animations</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">clsx</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">MIT</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Utility functions</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Blockchain & Web3</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Component</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">License</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Web3.js</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">LGPL-3.0</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Ethereum interaction</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ethers.js</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">MIT</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Wallet integration</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">WalletConnect</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">GPL-3.0</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Mobile wallet connection</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  User-Generated Content License
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Content Ownership</h3>
                  <p className="text-muted-foreground">
                    You retain full ownership and copyright to all content you create and upload to EpicMint, including stories, comics, poems, and artwork.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Platform License Grant</h3>
                  <p className="text-muted-foreground mb-2">By uploading content, you grant EpicMint a non-exclusive, worldwide, royalty-free license to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Display your content on our platform</li>
                    <li>Distribute and promote your content</li>
                    <li>Create thumbnails and previews</li>
                    <li>Enable marketplace functionality</li>
                    <li>Back up and store your content</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">NFT Licensing</h3>
                  <p className="text-muted-foreground">
                    When you mint an NFT, you're creating a unique digital certificate of ownership. The copyright to the underlying content remains with you unless explicitly transferred.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Commercial Use</h3>
                  <p className="text-muted-foreground">
                    NFT buyers receive rights as specified in the NFT's metadata and description. This typically includes personal use rights unless commercial rights are explicitly granted.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Creative Commons Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  EpicMint supports Creative Commons licensing for users who want to share their work with specific permissions.
                </p>
                
                <div>
                  <h3 className="font-semibold mb-2">Supported CC Licenses</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>CC BY:</strong> Attribution required</li>
                    <li><strong>CC BY-SA:</strong> Attribution + Share-alike</li>
                    <li><strong>CC BY-NC:</strong> Attribution + Non-commercial</li>
                    <li><strong>CC BY-ND:</strong> Attribution + No derivatives</li>
                    <li><strong>CC BY-NC-SA:</strong> Attribution + Non-commercial + Share-alike</li>
                    <li><strong>CC BY-NC-ND:</strong> Attribution + Non-commercial + No derivatives</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Public Domain</h3>
                  <p className="text-muted-foreground">
                    Users can also dedicate their work to the public domain using CC0, waiving all copyright and related rights.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Third-Party Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Images and Graphics</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Stock photos from Unsplash (Unsplash License)</li>
                    <li>Icons from Heroicons (MIT License)</li>
                    <li>Illustrations from undraw.co (Open Source)</li>
                    <li>Avatar placeholders (Various open licenses)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Fonts</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Inter (SIL Open Font License)</li>
                    <li>JetBrains Mono (SIL Open Font License)</li>
                    <li>System fonts (Platform-specific licenses)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Audio</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>UI sound effects (Various Creative Commons licenses)</li>
                    <li>Notification sounds (Royalty-free)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>API and Developer Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">API License</h3>
                  <p className="text-muted-foreground">
                    Our API is provided under a separate developer license agreement. Developers can use our API for both personal and commercial projects, subject to rate limits and terms of use.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">SDK and Tools</h3>
                  <p className="text-muted-foreground">
                    Developer tools and SDKs are released under MIT license unless otherwise specified, allowing for maximum flexibility in integration projects.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Copyright Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">DMCA Compliance</h3>
                  <p className="text-muted-foreground">
                    EpicMint complies with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been infringed, please contact our DMCA agent.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Reporting Copyright Infringement</h3>
                  <p className="text-muted-foreground mb-2">To report copyright infringement, please provide:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Description of the copyrighted work</li>
                    <li>Location of the infringing material</li>
                    <li>Your contact information</li>
                    <li>Statement of good faith belief</li>
                    <li>Statement of accuracy and authorization</li>
                    <li>Physical or electronic signature</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">DMCA Contact</h3>
                  <p className="text-muted-foreground">
                    Email: <a href="mailto:dmca@epicmint.com" className="text-primary hover:underline">dmca@epicmint.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Attribution Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  When using EpicMint's API or embedding our content, please include appropriate attribution:
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
                  "Powered by EpicMint - NFT Marketplace for Creative Content"
                </div>
                
                <p className="text-muted-foreground">
                  For open source components we use, please refer to their individual license files for specific attribution requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>License Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">For questions about licensing, copyright, or intellectual property:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Legal Team:</strong> <a href="mailto:legal@epicmint.com" className="text-primary hover:underline">legal@epicmint.com</a></li>
                  <li><strong>DMCA Agent:</strong> <a href="mailto:dmca@epicmint.com" className="text-primary hover:underline">dmca@epicmint.com</a></li>
                  <li><strong>Developer Relations:</strong> <a href="mailto:dev@epicmint.com" className="text-primary hover:underline">dev@epicmint.com</a></li>
                  <li><strong>Terms of Service:</strong> <Link href="/terms-of-service" className="text-primary hover:underline">View our Terms</Link></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}