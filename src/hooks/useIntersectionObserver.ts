import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    freezeOnceVisible = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const isElementIntersecting = entry.isIntersecting;

      setIsIntersecting(isElementIntersecting);

      if (isElementIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    },
    [hasIntersected]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(callback, {
      threshold,
      rootMargin,
      root,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback, threshold, rootMargin, root]);

  // Reset intersection state if freezeOnceVisible is false
  useEffect(() => {
    if (!freezeOnceVisible && !isIntersecting) {
      setHasIntersected(false);
    }
  }, [isIntersecting, freezeOnceVisible]);

  return {
    ref: elementRef,
    isIntersecting: freezeOnceVisible ? hasIntersected : isIntersecting,
  };
};

// Optimized lazy loading hook
export const useLazyLoad = (options?: UseIntersectionObserverOptions) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true,
    ...options,
  });

  return { ref, isVisible: isIntersecting };
};

// Optimized infinite scroll hook
export const useInfiniteScroll = (
  callback: () => void,
  options?: UseIntersectionObserverOptions
) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    ...options,
  });

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting, callback]);

  return { ref };
}; 