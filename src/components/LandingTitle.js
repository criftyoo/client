import React, { useEffect, useState } from "react";

const TITLES = [
    "Empowering you to take control of your schedule—because your time matters.",
    "Designed by a colleague, for colleagues—simplifying the entire swap process for a smoother scheduling experience.",
    "Your work-life balance, your way—effortlessly manage shifts and preferences with ease."
];

const LandingTitle = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    let timeout = null;
    let titleInterval = null;
    titleInterval = setInterval(() => {
      const index = (titleIndex + 1) % TITLES.length;
      setTitleIndex(index);
      setFadeIn(true);
      timeout = setTimeout(() => {
        setFadeIn(false);
      }, 3000);
    }, 4000);

    timeout = setTimeout(() => {
      setFadeIn(false);
    }, 2000);

    return function cleanup() {
      clearInterval(titleInterval);
      clearTimeout(timeout);
    };
  }, [titleIndex]);

  return (
    <p className={fadeIn ? "title-fade-in" : "title-fade-out"}>
      {TITLES[titleIndex]}
    </p>
  );
};

export default LandingTitle;
