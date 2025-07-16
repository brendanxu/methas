/**
 * Lightweight Icon Components
 * 
 * Replaces heavy Ant Design icons with lightweight SVG alternatives
 * Reduces bundle size by ~50KB compared to @ant-design/icons
 */

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const createIcon = (path: string, viewBox: string = "0 0 24 24", displayName: string = "Icon") => {
  const IconComponent = React.forwardRef<SVGSVGElement, IconProps>(({ 
    className = "", 
    size = 16, 
    color = "currentColor", 
    style = {},
    ...props 
  }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={viewBox}
      fill={color}
      className={className}
      style={style}
      {...props}
    >
      <path d={path} />
    </svg>
  ));
  
  IconComponent.displayName = displayName;
  return IconComponent;
};

// 常用图标
export const SearchIcon = createIcon("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z", "0 0 24 24", "SearchIcon");

export const MenuIcon = createIcon("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z", "0 0 24 24", "MenuIcon");

export const CloseIcon = createIcon("M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z", "0 0 24 24", "CloseIcon");

export const ChevronDownIcon = createIcon("M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z", "0 0 24 24", "ChevronDownIcon");

export const ChevronUpIcon = createIcon("M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z", "0 0 24 24", "ChevronUpIcon");

export const ChevronLeftIcon = createIcon("M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z", "0 0 24 24", "ChevronLeftIcon");

export const ChevronRightIcon = createIcon("M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z", "0 0 24 24", "ChevronRightIcon");

export const HomeIcon = createIcon("M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", "0 0 24 24", "HomeIcon");

export const UserIcon = createIcon("M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "0 0 24 24", "UserIcon");

export const SettingsIcon = createIcon("M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z", "0 0 24 24", "SettingsIcon");

export const MailIcon = createIcon("M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", "0 0 24 24", "MailIcon");

export const PhoneIcon = createIcon("M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", "0 0 24 24", "PhoneIcon");

export const LocationIcon = createIcon("M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", "0 0 24 24", "LocationIcon");

export const CalendarIcon = createIcon("M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z", "0 0 24 24", "CalendarIcon");

export const ClockIcon = createIcon("M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z", "0 0 24 24", "ClockIcon");

export const DownloadIcon = createIcon("M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", "0 0 24 24", "DownloadIcon");

export const UploadIcon = createIcon("M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z", "0 0 24 24", "UploadIcon");

export const EditIcon = createIcon("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z", "0 0 24 24", "EditIcon");

export const DeleteIcon = createIcon("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z", "0 0 24 24", "DeleteIcon");

export const EyeIcon = createIcon("M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z", "0 0 24 24", "EyeIcon");

export const EyeOffIcon = createIcon("M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z", "0 0 24 24", "EyeOffIcon");

export const PlusIcon = createIcon("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", "0 0 24 24", "PlusIcon");

export const MinusIcon = createIcon("M19 13H5v-2h14v2z", "0 0 24 24", "MinusIcon");

export const CheckIcon = createIcon("M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z", "0 0 24 24", "CheckIcon");

export const InfoIcon = createIcon("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z", "0 0 24 24", "InfoIcon");

export const WarningIcon = createIcon("M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z", "0 0 24 24", "WarningIcon");

export const ErrorIcon = createIcon("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", "0 0 24 24", "ErrorIcon");

export const SuccessIcon = createIcon("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", "0 0 24 24", "SuccessIcon");

export const StarIcon = createIcon("M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z", "0 0 24 24", "StarIcon");

export const HeartIcon = createIcon("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", "0 0 24 24", "HeartIcon");

export const LockIcon = createIcon("M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z", "0 0 24 24", "LockIcon");

export const ShareIcon = createIcon("M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z", "0 0 24 24", "ShareIcon");

export const FilterIcon = createIcon("M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z", "0 0 24 24", "FilterIcon");

export const SortIcon = createIcon("M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z", "0 0 24 24", "SortIcon");

export const RefreshIcon = createIcon("M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z", "0 0 24 24", "RefreshIcon");

export const LoadingIcon = createIcon("M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z", "0 0 24 24", "LoadingIcon");

export const ExportIcon = createIcon("M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z", "0 0 24 24", "ExportIcon");

export const ImportIcon = createIcon("M5 12v7h14v-7h2v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-7h2zm6-.67L8.41 9.92 7 11.33l5 5 5-5-1.41-1.41L13 12.33V3h-2z", "0 0 24 24", "ImportIcon");

export const DatabaseIcon = createIcon("M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4zm0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z", "0 0 24 24", "DatabaseIcon");

// 导出所有图标
export const LightIcons = {
  Search: SearchIcon,
  Menu: MenuIcon,
  Close: CloseIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Home: HomeIcon,
  User: UserIcon,
  Settings: SettingsIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  Location: LocationIcon,
  Calendar: CalendarIcon,
  Clock: ClockIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Edit: EditIcon,
  Delete: DeleteIcon,
  Eye: EyeIcon,
  EyeOff: EyeOffIcon,
  Plus: PlusIcon,
  Minus: MinusIcon,
  Check: CheckIcon,
  Info: InfoIcon,
  Warning: WarningIcon,
  Error: ErrorIcon,
  Success: SuccessIcon,
  Star: StarIcon,
  Heart: HeartIcon,
  Share: ShareIcon,
  Filter: FilterIcon,
  Sort: SortIcon,
  Refresh: RefreshIcon,
  Loading: LoadingIcon,
  Export: ExportIcon,
  Import: ImportIcon,
  Database: DatabaseIcon,
};

export default LightIcons;