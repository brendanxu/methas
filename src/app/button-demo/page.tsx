'use client';

// Force dynamic rendering to prevent prerendering of interactive components
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
  const [isClient, setIsClient] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Ensure we only render interactive elements on the client
  React.useEffect(() => {
    setIsClient(true);
  }, []);

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
            {isClient && (
              <Button variant="ghost" onClick={toggleTheme}>
                Toggle {isDark ? 'Light' : 'Dark'} Mode
              </Button>
            )}
          </div>
        </div>

        {/* Variants Demo */}
        <DemoSection title="Variants">
          <ButtonRow label="Primary">
            <Button variant="primary" size="small">Small Primary</Button>
            <Button variant="primary" size="medium">Medium Primary</Button>
            <Button variant="primary" size="large">Large Primary</Button>
          </ButtonRow>
          
          <ButtonRow label="Secondary">
            <Button variant="secondary" size="small">Small Secondary</Button>
            <Button variant="secondary" size="medium">Medium Secondary</Button>
            <Button variant="secondary" size="large">Large Secondary</Button>
          </ButtonRow>
          
          <ButtonRow label="Ghost">
            <Button variant="ghost" size="small">Small Ghost</Button>
            <Button variant="ghost" size="medium">Medium Ghost</Button>
            <Button variant="ghost" size="large">Large Ghost</Button>
          </ButtonRow>
          
          <ButtonRow label="Success">
            <Button variant="success" size="small">Small Success</Button>
            <Button variant="success" size="medium">Medium Success</Button>
            <Button variant="success" size="large">Large Success</Button>
          </ButtonRow>
        </DemoSection>

        {/* Icons Demo */}
        <DemoSection title="With Icons">
          <ButtonRow label="Left Icons">
            <Button variant="primary" icon={<ArrowRightIcon />} iconPosition="left">
              Get Started
            </Button>
            <Button variant="secondary" icon={<DownloadIcon />} iconPosition="left">
              Download
            </Button>
            <Button variant="ghost" icon={<HeartIcon />} iconPosition="left">
              Like
            </Button>
            <Button variant="success" icon={<CheckIcon />} iconPosition="left">
              Complete
            </Button>
          </ButtonRow>
          
          <ButtonRow label="Right Icons">
            <Button variant="primary" icon={<ArrowRightIcon />} iconPosition="right">
              Continue
            </Button>
            <Button variant="secondary" icon={<DownloadIcon />} iconPosition="right">
              Export
            </Button>
            <Button variant="ghost" icon={<HeartIcon />} iconPosition="right">
              Favorite
            </Button>
            <Button variant="success" icon={<CheckIcon />} iconPosition="right">
              Confirm
            </Button>
          </ButtonRow>

          <ButtonRow label="Icon Only">
            <Button variant="primary" icon={<ArrowRightIcon />} aria-label="Navigate forward" />
            <Button variant="secondary" icon={<DownloadIcon />} aria-label="Download file" />
            <Button variant="ghost" icon={<HeartIcon />} aria-label="Add to favorites" />
            <Button variant="success" icon={<CheckIcon />} aria-label="Mark complete" />
          </ButtonRow>
        </DemoSection>

        {/* Loading States Demo */}
        <DemoSection title="Loading States">
          {isClient ? (
            <ButtonRow label="Loading">
              <Button 
                variant="primary" 
                loading={loadingStates.loading1}
                onClick={() => toggleLoading('loading1')}
              >
                {loadingStates.loading1 ? 'Loading...' : 'Click to Load'}
              </Button>
              <Button 
                variant="secondary" 
                loading={loadingStates.loading2}
                onClick={() => toggleLoading('loading2')}
                loadingText="Processing"
              >
                Process Data
              </Button>
              <Button 
                variant="success" 
                loading={loadingStates.loading3}
                onClick={() => toggleLoading('loading3')}
                icon={<CheckIcon />}
                loadingText="Saving"
              >
                Save Changes
              </Button>
            </ButtonRow>
          ) : (
            <ButtonRow label="Loading">
              <Button variant="primary">Click to Load</Button>
              <Button variant="secondary">Process Data</Button>
              <Button variant="success" icon={<CheckIcon />}>Save Changes</Button>
            </ButtonRow>
          )}
        </DemoSection>

        {/* Disabled States Demo */}
        <DemoSection title="Disabled States">
          <ButtonRow label="Disabled">
            <Button variant="primary" disabled>Primary Disabled</Button>
            <Button variant="secondary" disabled>Secondary Disabled</Button>
            <Button variant="ghost" disabled>Ghost Disabled</Button>
            <Button variant="success" disabled>Success Disabled</Button>
          </ButtonRow>
        </DemoSection>

        {/* Full Width Demo */}
        <DemoSection title="Full Width">
          <div className="space-y-4">
            <Button variant="primary" fullWidth size="large">
              Full Width Primary Button
            </Button>
            <Button variant="secondary" fullWidth icon={<DownloadIcon />}>
              Full Width Secondary with Icon
            </Button>
            {isClient ? (
              <Button 
                variant="success" 
                fullWidth 
                loading={loadingStates.fullWidth}
                onClick={() => toggleLoading('fullWidth')}
                loadingText="Processing your request"
              >
                Full Width Loading Button
              </Button>
            ) : (
              <Button variant="success" fullWidth>
                Full Width Loading Button
              </Button>
            )}
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
                  <Button variant="primary" size="large" icon={<ArrowRightIcon />}>
                    Start Free Trial
                  </Button>
                  <Button variant="secondary" size="large">
                    Watch Demo
                  </Button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="border border-border rounded p-4">
                <h4 className="text-lg font-medium mb-4 text-foreground">Form Actions</h4>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="secondary">Save Draft</Button>
                  <Button variant="primary" icon={<CheckIcon />}>
                    Publish
                  </Button>
                </div>
              </div>

              {/* Loading Simulation */}
              <div className="border border-border rounded p-4">
                <h4 className="text-lg font-medium mb-4 text-foreground">Async Actions</h4>
                <div className="flex gap-3">
                  {isClient ? (
                    <>
                      <Button 
                        variant="primary"
                        loading={loadingStates.simulate}
                        onClick={() => {
                          toggleLoading('simulate');
                          setTimeout(() => toggleLoading('simulate'), 3000);
                        }}
                        loadingText="Calculating carbon footprint"
                      >
                        Calculate Impact
                      </Button>
                      <Button 
                        variant="success"
                        icon={<DownloadIcon />}
                        onClick={() => alert('Report downloaded!')}
                      >
                        Download Report
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="primary">Calculate Impact</Button>
                      <Button variant="success" icon={<DownloadIcon />}>Download Report</Button>
                    </>
                  )}
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
                  {`<Button variant="primary" size="large">Get Started</Button>`}
                </code>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Button with icon:</p>
                <code className="bg-background p-2 rounded block text-foreground">
                  {`<Button variant="primary" icon={<ArrowRight />} iconPosition="right">
  Continue
</Button>`}
                </code>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Loading button with custom text:</p>
                <code className="bg-background p-2 rounded block text-foreground">
                  {`<Button 
  variant="primary" 
  loading={isLoading}
  loadingText="Processing"
>
  Submit Form
</Button>`}
                </code>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Full width button:</p>
                <code className="bg-background p-2 rounded block text-foreground">
                  {`<Button variant="secondary" fullWidth>
  Full Width Action
</Button>`}
                </code>
              </div>
            </div>
          </div>
        </DemoSection>
      </div>
    </div>
  );
}