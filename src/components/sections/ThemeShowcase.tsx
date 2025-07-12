'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { AntButton } from '@/components/ant/AntButton';
import { AccessibilityPanel } from '@/components/ui/AccessibilityPanel';
import { Card, Space, Typography, Divider, Tag, Switch } from 'antd';
import { useTheme, useThemeColors } from '@/app/providers';
import { cn } from '@/lib/utils';

const { Title, Paragraph, Text } = Typography;

interface ThemeShowcaseProps {
  className?: string;
}

export const ThemeShowcase: React.FC<ThemeShowcaseProps> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <section className={cn('py-16 bg-muted/50', className)}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title level={2} className='!mb-4'>
              South Pole Theme System
            </Title>
            <Paragraph className='text-lg !mb-6'>
              Showcasing our brand colors, typography, and component consistency between Tailwind CSS and Ant Design.
            </Paragraph>
            
            <div className='flex items-center justify-center gap-4 mb-8'>
              <Text>Light Mode</Text>
              <Switch 
                checked={isDark} 
                onChange={toggleTheme}
                checkedChildren='🌙'
                unCheckedChildren='☀️'
              />
              <Text>Dark Mode</Text>
            </div>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Brand Colors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card title='Brand Colors' className='h-full'>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center'>
                    <div className='w-full h-16 bg-primary-500 rounded-lg mb-2 shadow-medium'></div>
                    <Text strong>Primary</Text>
                    <br />
                    <Text type='secondary'>#002145</Text>
                  </div>
                  <div className='text-center'>
                    <div className='w-full h-16 bg-secondary-500 rounded-lg mb-2 shadow-medium'></div>
                    <Text strong>Secondary</Text>
                    <br />
                    <Text type='secondary'>#00875A</Text>
                  </div>
                </div>
                
                <div className='grid grid-cols-3 gap-3'>
                  <div className='text-center'>
                    <div className='w-full h-12 bg-warning-500 rounded-lg mb-2'></div>
                    <Text className='text-xs'>Warning</Text>
                  </div>
                  <div className='text-center'>
                    <div className='w-full h-12 bg-success-500 rounded-lg mb-2'></div>
                    <Text className='text-xs'>Success</Text>
                  </div>
                  <div className='text-center'>
                    <div className='w-full h-12 bg-error-500 rounded-lg mb-2'></div>
                    <Text className='text-xs'>Error</Text>
                  </div>
                </div>

                <Divider />
                
                <div>
                  <Text strong className='block mb-2'>Themed Colors</Text>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='text-center'>
                      <div className='w-full h-12 bg-ice-500 rounded-lg mb-2'></div>
                      <Text className='text-xs'>Ice Blue</Text>
                    </div>
                    <div className='text-center'>
                      <div className='w-full h-12 bg-arctic-500 rounded-lg mb-2'></div>
                      <Text className='text-xs'>Arctic Gray</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Component Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card title='Component Examples' className='h-full'>
              <Space direction='vertical' size='large' className='w-full'>
                {/* Tailwind Buttons */}
                <div>
                  <Text strong className='block mb-3'>Tailwind Components</Text>
                  <Space wrap>
                    <Button variant='primary' size='small'>Primary</Button>
                    <Button variant='secondary' size='small'>Secondary</Button>
                    <Button variant='ghost' size='small'>Ghost</Button>
                    <Button variant='success' size='small'>Success</Button>
                  </Space>
                </div>

                {/* Ant Design Buttons */}
                <div>
                  <Text strong className='block mb-3'>Ant Design Components</Text>
                  <Space wrap>
                    <AntButton type='primary' size='small'>Primary</AntButton>
                    <AntButton size='small'>Default</AntButton>
                    <AntButton type='dashed' size='small'>Dashed</AntButton>
                    <AntButton type='link' size='small'>Link</AntButton>
                  </Space>
                </div>

                {/* Tags and Status */}
                <div>
                  <Text strong className='block mb-3'>Status Indicators</Text>
                  <Space wrap>
                    <Tag color='blue'>Climate Action</Tag>
                    <Tag color='green'>Sustainable</Tag>
                    <Tag color='orange'>Carbon Neutral</Tag>
                    <Tag color='red'>Urgent</Tag>
                  </Space>
                </div>

                {/* Typography */}
                <div>
                  <Text strong className='block mb-3'>Typography</Text>
                  <div className='space-y-2'>
                    <Title level={4} className='!mb-1'>Heading 4</Title>
                    <Paragraph className='!mb-1'>
                      This is a paragraph with <Text strong>bold text</Text> and{' '}
                      <Text type='secondary'>secondary text</Text>.
                    </Paragraph>
                    <Text code>Code snippet: npm install</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </motion.div>
        </div>

        {/* Animation Examples */}
        <motion.div
          className='mt-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card title='Animation Examples'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-primary-500 rounded-lg mx-auto mb-2 animate-pulse-slow'></div>
                <Text className='text-sm'>Pulse</Text>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-secondary-500 rounded-lg mx-auto mb-2 animate-bounce-gentle'></div>
                <Text className='text-sm'>Bounce</Text>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-warning-500 rounded-lg mx-auto mb-2 animate-float'></div>
                <Text className='text-sm'>Float</Text>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-primary-500 rounded-lg mx-auto mb-2 animate-glow'></div>
                <Text className='text-sm'>Glow</Text>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Theme Values Display */}
        <motion.div
          className='mt-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card title='Current Theme Values'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <Text strong className='block mb-2'>Theme Mode</Text>
                <Tag color={isDark ? 'purple' : 'gold'}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Tag>
              </div>
              
              <div>
                <Text strong className='block mb-2'>Background Colors</Text>
                <div className='space-y-1 text-sm'>
                  <div>Background: <code>{colors.background}</code></div>
                  <div>Foreground: <code>{colors.foreground}</code></div>
                  <div>Muted: <code>{colors.muted}</code></div>
                </div>
              </div>
              
              <div>
                <Text strong className='block mb-2'>Brand Colors</Text>
                <div className='space-y-1 text-sm'>
                  <div>Primary: <code>{colors.primary}</code></div>
                  <div>Secondary: <code>{colors.secondary}</code></div>
                  <div>Warning: <code>{colors.warning}</code></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Accessibility Panel */}
        <motion.div
          className='mt-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <AccessibilityPanel />
        </motion.div>
      </div>
    </section>
  );
};