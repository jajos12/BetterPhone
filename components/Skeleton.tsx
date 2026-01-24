import React from 'react';

interface Props {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

const Skeleton: React.FC<Props> = ({ 
  className = '', 
  width, 
  height, 
  variant = 'text' 
}) => {
  const baseStyles = "bg-[#D7CCC8]/20 animate-pulse";
  
  const variantStyles = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-2xl"
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
