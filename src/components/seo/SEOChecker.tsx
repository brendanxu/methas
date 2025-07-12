'use client';

import React, { useEffect, useState } from 'react';
import { Card, Collapse, Alert, Badge, Divider, Typography, Space, Button } from 'antd';
import { 
  CheckCircleOutlined, 
  WarningOutlined, 
  CloseCircleOutlined,
  InfoCircleOutlined,
  BugOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

interface SEOIssue {
  type: 'error' | 'warning' | 'info' | 'success';
  category: string;
  message: string;
  element?: HTMLElement;
  fix?: string;
}

interface SEOCheckerProps {
  enabled?: boolean;
}

export const SEOChecker: React.FC<SEOCheckerProps> = ({ enabled = true }) => {
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [stats, setStats] = useState({
    errors: 0,
    warnings: 0,
    infos: 0,
    successes: 0,
  });

  // Only show in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!enabled || !isDevelopment) return;

    const runSEOCheck = () => {
      setIsChecking(true);
      const foundIssues: SEOIssue[] = [];

      // Check meta tags
      foundIssues.push(...checkMetaTags());
      
      // Check heading structure
      foundIssues.push(...checkHeadingStructure());
      
      // Check images
      foundIssues.push(...checkImages());
      
      // Check links
      foundIssues.push(...checkLinks());
      
      // Check structured data
      foundIssues.push(...checkStructuredData());
      
      // Check performance
      foundIssues.push(...checkPerformance());

      setIssues(foundIssues);
      
      // Calculate stats
      const newStats = {
        errors: foundIssues.filter(i => i.type === 'error').length,
        warnings: foundIssues.filter(i => i.type === 'warning').length,
        infos: foundIssues.filter(i => i.type === 'info').length,
        successes: foundIssues.filter(i => i.type === 'success').length,
      };
      setStats(newStats);
      setIsChecking(false);
    };

    // Initial check
    runSEOCheck();

    // Re-check when DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout((observer as any).timeout);
      (observer as any).timeout = setTimeout(runSEOCheck, 1000);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => observer.disconnect();
  }, [enabled, isDevelopment]);

  // Meta tags checker
  const checkMetaTags = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    
    // Check title
    const title = document.querySelector('title');
    if (!title || !title.textContent?.trim()) {
      issues.push({
        type: 'error',
        category: 'Meta Tags',
        message: 'Missing page title',
        fix: 'Add a descriptive <title> tag to the <head>',
      });
    } else if (title.textContent.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Meta Tags',
        message: `Title too long (${title.textContent.length} chars). Should be under 60 characters.`,
        fix: 'Shorten the page title for better search result display',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Meta Tags',
        message: `Title length optimal (${title.textContent.length} chars)`,
      });
    }

    // Check meta description
    const description = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!description || !description.content?.trim()) {
      issues.push({
        type: 'error',
        category: 'Meta Tags',
        message: 'Missing meta description',
        fix: 'Add a meta description tag: <meta name="description" content="...">',
      });
    } else if (description.content.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Tags',
        message: `Meta description too long (${description.content.length} chars). Should be under 160 characters.`,
        fix: 'Shorten the meta description for better search result display',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Meta Tags',
        message: `Meta description length optimal (${description.content.length} chars)`,
      });
    }

    // Check Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    if (!ogTitle) {
      issues.push({
        type: 'warning',
        category: 'Open Graph',
        message: 'Missing og:title',
        fix: 'Add Open Graph title meta tag',
      });
    }
    
    if (!ogDescription) {
      issues.push({
        type: 'warning',
        category: 'Open Graph',
        message: 'Missing og:description',
        fix: 'Add Open Graph description meta tag',
      });
    }
    
    if (!ogImage) {
      issues.push({
        type: 'warning',
        category: 'Open Graph',
        message: 'Missing og:image',
        fix: 'Add Open Graph image meta tag',
      });
    }

    // Check Twitter Card
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      issues.push({
        type: 'info',
        category: 'Twitter',
        message: 'Missing Twitter Card meta tag',
        fix: 'Add Twitter Card meta tags for better social sharing',
      });
    }

    return issues;
  };

  // Heading structure checker
  const checkHeadingStructure = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Check for H1
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      issues.push({
        type: 'error',
        category: 'Heading Structure',
        message: 'Missing H1 tag',
        fix: 'Add exactly one H1 tag per page for the main heading',
      });
    } else if (h1s.length > 1) {
      issues.push({
        type: 'warning',
        category: 'Heading Structure',
        message: `Multiple H1 tags found (${h1s.length}). Should have only one H1 per page.`,
        fix: 'Use only one H1 tag per page and use H2-H6 for subheadings',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Heading Structure',
        message: 'Single H1 tag found',
      });
    }

    // Check heading hierarchy
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (index > 0 && level > previousLevel + 1) {
        issues.push({
          type: 'warning',
          category: 'Heading Structure',
          message: `Heading hierarchy skip: ${heading.tagName} follows H${previousLevel}`,
          element: heading as HTMLElement,
          fix: 'Maintain proper heading hierarchy (H1 → H2 → H3, etc.)',
        });
      }
      
      previousLevel = level;
    });

    return issues;
  };

  // Images checker
  const checkImages = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    const images = document.querySelectorAll('img');
    let missingAltCount = 0;
    let totalImages = images.length;

    images.forEach((img) => {
      if (!img.alt) {
        missingAltCount++;
        issues.push({
          type: 'warning',
          category: 'Images',
          message: `Image missing alt attribute: ${img.src.substring(0, 50)}...`,
          element: img,
          fix: 'Add descriptive alt text for accessibility and SEO',
        });
      }
    });

    if (missingAltCount === 0 && totalImages > 0) {
      issues.push({
        type: 'success',
        category: 'Images',
        message: `All ${totalImages} images have alt attributes`,
      });
    }

    return issues;
  };

  // Links checker
  const checkLinks = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    const links = document.querySelectorAll('a');
    let externalLinksWithoutNofollow = 0;
    let emptyLinks = 0;

    links.forEach((link) => {
      // Check for empty links
      if (!link.textContent?.trim() && !link.querySelector('img')) {
        emptyLinks++;
        issues.push({
          type: 'warning',
          category: 'Links',
          message: 'Empty link found',
          element: link,
          fix: 'Add descriptive text or an image with alt text to the link',
        });
      }

      // Check external links
      if (link.href && link.hostname && link.hostname !== window.location.hostname) {
        if (!link.rel?.includes('nofollow') && !link.rel?.includes('noopener')) {
          externalLinksWithoutNofollow++;
          issues.push({
            type: 'info',
            category: 'Links',
            message: `External link without rel attributes: ${link.href.substring(0, 50)}...`,
            element: link,
            fix: 'Consider adding rel="noopener nofollow" to external links',
          });
        }
      }
    });

    return issues;
  };

  // Structured data checker
  const checkStructuredData = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (jsonLdScripts.length === 0) {
      issues.push({
        type: 'warning',
        category: 'Structured Data',
        message: 'No structured data found',
        fix: 'Add JSON-LD structured data for better search engine understanding',
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Structured Data',
        message: `${jsonLdScripts.length} structured data scripts found`,
      });

      // Validate JSON-LD
      jsonLdScripts.forEach((script, index) => {
        try {
          JSON.parse(script.textContent || '');
        } catch (e) {
          issues.push({
            type: 'error',
            category: 'Structured Data',
            message: `Invalid JSON-LD in script ${index + 1}`,
            fix: 'Fix JSON syntax in structured data',
          });
        }
      });
    }

    return issues;
  };

  // Performance checker
  const checkPerformance = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    
    // Check for large images
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
        issues.push({
          type: 'info',
          category: 'Performance',
          message: `Large image detected: ${img.src.substring(0, 50)}... (${img.naturalWidth}x${img.naturalHeight})`,
          element: img,
          fix: 'Consider optimizing image size for better loading performance',
        });
      }
    });

    // Check for uncompressed images
    images.forEach((img) => {
      if (img.src.includes('.bmp') || (!img.src.includes('.webp') && !img.src.includes('.avif'))) {
        issues.push({
          type: 'info',
          category: 'Performance',
          message: `Consider modern image format: ${img.src.substring(0, 50)}...`,
          element: img,
          fix: 'Use WebP or AVIF format for better compression',
        });
      }
    });

    return issues;
  };

  const getIssueIcon = (type: SEOIssue['type']) => {
    switch (type) {
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
  };

  const getIssueColor = (type: SEOIssue['type']) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
    }
  };

  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = [];
    }
    acc[issue.category].push(issue);
    return acc;
  }, {} as Record<string, SEOIssue[]>);

  if (!isDevelopment || !enabled) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 20, 
      right: 20, 
      zIndex: 9999,
      maxWidth: '400px',
    }}>
      {!isVisible ? (
        <Button
          type="primary"
          icon={<BugOutlined />}
          onClick={() => setIsVisible(true)}
          style={{ 
            background: stats.errors > 0 ? '#ff4d4f' : stats.warnings > 0 ? '#faad14' : '#52c41a' 
          }}
        >
          SEO ({stats.errors + stats.warnings})
        </Button>
      ) : (
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <BugOutlined /> SEO Checker
              </span>
              <Button
                type="text"
                icon={<EyeInvisibleOutlined />}
                onClick={() => setIsVisible(false)}
                size="small"
              />
            </div>
          }
          size="small"
          style={{ maxHeight: '80vh', overflow: 'auto' }}
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge count={stats.errors} color="#ff4d4f">
                <span style={{ padding: '0 8px' }}>Errors</span>
              </Badge>
              <Badge count={stats.warnings} color="#faad14">
                <span style={{ padding: '0 8px' }}>Warnings</span>
              </Badge>
              <Badge count={stats.infos} color="#1890ff">
                <span style={{ padding: '0 8px' }}>Info</span>
              </Badge>
              <Badge count={stats.successes} color="#52c41a">
                <span style={{ padding: '0 8px' }}>Success</span>
              </Badge>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            {/* Issues by category */}
            <Collapse size="small" ghost>
              {Object.entries(groupedIssues).map(([category, categoryIssues]) => (
                <Panel
                  header={
                    <span>
                      {category} ({categoryIssues.length})
                    </span>
                  }
                  key={category}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {categoryIssues.map((issue, index) => (
                      <Alert
                        key={index}
                        message={issue.message}
                        description={issue.fix}
                        type={getIssueColor(issue.type)}
                        showIcon
                        icon={getIssueIcon(issue.type)}
                        size="small"
                        style={{ fontSize: '12px' }}
                        action={
                          issue.element && (
                            <Button
                              size="small"
                              type="text"
                              icon={<EyeOutlined />}
                              onClick={() => {
                                issue.element?.scrollIntoView({ 
                                  behavior: 'smooth', 
                                  block: 'center' 
                                });
                                issue.element?.style.setProperty('outline', '2px solid red', 'important');
                                setTimeout(() => {
                                  issue.element?.style.removeProperty('outline');
                                }, 3000);
                              }}
                            />
                          )
                        }
                      />
                    ))}
                  </Space>
                </Panel>
              ))}
            </Collapse>

            {issues.length === 0 && !isChecking && (
              <Alert
                message="All SEO checks passed!"
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}

            {isChecking && (
              <Alert
                message="Running SEO checks..."
                type="info"
                showIcon
              />
            )}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default SEOChecker;