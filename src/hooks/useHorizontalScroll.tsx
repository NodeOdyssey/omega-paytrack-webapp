import { useEffect, useRef } from 'react';

// Custom hook for horizontal scrolling
const useHorizontalScroll = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const handleScroll = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          element.scrollLeft += e.deltaY;
        }
      };

      element.addEventListener('wheel', handleScroll);

      return () => {
        element.removeEventListener('wheel', handleScroll);
      };
    }
  }, []);

  return elementRef;
};

export default useHorizontalScroll;
