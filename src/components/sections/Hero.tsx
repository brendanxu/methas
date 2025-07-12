'use client';

import React from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section className={cn('bg-gradient-to-br from-primary-50 to-secondary-50 py-20', className)}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <motion.h1 
            className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to{' '}
            <span className='text-primary-500'>SouthPole</span>
          </motion.h1>
          
          <motion.p 
            className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Leading the way in climate solutions and sustainable development for a better future.
          </motion.p>
          
          <motion.div 
            className='flex flex-col sm:flex-row gap-4 justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size='large'>Get Started</Button>
            <Button variant='secondary' size='large'>Learn More</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};