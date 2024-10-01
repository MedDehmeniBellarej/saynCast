import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form'; // Ensure this is a login form component or adjust accordingly
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'huber+suhner Login',
  description: 'Login forms built using the components.'
};

export default function LoginPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-3 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted text-white lg:flex dark:border-r lg:col-span-2" 
           style={{ backgroundImage: `url('/images/Huber-Cover.svg')`, backgroundSize: 'cover' }}>
        <div className="relative z-20 flex items-center text-lg font-medium p-10">
          <img src={"icons/logoHuber.svg"} alt="Logo" className="mr-2 h-16 w-44" /> {/* Increased size */}
        </div>       
      </div>
      <div className="flex h-full items-center p-4 lg:p-8 lg:col-span-1">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your username and password to sign in
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
