// The site's own icon set: drawn on a 24px grid with square line ends and sharp
// joins, used everywhere in place of a stock icon library. Same names and props
// as before (className, size, strokeWidth), so pages only change their import.
// Deliberately absent: sparkles. List bullets use a plain square marker.
import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string };

const make = (name: string, body: React.ReactNode) => {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ size = 24, strokeWidth = 1.75, className, ...rest }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {body}
    </svg>
  ));
  Icon.displayName = name;
  return Icon;
};

// Navigation and actions
export const ArrowLeft = make('ArrowLeft', <path d="M20 12H5M11 6l-6 6 6 6" />);
export const ArrowRight = make('ArrowRight', <path d="M4 12h15M13 6l6 6-6 6" />);
export const ChevronDown = make('ChevronDown', <path d="M6 9l6 6 6-6" />);
export const ChevronUp = make('ChevronUp', <path d="M6 15l6-6 6 6" />);
export const X = make('X', <path d="M6 6l12 12M18 6L6 18" />);
export const Plus = make('Plus', <path d="M12 5v14M5 12h14" />);
export const Minus = make('Minus', <path d="M5 12h14" />);
export const Menu = make('Menu', <path d="M4 7h16M4 12h16M4 17h16" />);
export const Search = make('Search', <><path d="M4 4h11v11H4z" /><path d="M15 15l5 5" /></>);
export const ExternalLink = make('ExternalLink', <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />);
export const Download = make('Download', <path d="M12 4v11M7 10l5 5 5-5M4 20h16" />);
export const LogOut = make('LogOut', <path d="M10 4H4v16h6M15 8l4 4-4 4M19 12H9" />);
export const RefreshCw = make('RefreshCw', <path d="M20 5v5h-5M4 19v-5h5M19 10a7.5 7.5 0 0 0-13.5-3M5 14a7.5 7.5 0 0 0 13.5 3" />);
export const Send = make('Send', <path d="M3 11l18-8-6 18-3-8-9-2zM12 13l9-10" />);
export const SlidersHorizontal = make('SlidersHorizontal', <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />);
export const Eye = make('Eye', <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><path d="M10 10h4v4h-4z" /></>);
export const EyeOff = make('EyeOff', <path d="M2 12s4-7 10-7c2 0 3.7.7 5.2 1.7M22 12s-4 7-10 7c-2 0-3.7-.7-5.2-1.7M4 4l16 16" />);

