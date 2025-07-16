'use client';

import React, { useState } from 'react';
import UnifiedButton from '@/components/ui/UnifiedButton';
import { useTheme } from '@/app/providers';

// Demo icons using SVG
const ArrowRightIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const DownloadIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const HeartIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function ButtonDemoPage() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { isDark, toggleTheme } = useTheme();

  const toggleLoading = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const DemoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-foreground">{title}</h2>
      <div className="grid gap-4">
        {children}
      </div>
    </div>
  );

  const ButtonRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-card rounded-lg border border-border">
      <div className="font-medium text-foreground">{label}</div>
      <div className="md:col-span-4 flex flex-wrap gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Button Component Demo</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Unified Button component combining Tailwind styles with Ant Design functionality
          </p>
          <div className="flex gap-4">
            <UnifiedButton variant="ghost" onClick={toggleTheme}>
              Toggle {isDark ? 'Light' : 'Dark'} Mode
            </UnifiedButton>
          </div>
        </div>

        {/* Variants Demo */}
        <DemoSection title="Variants">
          <ButtonRow label="Primary">
            <UnifiedButton variant="primary" size="small">Small Primary</UnifiedButton>
            <UnifiedButton variant="primary" size="medium">Medium Primary</UnifiedButton>
            <UnifiedButton variant="primary" size="large">Large Primary</UnifiedButton>
          </ButtonRow>
          
          <ButtonRow label="Secondary">
            <UnifiedButton variant="secondary" size="small">Small Secondary</UnifiedButton>
            <UnifiedButton variant="secondary" size="medium">Medium Secondary</UnifiedButton>
            <UnifiedButton variant="secondary" size="large">Large Secondary</UnifiedButton>
          </ButtonRow>
          
          <ButtonRow label="Ghost">
            <UnifiedButton variant="ghost" size="small">Small Ghost</UnifiedButton>
            <UnifiedButton variant="ghost" size="medium">Medium Ghost</UnifiedButton>
            <UnifiedButton variant="ghost" size="large">Large Ghost</UnifiedButton>
          </ButtonRow>
          
          <ButtonRow label="Success">
            <UnifiedButton variant="success" size="small">Small Success</UnifiedButton>
            <UnifiedButton variant="success" size="medium">Medium Success</UnifiedButton>
            <UnifiedButton variant="success" size="large">Large Success</UnifiedButton>
          </ButtonRow>
        </DemoSection>

        {/* Icons Demo */}
        <DemoSection title="With Icons">
          <ButtonRow label="Left Icons">
            <UnifiedButton variant="primary" icon={<ArrowRightIcon />} iconPosition="left">
              Get Started
            </UnifiedButton>
            <UnifiedButton variant="secondary" icon={<DownloadIcon />} iconPosition="left">
              Download
            </UnifiedButton>
            <UnifiedButton variant="ghost" icon={<HeartIcon />} iconPosition="left">
              Like
            </UnifiedButton>
            <UnifiedButton variant="success" icon={<CheckIcon />} iconPosition="left">
              Complete
            </UnifiedButton>
          </ButtonRow>
          
          <ButtonRow label="Right Icons">
            <UnifiedButton variant="primary" icon={<ArrowRightIcon />} iconPosition="right">
              Continue
            </UnifiedButton>
            <UnifiedButton variant="secondary" icon={<DownloadIcon />} iconPosition="right">
              Export
            </UnifiedButton>
            <UnifiedButton variant="ghost" icon={<HeartIcon />} iconPosition="right">
              Favorite
            </UnifiedButton>
            <UnifiedButton variant="success" icon={<CheckIcon />} iconPosition="right">
              Confirm
            </UnifiedButton>
          </ButtonRow>

          <ButtonRow label="Icon Only">
            <UnifiedButton variant="primary" icon={<ArrowRightIcon />} aria-label="Navigate forward" />
            <UnifiedButton variant="secondary" icon={<DownloadIcon />} aria-label="Download file" />
            <UnifiedButton variant="ghost" icon={<HeartIcon />} aria-label="Add to favorites" />
            <UnifiedButton variant="success" icon={<CheckIcon />} aria-label="Mark complete" />
          </ButtonRow>
        </DemoSection>

        {/* Loading States Demo */}
        <DemoSection title="Loading States">
          <ButtonRow label="Loading">
            <UnifiedButton 
              variant="primary" 
              loading={loadingStates.loading1}
              onClick={() => toggleLoading('loading1')}
            >
              {loadingStates.loading1 ? 'Loading...' : 'Click to Load'}
            </UnifiedButton>
            <UnifiedButton 
              variant="secondary" 
              loading={loadingStates.loading2}
              onClick={() => toggleLoading('loading2')}
            >
              Process Data
            </UnifiedButton>
            <UnifiedButton 
              variant="success" 
              loading={loadingStates.loading3}
              onClick={() => toggleLoading('loading3')}
              icon={<CheckIcon />}
            >
              Save Changes
            </UnifiedButton>
          </ButtonRow>
        </DemoSection>

        {/* Disabled States Demo */}
        <DemoSection title="Disabled States">
          <ButtonRow label="Disabled">
            <UnifiedButton variant="primary" disabled>Primary Disabled</UnifiedButton>
            <UnifiedButton variant="secondary" disabled>Secondary Disabled</UnifiedButton>
            <UnifiedButton variant="ghost" disabled>Ghost Disabled</UnifiedButton>
            <UnifiedButton variant="success" disabled>Success Disabled</UnifiedButton>
          </ButtonRow>
        </DemoSection>

        {/* Full Width Demo */}
        <DemoSection title="Full Width">
          <div className="space-y-4">
            <UnifiedButton variant="primary" fullWidth size="large">
              Full Width Primary Button
            </UnifiedButton>
            <UnifiedButton variant="secondary" fullWidth icon={<DownloadIcon />}>
              Full Width Secondary with Icon
            </UnifiedButton>
            <UnifiedButton 
              variant="success" 
              fullWidth 
              loading={loadingStates.fullWidth}
              onClick={() => toggleLoading('fullWidth')}
            >
              Full Width Loading Button
            </UnifiedButton>
          </div>
        </DemoSection>

        {/* Interactive Examples */}
        <DemoSection title="Interactive Examples">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Real-world Usage Examples</h3>
            <div className="space-y-6">
              
              {/* CTA Section */}
              <div className="text-center space-y-4">
                <h4 className="text-xl font-medium text-foreground">Get Started Today</h4>
                <p className="text-muted-foreground">Join thousands of companies using our climate solutions</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <UnifiedButton variant="primary" size="large" icon={<ArrowRightIcon />}>
                    Start Free Trial
                  </UnifiedButton>
                  <UnifiedButton variant="secondary" size="large">
                    Watch Demo
                  </UnifiedButton>
                </div>
              </div>

              {/* Form Actions */}
              <div className="border border-border rounded p-4">
                <h4 className="text-lg font-medium mb-4 text-foreground">Form Actions</h4>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <UnifiedButton variant="ghost">Cancel</UnifiedButton>
                  <UnifiedButton variant="secondary">Save Draft</UnifiedButton>
                  <UnifiedButton variant="primary" icon={<CheckIcon />}>
                    Publish
                  </UnifiedButton>
                </div>
              </div>

              {/* Loading Simulation */}
              <div className="border border-border rounded p-4">
                <h4 className="text-lg font-medium mb-4 text-foreground">Async Actions</h4>
                <div className="flex gap-3">
                  <UnifiedButton 
                    variant="primary"
                    loading={loadingStates.simulate}
                    onClick={() => {
                      toggleLoading('simulate');
                      setTimeout(() => toggleLoading('simulate'), 3000);
                    }}
                  >
                    Calculate Impact
                  </UnifiedButton>
                  <UnifiedButton 
                    variant="success"
                    icon={<DownloadIcon />}
                    onClick={() => alert('Report downloaded!')}
                  >
                    Download Report
                  </UnifiedButton>
                </div>
              </div>
            </div>
          </div>
        </DemoSection>

        {/* Usage Code Examples */}
        <DemoSection title="Usage Examples">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Code Examples</h3>
            <div className="space-y-4 text-sm font-mono">
              <div>
                <p className="text-muted-foreground mb-2">Basic button with variant and size:</p>
                <code className="bg-background p-2 rounded block text-foreground">
                  {`<UnifiedButton variant="primary" size="large">Get Started</UnifiedButton>`}
                </code>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Button with icon:</p>
                <code className="bg-background p-2 rounded block text-foreground">
                  {`<UnifiedButton variant="primary" icon={<ArrowRight />} iconPosition="right">
  Continue
</UnifiedButton>`}
                </code>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Loading button:</p>
                <code className="bg-background p-2 rounded block text-foreground">
                  {`<UnifiedButton 
  variant="primary" 
  loading={isLoading}
>
  Submit Form
</UnifiedButton>`}
                </code>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Full width button:</p>
                <code className="bg-background p-2 rounded block text-foreground">
                  {`<UnifiedButton variant="secondary" fullWidth>
  Full Width Action
</UnifiedButton>`}
                </code>
              </div>
            </div>
          </div>
        </DemoSection>
      </div>
    </div>
  );
}