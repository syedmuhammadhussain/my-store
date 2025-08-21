// src/components/FeatureItem.tsx
'use client';

import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  icon: LucideIcon;
  title: string;
}

export function FeatureItem({ icon: Icon, title }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <Icon className="h-8 w-8 text-blue-600" />
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  );
}
