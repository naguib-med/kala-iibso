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
import { CardTypeIcon } from './card-type-icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Plus } from 'lucide-react';

const CARD_TYPES = {
  visa: /^4/,
  mastercard: /^5[1-5]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/,
  dinersclub: /^3(?:0[0-5]|[68])/,
  jcb: /^(?:2131|1800|35)/,
} as const;

const getCardType = (number: string) => {
  const cleanNumber = number.replace(/\D/g, '');
  // Using a different variable name instead of '_' to avoid linting warning
  return Object.entries(CARD_TYPES).find(([cardName, pattern]) =>
    pattern.test(cleanNumber)
  )?.[0] || null;
};

const validateLuhn = (number: string) => {
  const digits = number.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  // Loop from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const paymentMethodSchema = z.object({
  cardNumber: z.string()
    .min(1, "Card number is required")
    .regex(/^[0-9\s]+$/, "Card number must contain only digits")
    .refine((val) => val.replace(/\s/g, "").length === 16, "Card number must be 16 digits")
    .refine(val => validateLuhn(val), "Invalid card number")
    .transform(val => val.replace(/\s/g, '')),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Must be in format MM/YY")
    .refine((val) => {
      const [month, year] = val.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date();
    }, "Card has expired"),
  cardHolder: z.string()
    .min(1, "Cardholder name is required")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .transform(val => val.toUpperCase()),
  cvv: z.string()
    .min(1, "CVV is required")
    .regex(/^[0-9]+$/, "CVV must contain only digits")
    .length(3, "CVV must be 3 digits"),
  isDefault: z.boolean().default(false),
});

type PaymentMethod = z.infer<typeof paymentMethodSchema> & {
  id: string;
  last4: string;
  cardType: string | null;
};

interface PaymentMethodFormProps {
  paymentMethods: PaymentMethod[];
  onPaymentMethodsChange: (methods: PaymentMethod[]) => void;
}

export function PaymentMethodForm({
  paymentMethods,
  onPaymentMethodsChange
}: PaymentMethodFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cardType, setCardType] = useState<string | null>(null);

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cardHolder: '',
      cvv: '',
      isDefault: false,
    },
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const type = getCardType(cleaned);
    setCardType(type);

    // Format based on card type
    if (type === 'amex') {
      return cleaned.replace(/(\d{4})(\d{6})?(\d{5})?/, (_, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join(' ')
      );
    }
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    try {
      // Remove spaces from card number before sending
      const formData = {
        cardNumber: values.cardNumber,
        last4: values.cardNumber.slice(-4),
        expiryDate: values.expiryDate,
        cardHolder: values.cardHolder,
        cardType: cardType,
        isDefault: values.isDefault,
      };

      const response = await fetch('/api/user/payment-methods', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment method');
      }

      const updatedMethod = await response.json();

      if (editingId) {
        onPaymentMethodsChange(paymentMethods.map(method =>
          method.id === editingId ? updatedMethod : method
        ));
      } else {
        onPaymentMethodsChange([...paymentMethods, updatedMethod]);
      }

      toast({
        title: 'Success',
        description: `Payment method ${editingId ? 'updated' : 'added'} successfully`,
      });

      form.reset();
      setIsEditing(false);
      setEditingId(null);
      setCardType(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save payment method',
      });
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    form.reset({
      ...method,
      cardNumber: `•••• •••• •••• ${method.last4}`,
      cvv: '•••',
    });
    setEditingId(method.id);
    setIsEditing(true);
    setCardType(method.cardType);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/user/payment-methods/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }

      onPaymentMethodsChange(paymentMethods.filter(method => method.id !== id));

      toast({
        title: 'Success',
        description: 'Payment method deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete payment method',
      });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s]/g, "");
    const formattedValue = formatCardNumber(value);
    form.setValue("cardNumber", formattedValue);
    setCardType(getCardType(value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    form.setValue("expiryDate", value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <CardTypeIcon
                  type={method.cardType}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <p className="font-medium">
                  •••• •••• •••• {method.last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {method.expiryDate}
                </p>
                {method.isDefault && (
                  <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-primary-foreground bg-primary rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(method)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(method.id)}
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
          Add New Payment Method
        </Button>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      <div className="absolute right-3 top-2.5">
                        <CardTypeIcon
                          type={cardType}
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="JOHN DOE" />
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
                      Set as default payment method
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your card information is encrypted and stored securely. We never store your CVV.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setCardType(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update' : 'Add'} Payment Method
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}