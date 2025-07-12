export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
}

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
}