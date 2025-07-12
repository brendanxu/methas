'use client';

import React from 'react';
import { Card, Switch, Select, Divider, Typography, Space, Button } from 'antd';
import { SettingOutlined, EyeOutlined, FontSizeOutlined } from '@ant-design/icons';
import { useAccessibility } from '@/hooks/useAccessibility';
import { validateColorSystemAccessibility } from '@/lib/colors';

const { Title, Text } = Typography;
const { Option } = Select;

interface AccessibilityPanelProps {
  className?: string;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ className }) => {
  const { settings, toggleHighContrast, toggleReducedMotion, toggleColorBlindMode, setFontSize } = useAccessibility();

  const colorSystemValidation = React.useMemo(() => {
    return validateColorSystemAccessibility();
  }, []);

  return (
    <Card 
      title={
        <Space>
          <SettingOutlined />
          <span>Accessibility Settings</span>
        </Space>
      }
      className={className}
    >
      <Space direction="vertical" size="large" className="w-full">
        {/* Visual Accessibility */}
        <div>
          <Title level={5}>
            <EyeOutlined className="mr-2" />
            Visual Accessibility
          </Title>
          
          <Space direction="vertical" size="middle" className="w-full">
            <div className="flex items-center justify-between">
              <div>
                <Text strong>High Contrast Mode</Text>
                <br />
                <Text type="secondary">
                  Enhances color contrast for better visibility
                </Text>
              </div>
              <Switch
                checked={settings.highContrast}
                onChange={toggleHighContrast}
                checkedChildren="ON"
                unCheckedChildren="OFF"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Text strong>Color Blind Friendly</Text>
                <br />
                <Text type="secondary">
                  Uses colors that are easier to distinguish
                </Text>
              </div>
              <Switch
                checked={settings.colorBlindMode}
                onChange={toggleColorBlindMode}
                checkedChildren="ON"
                unCheckedChildren="OFF"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Text strong>Font Size</Text>
                <br />
                <Text type="secondary">
                  Adjust text size for better readability
                </Text>
              </div>
              <Select
                value={settings.fontSize}
                onChange={setFontSize}
                style={{ width: 120 }}
              >
                <Option value="small">Small</Option>
                <Option value="normal">Normal</Option>
                <Option value="large">Large</Option>
                <Option value="x-large">X-Large</Option>
              </Select>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Motion Accessibility */}
        <div>
          <Title level={5}>
            <FontSizeOutlined className="mr-2" />
            Motion & Animation
          </Title>
          
          <div className="flex items-center justify-between">
            <div>
              <Text strong>Reduced Motion</Text>
              <br />
              <Text type="secondary">
                Minimizes animations and transitions
              </Text>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onChange={toggleReducedMotion}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </div>
        </div>

        <Divider />

        {/* Color System Validation */}
        <div>
          <Title level={5}>Color System Validation</Title>
          
          {colorSystemValidation.isValid ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <Text className="text-green-700">
                ✅ All colors meet WCAG 2.1 AA accessibility standards
              </Text>
            </div>
          ) : (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Text className="text-orange-700 block mb-2">
                ⚠️ Some color combinations may have accessibility issues:
              </Text>
              <ul className="text-sm text-orange-600">
                {colorSystemValidation.issues.map((issue, index) => (
                  <li key={index} className="mb-1">
                    <strong>{issue.color}:</strong> {issue.issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-3">
            <Text strong className="block mb-2">Recommendations:</Text>
            <ul className="text-sm space-y-1">
              {colorSystemValidation.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-600">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Divider />

        {/* Quick Actions */}
        <div>
          <Title level={5}>Quick Actions</Title>
          <Space wrap>
            <Button 
              size="small"
              onClick={() => {
                toggleHighContrast();
                toggleColorBlindMode();
              }}
            >
              Maximum Accessibility
            </Button>
            <Button 
              size="small"
              onClick={() => {
                if (settings.highContrast) toggleHighContrast();
                if (settings.colorBlindMode) toggleColorBlindMode();
                if (settings.reducedMotion) toggleReducedMotion();
                setFontSize('normal');
              }}
            >
              Reset to Default
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
};