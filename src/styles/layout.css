/* Layout and Spacing Utilities */

/* Consistent page spacing */
.page-content {
  padding-top: 5rem; /* 80px - matches pt-20 */
  padding-bottom: 2rem; /* 32px - matches pb-8 */
}

/* Header height consistency */
.header-height {
  height: 4rem; /* 64px - matches h-16 */
}

/* Main content area spacing */
.main-content {
  margin-top: 5rem; /* 80px - matches pt-20 */
  min-height: calc(100vh - 5rem - 2rem); /* Account for header and footer */
}

/* Consistent section spacing */
.section-spacing {
  margin-bottom: 4rem; /* 64px */
}

.section-spacing-lg {
  margin-bottom: 6rem; /* 96px */
}

/* Container max-widths */
.container-standard {
  max-width: 80rem; /* 1280px - matches max-w-7xl */
  margin: 0 auto;
  padding: 0 1rem; /* 16px */
}

@media (min-width: 640px) {
  .container-standard {
    padding: 0 1.5rem; /* 24px */
  }
}

@media (min-width: 1024px) {
  .container-standard {
    padding: 0 2rem; /* 32px */
  }
}

/* Consistent padding options */
.padding-none {
  padding: 0;
}

.padding-small {
  padding: 2rem 1rem; /* 32px horizontal, 16px vertical */
}

.padding-medium {
  padding: 2rem 1rem; /* 32px horizontal, 16px vertical */
}

.padding-large {
  padding: 3rem 1rem; /* 48px horizontal, 16px vertical */
}

