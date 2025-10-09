'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWallet } from '@/contexts/wallet-context';
import { useNftStore } from '@/hooks/use-nft-store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wallet, Sparkles, FileText, Tag, Percent, AlertCircle, Upload, Link as LinkIcon, Image as ImageIcon, Home } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { NFT_CATEGORIES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters long.' }),
  category: z.enum(['story', 'poem', 'comic', 'novel', 'shortstory', 'other']),
  tags: z.string().optional(),
  price: z.number().min(0.001, { message: 'Price must be at least 0.001 ETH.' }),
  imageUrl: z.string().min(1, { message: 'Please provide an image (upload or URL).' }),
  royaltyPercentage: z.number().min(0).max(30).default(10),
});

function CreatePage() {
  const router = useRouter();
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const { addNft } = useNftStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');

  // Set page title
  useEffect(() => {
    document.title = 'Create NFT - EpicMint';
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category: 'story',
      tags: '',
      price: 0.1,
      imageUrl: '',
      royaltyPercentage: 10,
    },
  });

  const contentLength = form.watch('content')?.length || 0;
  const titleLength = form.watch('title')?.length || 0;
  const descLength = form.watch('description')?.length || 0;

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JPG, PNG, GIF, or WebP image.',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setUploadedImage(base64String);
      form.setValue('imageUrl', base64String);
      toast({
        title: 'Image uploaded!',
        description: `${file.name} ready to mint.`,
      });
    };
    reader.readAsDataURL(file);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConnected || !walletAddress) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to mint an NFT.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newNft = await addNft({
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        owner: walletAddress,
      });

      toast({
        title: '🎉 NFT Minted Successfully!',
        description: `"${newNft.title}" is now live on the marketplace.`,
      });

      router.push(`/nft/${newNft.hash}`);
    } catch (error) {
      toast({
        title: 'Failed to mint NFT',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Create Your Masterpiece</span>
          </div>
          <h1 className="font-headline text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mint Your Story
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn your creative work into a unique NFT and share it with the world
          </p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                  <FileText className="w-7 h-7 text-purple-600" />
                  Create NFT
                </CardTitle>
                <CardDescription className="mt-2">
                  Fill in the details below to mint your creation on the blockchain
                </CardDescription>
              </div>
              {isConnected && (
                <Badge variant="secondary" className="gap-1.5">
                  <Wallet className="w-3 h-3" />
                  Connected
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>

          <CardContent>
            {!isConnected ? (
              <Alert className="border-2 border-purple-500/50 bg-purple-500/5">
                <Wallet className="h-5 w-5 text-purple-600" />
                <AlertTitle className="text-lg font-semibold">Connect Your Wallet</AlertTitle>
                <AlertDescription className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect your Web3 wallet to start creating and minting NFTs on the blockchain.
                  </p>
                  <Button onClick={connectWallet} size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Give your creation a captivating title..."
                            className="text-lg h-12"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <FormMessage />
                          <span className={titleLength >= 3 ? 'text-green-600' : ''}>
                            {titleLength}/50
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-600" />
                          Category
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {NFT_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <span className="flex items-center gap-2">
                                  {category.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the type that best describes your work
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a compelling description that captures the essence of your creation..."
                            className="resize-y min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <FormDescription>
                            A brief summary that will appear in listings
                          </FormDescription>
                          <span className={descLength >= 10 ? 'text-green-600' : ''}>
                            {descLength}/200
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Full Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Start writing your story, poem, or comic content here..."
                            className="resize-y min-h-[300px] font-mono text-sm leading-relaxed"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between text-xs">
                          <FormDescription>
                            The complete text of your creation
                          </FormDescription>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">
                              Words: {Math.round(contentLength / 5)}
                            </span>
                            <span className={contentLength >= 20 ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                              Characters: {contentLength}
                            </span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-600" />
                          Tags <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="fantasy, adventure, magic, mystery..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add comma-separated tags to help readers discover your work
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Royalty */}
                  <FormField
                    control={form.control}
                    name="royaltyPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Percent className="w-4 h-4 text-purple-600" />
                          Creator Royalty (0-30%)
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              min="0"
                              max="30"
                              className="max-w-[120px] h-12 text-center text-lg font-semibold"
                              {...field}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                field.onChange(isNaN(val) ? undefined : val);
                              }}
                            />
                            <span className="text-2xl font-bold text-purple-600">%</span>
                          </div>
                        </FormControl>
                        <FormDescription className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            You'll earn this percentage from every future sale of your NFT
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          Price (ETH) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              step="0.001"
                              min="0.001"
                              placeholder="0.1"
                              className="h-12 text-lg font-semibold"
                              {...field}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                field.onChange(isNaN(val) ? undefined : val);
                              }}
                            />
                            <span className="text-lg font-bold text-purple-600">ETH</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Set your NFT's listing price (minimum 0.001 ETH)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload/URL */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-purple-600" />
                          Cover Image <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Tabs value={imageMode} onValueChange={(v) => setImageMode(v as 'url' | 'upload')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="upload" className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload Image
                              </TabsTrigger>
                              <TabsTrigger value="url" className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Image URL
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="upload" className="space-y-4">
                              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
                                <Input
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                  onChange={handleImageUpload}
                                  className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  Supported: JPG, PNG, GIF, WebP (Max 5MB)
                                </p>
                              </div>

                              {uploadedImage && (
                                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-purple-500">
                                  <img
                                    src={uploadedImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <Badge className="bg-green-600">
                                      ✓ Uploaded
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="url" className="space-y-4">
                              <Input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="h-12"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setUploadedImage('');
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Paste a direct link to your image (JPG, PNG, GIF)
                              </p>

                              {field.value && field.value.startsWith('http') && (
                                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-purple-500">
                                  <img
                                    src={field.value}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Invalid+URL';
                                    }}
                                  />
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </FormControl>
                        <FormDescription>
                          Choose to upload an image file or provide a direct URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Submit Button */}
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Minting Your NFT...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Mint Your Creation
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      By minting, you agree that your content is original and you own all rights to it.
                    </p>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(CreatePage);
