'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  isDefault: z.boolean().default(false),
});

type Address = z.infer<typeof addressSchema> & { id: string };

interface AddressFormProps {
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
}

export function AddressForm({ addresses, onAddressesChange }: AddressFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    try {
      const response = await fetch('/api/user/addresses', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...values, id: editingId } : values),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const updatedAddress = await response.json();
      
      if (editingId) {
        onAddressesChange(addresses.map(addr => 
          addr.id === editingId ? updatedAddress : addr
        ));
      } else {
        onAddressesChange([...addresses, updatedAddress]);
      }

      toast({
        title: 'Success',
        description: editingId ? 'Address updated successfully' : 'Address added successfully',
      });

      form.reset();
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save address',
      });
    }
  };

  const handleEdit = (address: Address) => {
    form.reset(address);
    setEditingId(address.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      onAddressesChange(addresses.filter(addr => addr.id !== id));
      
      toast({
        title: 'Success',
        description: 'Address deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete address',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-medium">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state} {address.zipCode}
              </p>
              {address.isDefault && (
                <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-primary-foreground bg-primary rounded-full">
                  Default
                </span>
              )}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(address)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(address.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!isEditing && (
        <Button onClick={() => setIsEditing(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Set as default address
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update' : 'Add'} Address
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
