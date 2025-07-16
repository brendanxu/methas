/**
 * Lightweight Ant Design imports
 * 
 * This module provides optimized imports for frequently used Ant Design components
 * Reduces bundle size by avoiding full library imports
 */

// Layout components
export { default as Layout } from 'antd/es/layout';
export { default as Space } from 'antd/es/space';
export { default as Grid } from 'antd/es/grid';
export { default as Divider } from 'antd/es/divider';

// Navigation
export { default as Menu } from 'antd/es/menu';
export { default as Breadcrumb } from 'antd/es/breadcrumb';
export { default as Dropdown } from 'antd/es/dropdown';
export { default as Steps } from 'antd/es/steps';

// Data Entry - Light
export { default as Button } from 'antd/es/button';
export { default as Input } from 'antd/es/input';
export { default as InputNumber } from 'antd/es/input-number';
export { default as Switch } from 'antd/es/switch';
export { default as Radio } from 'antd/es/radio';
export { default as Checkbox } from 'antd/es/checkbox';
export { default as Rate } from 'antd/es/rate';
export { default as Slider } from 'antd/es/slider';

// Data Display - Light
export { default as Card } from 'antd/es/card';
export { default as Tag } from 'antd/es/tag';
export { default as Badge } from 'antd/es/badge';
export { default as Avatar } from 'antd/es/avatar';
export { default as Typography } from 'antd/es/typography';
export { default as Empty } from 'antd/es/empty';
export { default as List } from 'antd/es/list';
export { default as Tooltip } from 'antd/es/tooltip';
export { default as Popover } from 'antd/es/popover';

// Feedback - Light
export { default as Alert } from 'antd/es/alert';
export { default as message } from 'antd/es/message';
export { default as notification } from 'antd/es/notification';
export { default as Progress } from 'antd/es/progress';
export { default as Spin } from 'antd/es/spin';
export { default as Skeleton } from 'antd/es/skeleton';

// Other - Light
export { default as Affix } from 'antd/es/affix';
export { default as BackTop } from 'antd/es/back-top';
export { default as ConfigProvider } from 'antd/es/config-provider';

// Type exports
export type { ButtonProps } from 'antd/es/button';
export type { InputProps } from 'antd/es/input';
export type { CardProps } from 'antd/es/card';
export type { TagProps } from 'antd/es/tag';
export type { SpaceProps } from 'antd/es/space';
export type { AlertProps } from 'antd/es/alert';
export type { SpinProps } from 'antd/es/spin';
export type { SkeletonProps } from 'antd/es/skeleton';
export type { MenuProps } from 'antd/es/menu';
export type { DropdownProps } from 'antd/es/dropdown';

// Heavy components - should be dynamically imported
// Form, Table, Select, DatePicker, Upload, Modal, Drawer, etc.