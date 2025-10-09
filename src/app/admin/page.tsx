import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  FileText, 
  TrendingUp,
  Mail,
  Settings,
  BarChart3,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { promises as fs } from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Admin Dashboard - EpicMint',
  description: 'EpicMint Admin Dashboard - Manage your platform',
};

async function getStats() {
  try {
    // Get contact submissions count
    const submissionsFile = path.join(process.cwd(), 'data', 'contact-submissions.json');
    let submissionsCount = 0;
    try {
      const data = await fs.readFile(submissionsFile, 'utf8');
      const submissions = JSON.parse(data);
      submissionsCount = submissions.length;
    } catch {
      submissionsCount = 0;
    }

    return {
      contactSubmissions: submissionsCount,
      totalUsers: 1250, // Mock data
      totalNFTs: 892,   // Mock data
      revenue: '$12,450' // Mock data
    };
  } catch (error) {
    return {
      contactSubmissions: 0,
      totalUsers: 0,
      totalNFTs: 0,
      revenue: '$0'
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const quickActions = [
    {
      title: 'Contact Submissions',
      description: 'View and manage contact form submissions',
      count: stats.contactSubmissions,
      href: '/admin/contact-submissions',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      title: 'User Management',
      description: 'Manage platform users and permissions',
      count: stats.totalUsers,
      href: '/admin/users',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Content Moderation',
      description: 'Review and moderate NFT content',
      count: stats.totalNFTs,
      href: '/admin/content',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'View platform analytics and insights',
      count: stats.revenue,
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      type: 'contact',
      message: 'New contact form submission received',
      time: '2 minutes ago',
      urgent: true
    },
    {
      type: 'user',
      message: 'New user registered: john@example.com',
      time: '15 minutes ago',
      urgent: false
    },
    {
      type: 'nft',
      message: 'NFT minted: "Digital Poem #123"',
      time: '1 hour ago',
      urgent: false
    },
    {
      type: 'system',
      message: 'System backup completed successfully',
      time: '2 hours ago',
      urgent: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening on EpicMint today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {action.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {action.count}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {action.description}
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={action.href} className="flex items-center justify-between">
                      Manage
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.urgent ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/contact-submissions">
                      <Mail className="w-4 h-4 mr-2" />
                      Check Messages
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/users">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Platform Settings
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/analytics">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Setup Needed</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blockchain</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Connected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}