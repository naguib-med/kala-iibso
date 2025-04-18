'use client';

import { CreditCard } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardTypeIconProps {
  type: string | null;
  className?: string;
}

export function CardTypeIcon({ type, className }: CardTypeIconProps) {
  if (!type) {
    return <CreditCard className={cn('w-5 h-5', className)} />;
  }

  return (
    <Image
      src={`/images/cards/${type}.svg`}
      alt={type}
      width={20}
      height={20}
      className={className}
    />
  );
}
