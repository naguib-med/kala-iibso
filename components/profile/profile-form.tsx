'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  preferredSize: z.string().optional(),
});

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, []);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || session?.user?.name || '',
      email: profile?.email || session?.user?.email || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      preferredSize: profile?.preferredSize || '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || session?.user?.name || '',
        email: profile.email || session?.user?.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        preferredSize: profile.preferredSize || '',
      });
    }
  }, [profile, form, session?.user?.name, session?.user?.email]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    try {
      setIsUploading(true);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', session?.user?.id || '');

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload avatar');
      }

      const { url } = await response.json();

      await update({
        user: {
          ...session?.user,
          image: url,
        }
      });

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();

      await update({
        user: {
          ...session?.user,
          name: updatedProfile.name,
          email: updatedProfile.email,
          preferredSize: updatedProfile.preferredSize,
        }
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={session?.user?.image || ''} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="avatar-upload"
            onChange={handleAvatarUpload}
          />
          <Button
            variant="outline"
            disabled={isUploading}
            onClick={() =>
              document.getElementById('avatar-upload')?.click()
            }
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Change Avatar
              </>
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Size</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., M, L, XL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
    </div>
  );
}
