import React from 'react';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground = () => {
  const { background } = useTheme();

  if (background === 'none') {
    return null;
  }

  const bgClass = background === 'waves' ? 'bg-waves' : 'bg-fluid';

  return (
    <div className={`fixed inset-0 z-[-1] transition-opacity duration-500 ease-in-out ${bgClass}`} />
  );
};

export default AnimatedBackground;
