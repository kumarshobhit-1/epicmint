import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, BarChart3, Shield, Globe, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - EpicMint',
  description: 'EpicMint Cookie Policy - Learn about how we use cookies and tracking technologies',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 mb-6">
              <Cookie className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Legal</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">
              Cookie Policy
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: October 8, 2025
            </p>
            
            <p className="text-muted-foreground">
              This Cookie Policy explains how EpicMint uses cookies and similar technologies to enhance your experience.
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
                  <Cookie className="w-5 h-5 text-orange-600" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
                </p>
                
                <div>
                  <h3 className="font-semibold mb-2">Types of Cookies We Use</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                    <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a specified period</li>
                    <li><strong>First-party Cookies:</strong> Set directly by EpicMint</li>
                    <li><strong>Third-party Cookies:</strong> Set by our partners and service providers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Essential Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">These cookies are necessary for our website to function properly and cannot be disabled.</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Cookie Name</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">session_id</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Maintains your login session</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">csrf_token</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Security protection against attacks</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">theme_preference</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Remembers your dark/light mode preference</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">wallet_connection</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Maintains wallet connection state</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Analytics Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">These cookies help us understand how visitors interact with our platform so we can improve it.</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Service</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Google Analytics</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Website usage statistics and user behavior</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Hotjar</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">User experience analysis and heatmaps</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Custom Analytics</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Platform-specific usage metrics</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">90 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Note:</strong> Analytics cookies are anonymized and help us improve our platform. You can opt out of these through your cookie preferences.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  Functional Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">These cookies enable enhanced functionality and personalization features.</p>
                
                <div>
                  <h3 className="font-semibold mb-2">What They Do</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Remember your search preferences and filters</li>
                    <li>Save your language and region settings</li>
                    <li>Maintain your notification preferences</li>
                    <li>Store your layout and display preferences</li>
                    <li>Remember items in your watchlist</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p className="text-muted-foreground">Most functional cookies persist for 30 days to 1 year, depending on the specific feature.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Third-Party Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Some cookies are set by third-party services we use to enhance our platform.</p>
                
                <div>
                  <h3 className="font-semibold mb-2">Third-Party Services</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Wallet Providers:</strong> MetaMask, WalletConnect, and other wallet services may set cookies to maintain your connection
                    </li>
                    <li>
                      <strong>Social Media:</strong> If you share content on social platforms, they may set tracking cookies
                    </li>
                    <li>
                      <strong>Payment Processors:</strong> Crypto payment services may use cookies for transaction processing
                    </li>
                    <li>
                      <strong>Content Delivery:</strong> CDN services may set cookies to optimize content delivery
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Important:</strong> Third-party cookies are governed by the respective privacy policies of those services.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Browser Settings</h3>
                  <p className="text-muted-foreground mb-2">You can control cookies through your browser settings:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Platform Cookie Settings</h3>
                  <p className="text-muted-foreground">
                    We provide cookie preference controls in your account settings where you can:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Accept or reject non-essential cookies</li>
                    <li>Choose specific cookie categories</li>
                    <li>View detailed information about each cookie type</li>
                    <li>Update your preferences at any time</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Opt-Out Links</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
                    <li><a href="https://www.hotjar.com/legal/compliance/opt-out" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Hotjar Opt-out</a></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Cookie Security and Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Security Measures</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Cookies are secured using encryption</li>
                    <li>Session cookies expire automatically</li>
                    <li>Sensitive data is never stored in cookies</li>
                    <li>Regular security audits of cookie usage</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Privacy Protection</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Analytics data is anonymized</li>
                    <li>No personal information in tracking cookies</li>
                    <li>Compliance with privacy regulations</li>
                    <li>Regular data retention review</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Impact of Disabling Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-2">Disabling cookies may affect your experience:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>You may need to log in repeatedly</li>
                  <li>Your preferences won't be saved</li>
                  <li>Some features may not work properly</li>
                  <li>Wallet connections may be less stable</li>
                  <li>We won't be able to provide personalized content</li>
                </ul>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> Essential cookies cannot be disabled as they are required for basic platform functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. 
                  We will notify you of any material changes and update the "Last updated" date at the top of this policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions About Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">If you have questions about our use of cookies, please contact us:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Email:</strong> <a href="mailto:privacy@epicmint.com" className="text-primary hover:underline">privacy@epicmint.com</a></li>
                  <li><strong>Privacy Policy:</strong> <Link href="/privacy-policy" className="text-primary hover:underline">View our Privacy Policy</Link></li>
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