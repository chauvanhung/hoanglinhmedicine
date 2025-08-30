'use client';

import React from 'react';

interface LoadingProps {
  type?: 'spinner' | 'dots' | 'bar' | 'circle' | 'wave';
  text?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Loading({ 
  type = 'spinner', 
  text = 'Đang tải...', 
  size = 'medium',
  className = '' 
}: LoadingProps): React.ReactElement {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const renderLoading = (): React.ReactElement => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`loading-spinner ${sizeClasses[size]}`}>
            <div className="loading-text">{text}</div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex flex-col items-center">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={`loading-text ${textSizes[size]}`}>{text}</div>
          </div>
        );
      
      case 'bar':
        return (
          <div className="flex flex-col items-center">
            <div className="loading-bar"></div>
            <div className={`loading-text ${textSizes[size]}`}>{text}</div>
          </div>
        );
      
      case 'circle':
        return (
          <div className="flex flex-col items-center">
            <div className={`loading-circle ${sizeClasses[size]}`}></div>
            <div className={`loading-text ${textSizes[size]}`}>{text}</div>
          </div>
        );
      
      case 'wave':
        return (
          <div className="flex flex-col items-center">
            <div className="loading-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={`loading-text ${textSizes[size]}`}>{text}</div>
          </div>
        );
      
      default:
        return (
          <div className={`loading-spinner ${sizeClasses[size]}`}>
            <div className="loading-text">{text}</div>
          </div>
        );
    }
  };

  return (
    <div className={`loading-container ${className}`}>
      {renderLoading()}
    </div>
  );
}

// Loading variants for specific use cases
export function LoadingSpinner({ text, size, className }: Omit<LoadingProps, 'type'>): React.ReactElement {
  return <Loading type="spinner" text={text} size={size} className={className} />;
}

export function LoadingDots({ text, size, className }: Omit<LoadingProps, 'type'>): React.ReactElement {
  return <Loading type="dots" text={text} size={size} className={className} />;
}

export function LoadingBar({ text, size, className }: Omit<LoadingProps, 'type'>): React.ReactElement {
  return <Loading type="bar" text={text} size={size} className={className} />;
}

export function LoadingCircle({ text, size, className }: Omit<LoadingProps, 'type'>): React.ReactElement {
  return <Loading type="circle" text={text} size={size} className={className} />;
}

export function LoadingWave({ text, size, className }: Omit<LoadingProps, 'type'>): React.ReactElement {
  return <Loading type="wave" text={text} size={size} className={className} />;
}
