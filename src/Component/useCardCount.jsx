import { useState, useEffect } from 'react';

const useCardCount = () => {
  const [cardsToShow, setCardsToShow] = useState(4);

  const calculateCardsToShow = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1440) {
      setCardsToShow(4); // Show 4 cards for large screens
    } else if (screenWidth >= 1024) {
      setCardsToShow(3); // 3 cards for large screens
    } else if (screenWidth >= 768) {
      setCardsToShow(2); // 2 cards for medium screens
    } else {
      setCardsToShow(1); // 1 card for small screens
    }
  };

  useEffect(() => {
    calculateCardsToShow();
    window.addEventListener('resize', calculateCardsToShow);
    return () => {
      window.removeEventListener('resize', calculateCardsToShow);
    };
  }, []);

  return cardsToShow;
};

export default useCardCount;
