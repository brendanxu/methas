'use client';

import React from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { cn } from '@/lib/utils';

interface AntButtonProps extends AntdButtonProps {
  className?: string;
}

export const AntButton: React.FC<AntButtonProps> = ({ 
  className, 
  ...props 
}) => {
  return (
    <AntdButton
      className={cn('font-medium', className)}
      {...props}
    />
  );
};