@media (min-width: 640px) {
  .padding-small,
  .padding-medium,
  .padding-large {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .padding-small,
  .padding-medium,
  .padding-large {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Ensure consistent background colors */
.bg-page {
  background-color: #f5f1eb; /* cream color */
}

/* Fix for pages that need full height */
.full-height-page {
  min-height: calc(100vh - 5rem); /* Account for header */
}

/* Video Gallery Styles */
.video-gallery {
  aspect-ratio: 16 / 9;
  min-height: 300px;
}

/* Integrated Gallery Video Styles */
.gallery-video {
  aspect-ratio: 1 / 1;
  min-height: 400px;
}

.gallery-video video {
  object-fit: contain;
  background: linear-gradient(135deg, #f5f1eb 0%, #e8dcc6 100%);
}

/* Video Thumbnail Styles */
.video-thumbnail {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  position: relative;
  overflow: hidden;
}

.video-thumbnail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Video Controls in Gallery */
.gallery-video-controls {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
}

.gallery-video-progress {
  background: linear-gradient(to right, #8B7355 0%, #8B7355 var(--progress), rgba(255,255,255,0.3) var(--progress));
}

/* Video Play Button in Gallery */
.gallery-video-play {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.gallery-video-play:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Autoplay Indicator */
.autoplay-indicator {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  animation: autoplay-pulse 2s ease-in-out infinite;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes autoplay-pulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Autoplay Success State */
.autoplay-success {
  background: rgba(34, 197, 94, 0.8);
  border-color: rgba(34, 197, 94, 0.6);
  animation: autoplay-success 0.5s ease-out;
}

@keyframes autoplay-success {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Custom Video Slider Styles */
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  outline: none;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8B7355;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: #7a6449;
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8B7355;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  background: #7a6449;
  transform: scale(1.1);
}

/* Video Controls Animation */
.video-controls {
  transition: opacity 0.3s ease;
}

.video-controls:hover {
  opacity: 1 !important;
}

/* Video Play Button Animation */
.video-play-button {
  transition: all 0.3s ease;
}

.video-play-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Video Loading Animation */
.video-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive Video Gallery */
@media (max-width: 768px) {
  .video-gallery {
    aspect-ratio: 4 / 3;
    min-height: 250px;
  }
  
  .gallery-video {
    aspect-ratio: 1 / 1;
    min-height: 300px;
  }
  
  .slider::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
  }
  
  .slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
  }
}

/* Video Fullscreen Styles */
.video-fullscreen {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-fullscreen video {
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
}

/* Mobile-first hero section optimizations */
.hero-mobile-optimized {
  /* Ensure proper mobile spacing */
  padding-top: 2rem;
  padding-bottom: 2rem;
}

/* Mobile-optimized text sizing */
.hero-title-mobile {
  font-size: clamp(1.5rem, 5vw, 3rem);
  line-height: 1.2;
}

.hero-subtitle-mobile {
  font-size: clamp(1rem, 3vw, 1.25rem);
  line-height: 1.4;
}

.hero-description-mobile {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  line-height: 1.5;
}

/* Mobile-optimized button sizing */
.hero-button-mobile {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

@media (min-width: 640px) {
  .hero-button-mobile {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

/* Mobile-optimized badge sizing */
.hero-badge-mobile {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

@media (min-width: 640px) {
  .hero-badge-mobile {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}

/* Mobile-optimized image container */
.hero-image-mobile {
  max-width: 100%;
  padding: 1rem;
  border-radius: 1rem;
}

@media (min-width: 640px) {
  .hero-image-mobile {
    padding: 1.5rem;
    border-radius: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-image-mobile {
    padding: 2rem;
    border-radius: 1.875rem;
  }
}

/* Mobile-optimized decorative elements */
.hero-decorative-mobile {
  display: none;
}

@media (min-width: 640px) {
  .hero-decorative-mobile {
    display: block;
  }
}

/* Mobile-optimized spacing */
.hero-spacing-mobile {
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .hero-spacing-mobile {
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .hero-spacing-mobile {
    gap: 3rem;
  }
}

/* Mobile-optimized padding */
.hero-padding-mobile {
  padding: 2rem 1rem;
}

@media (min-width: 640px) {
  .hero-padding-mobile {
    padding: 3rem 1.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-padding-mobile {
    padding: 4rem 2rem;
  }
}

@media (min-width: 1280px) {
  .hero-padding-mobile {
    padding: 8rem 2rem;
  }
}

/* Mobile-optimized min-height */
.hero-height-mobile {
  min-height: 70vh;
}

@media (min-width: 640px) {
  .hero-height-mobile {
    min-height: 80vh;
  }
}

@media (min-width: 1024px) {
  .hero-height-mobile {
    min-height: 90vh;
  }
}

/* Mobile-optimized grid layout */
.hero-grid-mobile {
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .hero-grid-mobile {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

/* Mobile-optimized text alignment */
.hero-text-mobile {
  text-align: center;
}

@media (min-width: 1024px) {
  .hero-text-mobile {
    text-align: left;
  }
}

/* Mobile-optimized image margin */
.hero-image-margin-mobile {
  margin-top: 2rem;
}

@media (min-width: 1024px) {
  .hero-image-margin-mobile {
    margin-top: 0;
  }
}

/* Mobile-optimized steam effects */
.hero-steam-mobile {
  display: none;
}

@media (min-width: 640px) {
  .hero-steam-mobile {
    display: block;
  }
}

/* Mobile-optimized floating elements */
.hero-floating-mobile {
  position: relative;
  transform: none;
}

@media (min-width: 640px) {
  .hero-floating-mobile {
    position: absolute;
    transform: translate(-50%, -50%);
  }
}

/* Mobile-optimized overflow handling */
.hero-overflow-mobile {
  overflow: hidden;
  position: relative;
}

/* Mobile-optimized touch targets */
.hero-touch-mobile {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile-optimized animations */
.hero-animation-mobile {
  animation: none;
}

@media (min-width: 640px) {
  .hero-animation-mobile {
    animation: hero-float-subtle 3s ease-in-out infinite;
  }
}

/* Mobile-optimized shadows */
.hero-shadow-mobile {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .hero-shadow-mobile {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
}

/* Mobile-optimized backdrop blur */
.hero-backdrop-mobile {
  backdrop-filter: none;
  background: rgba(255, 255, 255, 0.95);
}

@media (min-width: 640px) {
  .hero-backdrop-mobile {
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.9);
  }
}

/* Mobile-specific animations */
@keyframes hero-float-subtle-mobile {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Mobile-optimized steam animation */
@keyframes steam-rise-mobile {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-10px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.5);
  }
}

/* Mobile-optimized responsive utilities */
@media (max-width: 639px) {
  .sm\:hidden {
    display: none !important;
  }
  
  .sm\:block {
    display: block !important;
  }
  
  .sm\:text-sm {
    font-size: 0.875rem !important;
  }
  
  .sm\:text-base {
    font-size: 1rem !important;
  }
  
  .sm\:px-6 {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
  }
  
  .sm\:py-3 {
    padding-top: 0.75rem !important;
    padding-bottom: 0.75rem !important;
  }
}
