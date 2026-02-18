import { useEffect } from 'react';

const useScrollToTop = () => {
  //   useEffect(() => {
  //     const scrollToTop = () => {
  //       window.scrollTo(0, 0);
  //     };

  //     scrollToTop();

  //     window.addEventListener("beforeunload", scrollToTop);

  //     return () => {
  //       window.removeEventListener("beforeunload", scrollToTop);
  //     };
  //   }, []);
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    // Scroll to top when the component mounts or when the URL changes (on refresh)
    scrollToTop();

    window.addEventListener('beforeunload', scrollToTop);

    return () => {
      window.removeEventListener('beforeunload', scrollToTop);
    };
  }, []);
};

export default useScrollToTop;
