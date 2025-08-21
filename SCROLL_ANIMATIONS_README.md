# Scroll Animations & 3D Coffee Emblem

This update adds Sparkland-inspired scroll transitions and a 3D coffee emblem to the home page.

## New Features

### 1. 3D Coffee Emblem (`CoffeeEmblem3D.tsx`)
- **Interactive 3D coffee cup** with realistic textures and lighting
- **Mouse-responsive** - follows cursor movement for immersive interaction
- **Continuous rotation** animation when not being interacted with
- **Steam effect** rising from the cup
- **Multiple size options**: small, medium, large
- **GPU-accelerated** for smooth performance

### 2. Scroll Animations (Sparkland-inspired)
- **Fade-in animations** as sections come into view
- **Staggered animations** for feature cards
- **Smooth easing** with cubic-bezier curves
- **Intersection Observer** for performance
- **Accessibility support** with reduced motion preferences

### 3. Custom Hooks
- `useScrollAnimation` - Handles scroll-triggered animations
- `useStaggeredAnimation` - Manages staggered animations for multiple elements
- `useParallaxScroll` - Creates parallax scrolling effects

## Implementation Details

### CSS Classes Added
- `.scroll-fade-in-up` - Fade in from bottom
- `.scroll-fade-in-down` - Fade in from top  
- `.scroll-fade-in-left` - Fade in from left
- `.scroll-fade-in-right` - Fade in from right
- `.scroll-scale-in` - Scale in animation
- `.scroll-slide-up-stagger` - Staggered slide up
- `.hover-3d` - 3D hover effects
- `.gpu-accelerated` - Performance optimizations

### Animation Timing
- **Duration**: 0.6-0.8s for smooth, professional feel
- **Easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for natural motion
- **Stagger delays**: 0.1s intervals for sequential animations

### Performance Optimizations
- **GPU acceleration** with `transform: translateZ(0)`
- **Will-change** properties for smooth animations
- **Intersection Observer** to only animate visible elements
- **Reduced motion support** for accessibility

## Usage

### 3D Coffee Emblem
```tsx
import CoffeeEmblem3D from '../components/CoffeeEmblem3D';

// Basic usage
<CoffeeEmblem3D />

// With custom size and styling
<CoffeeEmblem3D size="large" className="hover-3d" />
```

### Scroll Animations
```tsx
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const MyComponent = () => {
  const { elementRef, isVisible } = useScrollAnimation();
  
  return (
    <div 
      ref={elementRef}
      className={`scroll-fade-in-up ${isVisible ? 'visible' : ''}`}
    >
      Content that animates on scroll
    </div>
  );
};
```

## Browser Support
- **Modern browsers** with CSS 3D transforms support
- **Intersection Observer API** for scroll animations
- **Graceful degradation** for older browsers
- **Accessibility compliance** with reduced motion preferences

## Performance Notes
- Animations are **GPU-accelerated** for smooth 60fps performance
- **Intersection Observer** prevents unnecessary calculations
- **Will-change** properties optimize rendering
- **Reduced motion** support respects user preferences

## Future Enhancements
- Parallax scrolling effects
- Text reveal animations
- More interactive 3D elements
- Advanced easing functions
- Scroll-triggered sound effects (optional) 