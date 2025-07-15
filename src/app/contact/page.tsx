import { SEOHead } from '@/components/seo/SEOHead';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import dynamic from 'next/dynamic';

// 动态导入交互式联系表单
const InteractiveContactForm = dynamic(() => import('@/components/forms/InteractiveContactForm'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-muted rounded-lg" />
});

// 静态内容组件（服务端渲染）
function ContactHero() {
  return (
    <div className="bg-primary text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Ready to start your climate journey? Let's discuss how South Pole can help 
            your organization achieve its sustainability goals.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Office</h3>
            <p className="text-muted-foreground">
              Zurich, Switzerland<br />
              Global Headquarters
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-muted-foreground">
              info@southpole.com<br />
              We respond within 24 hours
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-muted-foreground">
              +41 43 500 37 50<br />
              Mon-Fri 9:00-17:00 CET
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhyChooseUs() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose South Pole?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're the trusted partner for organizations worldwide looking to create positive climate impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "15+ Years Experience",
              description: "Leading climate solutions since 2006"
            },
            {
              title: "Global Reach",
              description: "Operations in 20+ countries worldwide"
            },
            {
              title: "Proven Results",
              description: "2M+ tons CO2 reduced for clients"
            },
            {
              title: "Expert Team",
              description: "200+ climate and sustainability experts"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-card rounded-lg p-6 shadow-soft">
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const contactSEO = {
  title: 'Contact Us | South Pole - Climate Solutions & Consulting',
  description: 'Get in touch with South Pole for expert climate solutions, carbon offset strategies, and sustainability consulting. Start your climate journey today.',
  keywords: 'contact south pole, climate consulting, carbon offset consultation, sustainability services',
  openGraph: {
    title: 'Contact South Pole - Your Climate Solutions Partner',
    description: 'Ready to start your climate journey? Contact our experts for personalized climate solutions and sustainability strategies.',
    type: 'website' as const,
  }
};

export default function ContactPage() {
  return (
    <>
      <SEOHead 
        config={contactSEO}
        basePath="/contact"
      />
      
      <div className="min-h-screen">
        {/* 静态英雄区块 - 服务端渲染 */}
        <ContactHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* 静态内容区块 */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Let's Start the Conversation</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're looking to offset your carbon footprint, develop a comprehensive 
                climate strategy, or explore renewable energy solutions, our team of experts 
                is here to help you achieve your sustainability goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Initial Consultation</h4>
                    <p className="text-muted-foreground text-sm">We'll discuss your current situation and sustainability goals</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Custom Strategy</h4>
                    <p className="text-muted-foreground text-sm">We'll develop a tailored climate strategy for your organization</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Implementation Support</h4>
                    <p className="text-muted-foreground text-sm">We'll guide you through every step of the implementation process</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 动态交互表单 */}
            <ErrorBoundary fallback={<div className="min-h-[400px] flex items-center justify-center">
              <p className="text-lg text-muted-foreground">Failed to load contact form</p>
            </div>}>
              <InteractiveContactForm />
            </ErrorBoundary>
          </div>
        </div>

        {/* 静态联系信息区块 */}
        <ContactInfo />
        
        {/* 静态优势展示区块 */}
        <WhyChooseUs />
      </div>
    </>
  );
}