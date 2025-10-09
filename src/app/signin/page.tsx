// app/signin/page.tsx
import { Metadata } from 'next';
import SignInForm from '@/components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In - EpicMint',
  description: 'Sign in to your EpicMint account and start creating NFTs',
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignInForm />
    </div>
  );
}