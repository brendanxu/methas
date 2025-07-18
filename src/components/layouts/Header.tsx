'use client';

import React from 'react';
import { SouthPoleOfficialNav } from '@/components/navigation/SouthPoleOfficialNav';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return <SouthPoleOfficialNav className={className} />;
};

export default Header;