import { useEffect, useRef, useState } from 'react';

const useElementOnScreen = (options = { root: null, rootMargin: '0px', threshold: 0 }) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const elememt = ref.current;

    if (elememt) {
      const observer = new IntersectionObserver(callbackFunction, options);
      observer.observe(elememt);

      return () => {
        observer.unobserve(elememt);
      };
    }
  }, [ref, options]);

  return { ref, isVisible };
};

export default useElementOnScreen;
