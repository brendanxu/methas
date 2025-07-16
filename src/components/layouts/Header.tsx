'use client';

import React from 'react';
import { EnhancedHeader } from './EnhancedHeader';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return <EnhancedHeader className={className} />;
};

export default Header;