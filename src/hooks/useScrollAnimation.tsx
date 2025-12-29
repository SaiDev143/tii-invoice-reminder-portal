import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
}

export function useScrollAnimationGroup(
  count: number,
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.children;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Array.from(children).indexOf(entry.target as Element);
          if (index !== -1) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              if (entry.isIntersecting) {
                newState[index] = true;
              } else if (!triggerOnce) {
                newState[index] = false;
              }
              return newState;
            });

            if (entry.isIntersecting && triggerOnce) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    Array.from(children).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [count, threshold, rootMargin, triggerOnce]);

  return { containerRef, visibleItems };
}

export default useScrollAnimation;