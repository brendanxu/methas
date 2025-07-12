
// Mock framer-motion for build compatibility
export const motion = {
  div: 'div',
  section: 'section',
  article: 'article',
  aside: 'aside',
  header: 'header',
  footer: 'footer',
  main: 'main',
  nav: 'nav',
  span: 'span',
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  img: 'img',
  button: 'button',
  form: 'form',
  input: 'input',
  textarea: 'textarea',
  select: 'select',
  ul: 'ul',
  ol: 'ol',
  li: 'li'
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;

export const useInView = () => [null, true];
export const useAnimation = () => ({});
export const useScroll = () => ({ scrollY: { get: () => 0 } });
export const useTransform = () => 0;
export const useSpring = () => 0;
export const useMotionValue = () => ({ get: () => 0, set: () => {} });
export const useMotionTemplate = () => '';
