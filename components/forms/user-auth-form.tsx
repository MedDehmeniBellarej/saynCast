'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from '@/context/SessionContext'; // Import useSession

const formSchema = z.object({
  username: z.string().nonempty({ message: 'Enter your username' }),
  password: z.string().nonempty({ message: 'Enter your password' })
});

type UserFormValue = z.infer<typeof formSchema>;

async function handleLogin(data: UserFormValue) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    username: data.username,
    password: data.password
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect
  };

  const response = await fetch("https://idp.sayncast.dubai-app.com/auth/login", requestOptions);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Login failed');
  }

  return result;
}

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setSession } = useSession(); // Access setSession from context
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      const result = await handleLogin(data);

      // Store the session data using context and local storage
      setSession(result);
      localStorage.setItem('session', JSON.stringify(result));

      // Show success toast
      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in.',
        variant: 'default',
        duration: 3000,  // Toast will disappear after 3 seconds
      });

      // Redirect to the dashboard after a delay to allow the toast to be visible
      setTimeout(() => {
        router.push(callbackUrl);
      }, 500);  // Redirect after 3 seconds
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'Login failed. Please try again.',
        variant: 'destructive',
        duration: 3000,  // Toast will disappear after 3 seconds
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if access token exists in local storage
    const session = localStorage.getItem('session');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.accessToken) {
        setSession(parsedSession);
      }
    }
  }, [setSession]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your username..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} className="ml-auto w-full" type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