// Shop
export const ShoppingCart = make('ShoppingCart', <><path d="M2 4h3l2.5 11h11L21 7H6.2" /><path d="M8 19h2v2H8zM16 19h2v2h-2z" /></>);
export const ShoppingBag = make('ShoppingBag', <path d="M4 8h16l-1 13H5L4 8zM9 8V5h6v3" />);
export const Tag = make('Tag', <><path d="M3 3h9l9 9-9 9-9-9V3z" /><path d="M7 7h2v2H7z" /></>);
export const Gift = make('Gift', <path d="M3 9h18v4H3zM5 13h14v8H5zM12 9v12M12 9H8a2 2 0 0 1 0-4c2 0 4 4 4 4zm0 0h4a2 2 0 0 0 0-4c-2 0-4 4-4 4z" />);
export const CreditCard = make('CreditCard', <path d="M2 5h20v14H2zM2 10h20M6 15h4" />);
export const Banknote = make('Banknote', <><path d="M2 6h20v12H2z" /><path d="M10 10h4v4h-4zM5 9v6M19 9v6" /></>);
export const Truck = make('Truck', <><path d="M2 5h12v11H2zM14 9h5l3 4v3h-8" /><path d="M5 17h3v3H5zM16 17h3v3h-3z" /></>);
export const Package = make('Package', <path d="M3 7l9-4 9 4v10l-9 4-9-4V7zM3 7l9 4 9-4M12 11v10" />);
export const Coffee = make('Coffee', <path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zM16 10h2a2 2 0 0 1 0 4h-2M8 2v3M12 2v3" />);
export const Star = make('Star', <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />);
export const Quote = make('Quote', <path d="M4 10h6v8H4zM14 10h6v8h-6zM4 10c0-3 1-5 4-6M14 10c0-3 1-5 4-6" />);

// People, places, time
export const User = make('User', <path d="M8 4h8v8H8zM4 21v-3a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3" />);
export const Users = make('Users', <path d="M6 5h6v6H6zM2 20v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2M16 5h4v5h-4M18 15h1a3 3 0 0 1 3 3v2" />);
export const Home = make('Home', <path d="M3 11l9-7 9 7v10H3V11zM9 21v-7h6v7" />);
export const MapPin = make('MapPin', <><path d="M12 22s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" /><path d="M10 8h4v4h-4z" /></>);
export const Clock = make('Clock', <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>);
export const Calendar = make('Calendar', <path d="M3 5h18v16H3zM3 10h18M8 2v5M16 2v5" />);
export const Phone = make('Phone', <path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z" />);
export const Mail = make('Mail', <path d="M2 5h20v14H2zM2 5l10 8 10-8" />);
export const Plane = make('Plane', <path d="M2 13l20-8-5 15-4-6-4 4v-6L2 13zM13 14l9-9" />);
export const Thermometer = make('Thermometer', <path d="M10 3h4v11a4 4 0 1 1-4 0V3zM12 14v3" />);

// Messages and help
export const MessageCircle = make('MessageCircle', <path d="M4 4h16v12H9l-5 4V4z" />);
export const MessageSquare = make('MessageSquare', <path d="M3 4h18v13H8l-5 4V4zM7 9h10M7 13h6" />);
export const Bot = make('Bot', <path d="M5 8h14v11H5zM12 4v4M9 13h1M14 13h1M9 16h6M2 12v3M22 12v3" />);
export const BookOpen = make('BookOpen', <path d="M2 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H2V4zM22 4h-7a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h7V4z" />);
export const Info = make('Info', <><path d="M3 3h18v18H3z" /><path d="M12 11v6M12 7v1" /></>);
export const AlertCircle = make('AlertCircle', <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16v1" /></>);
export const AlertTriangle = make('AlertTriangle', <path d="M12 3l10 18H2L12 3zM12 10v5M12 18v.5" />);
export const Loader2 = make('Loader2', <path d="M12 3a9 9 0 1 1-9 9" />);

// Product qualities
export const Shield = make('Shield', <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />);
export const ShieldCheck = make('ShieldCheck', <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8 12l3 3 5-6" />);
export const ShieldAlert = make('ShieldAlert', <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM12 8v5M12 16v.5" />);
export const BadgeCheck = make('BadgeCheck', <path d="M12 2l3 2.5h4v4L21.5 12 19 15.5v4h-4L12 22l-3-2.5H5v-4L2.5 12 5 8.5v-4h4L12 2zM8 12l3 3 5-6" />);
export const Award = make('Award', <><circle cx="12" cy="9" r="6" /><path d="M8 14l-2 8 6-3 6 3-2-8" /></>);
export const Leaf = make('Leaf', <path d="M4 20C4 9 10 4 20 4c0 10-5 16-16 16zM4 20l9-9" />);
export const Zap = make('Zap', <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />);
export const Target = make('Target', <><circle cx="12" cy="12" r="9" /><path d="M10 10h4v4h-4z" /></>);
export const Heart = make('Heart', <path d="M12 20S3 14 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14 12 20 12 20z" />);

// A real check where something was done ("Added"); lists use the square marker below
export const Check = make('Check', <path d="M4 12l5 5L20 6" />);
export const CheckCircle = make('CheckCircle', <path d="M9 9h6v6H9z" fill="currentColor" stroke="none" />);

// Policy and support pages
export const Lock = make('Lock', <path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v2" />);
export const Database = make('Database', <path d="M4 5h16v4H4zM4 9h16v5H4zM4 14h16v5H4z" />);
export const FileText = make('FileText', <path d="M5 2h10l4 4v16H5V2zM15 2v4h4M8 11h8M8 15h8M8 19h5" />);
export const Headphones = make('Headphones', <path d="M4 18v-6a8 8 0 0 1 16 0v6M4 14h4v7H4zM16 14h4v7h-4z" />);
export const HelpCircle = make('HelpCircle', <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17v.5" /></>);
export const XCircle = make('XCircle', <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>);
export const Trash2 = make('Trash2', <path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" />);

// Social
export const Instagram = make('Instagram', <><path d="M3 3h18v18H3z" /><path d="M8 8h8v8H8zM17 6v.5" /></>);
export const Facebook = make('Facebook', <path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .4-1.5 1.5-1.5H18V3h-3c-2.8 0-4.5 1.7-4.5 4.5v2H8V13h2.5v8" />);
export const Twitter = make('Twitter', <path d="M4 4l16 16M20 4L4 20" />);

