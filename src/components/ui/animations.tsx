'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Base animation classes using CSS
export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',
  fadeInUp: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
  fadeInDown: 'animate-in fade-in slide-in-from-top-4 duration-500',
  fadeInLeft: 'animate-in fade-in slide-in-from-left-4 duration-500',
  fadeInRight: 'animate-in fade-in slide-in-from-right-4 duration-500',

  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-300',
  scaleOut: 'animate-out zoom-out-95 duration-200',
  bounceIn: 'animate-in zoom-in-50 duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',

  // Slide animations
  slideInUp: 'animate-in slide-in-from-bottom-full duration-500 ease-out',
  slideInDown: 'animate-in slide-in-from-top-full duration-500 ease-out',
  slideInLeft: 'animate-in slide-in-from-left-full duration-500 ease-out',
  slideInRight: 'animate-in slide-in-from-right-full duration-500 ease-out',

  // Spin animations
  spin: 'animate-spin duration-1000',
  spinSlow: 'animate-spin duration-3000',
  pulse: 'animate-pulse duration-2000',
  bounce: 'animate-bounce duration-1000',

  // Hover animations
  hoverScale: 'transition-transform duration-200 hover:scale-105',
  hoverScaleSmall: 'transition-transform duration-150 hover:scale-102',
  hoverLift: 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
  hoverGlow: 'transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20',
  hoverRotate: 'transition-transform duration-300 hover:rotate-3',

  // Focus animations
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200',
  focusScale: 'focus:scale-105 transition-transform duration-150',

  // Loading animations
  shimmer: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
  skeleton: 'animate-pulse bg-muted',
  wave: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',

  // Stagger animations (for lists)
  staggerItem: 'animate-in fade-in slide-in-from-bottom-4',
  staggerDelay1: 'animation-delay-75',
  staggerDelay2: 'animation-delay-150',
  staggerDelay3: 'animation-delay-300',
  staggerDelay4: 'animation-delay-500',
};

// Animation wrapper components
interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  animation?: keyof typeof animations;
  delay?: number;
  duration?: number;
  onAnimationComplete?: () => void;
}

export function AnimatedElement({
  children,
  className,
  animation = 'fadeIn',
  delay = 0,
  duration,
  onAnimationComplete,
}: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, duration || 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete, duration]);

  return (
    <div
      className={cn(
        isVisible && animations[animation],
        className
      )}
      style={{
        animationDelay: delay ? `${delay}ms` : undefined,
        animationDuration: duration ? `${duration}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}

// Stagger container for animating lists
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
}: StaggerContainerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <AnimatedElement
              key={index}
              animation="staggerItem"
              delay={isVisible ? index * staggerDelay : 0}
            >
              {child}
            </AnimatedElement>
          ))
        : children}
    </div>
  );
}

// Intersection Observer animation trigger
interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: keyof typeof animations;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function ScrollAnimation({
  children,
  className,
  animation = 'fadeInUp',
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(elementRef);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef);

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef);
      }
    };
  }, [elementRef, threshold, rootMargin, triggerOnce]);

  return (
    <div
      ref={setElementRef}
      className={cn(
        isVisible && animations[animation],
        className
      )}
    >
      {children}
    </div>
  );
}

// Button with animation states
interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  animation?: 'scale' | 'lift' | 'glow' | 'rotate';
}

export function AnimatedButton({
  children,
  className,
  onClick,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'md',
  animation = 'scale',
}: AnimatedButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    default: 'bg-background border border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-accent',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-11 px-8 text-base',
  };

  const animationClasses = {
    scale: animations.hoverScale,
    lift: animations.hoverLift,
    glow: animations.hoverGlow,
    rotate: animations.hoverRotate,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        !disabled && !loading && animationClasses[animation],
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        className
      )}
    >
      {loading && (
        <div className={cn('mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full', animations.spin)} />
      )}
      {children}
    </button>
  );
}

// Card with hover animations
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  animation?: 'lift' | 'scale' | 'glow' | 'tilt';
  clickable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function AnimatedCard({
  children,
  className,
  animation = 'lift',
  clickable = false,
  onClick,
  style,
}: AnimatedCardProps) {
  const animationClasses = {
    lift: animations.hoverLift,
    scale: animations.hoverScale,
    glow: animations.hoverGlow,
    tilt: 'transition-transform duration-300 hover:rotate-1',
  };

  return (
    <div
      onClick={clickable ? onClick : undefined}
      style={style}
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm',
        animationClasses[animation],
        clickable && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

// Loading spinner with customizable animation
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'primary' | 'secondary' | 'muted';
}

export function LoadingSpinner({
  size = 'md',
  className,
  variant = 'primary',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  };

  const variantClasses = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-secondary border-t-transparent',
    muted: 'border-muted-foreground border-t-transparent',
  };

  return (
    <div
      className={cn(
        'rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        animations.spin,
        className
      )}
    />
  );
}

// Page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={cn(animations.fadeInUp, className)}>
      {children}
    </div>
  );
}

// Modal/Dialog animation wrapper
interface ModalAnimationProps {
  children: ReactNode;
  isOpen: boolean;
  className?: string;
}

export function ModalAnimation({ children, isOpen, className }: ModalAnimationProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300',
        isOpen ? animations.scaleIn : animations.scaleOut,
        className
      )}
    >
      {children}
    </div>
  );
}

// Custom CSS animations (add to globals.css)
export const customKeyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  0%, 50% { border-color: transparent; }
  51%, 100% { border-color: currentColor; }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-typewriter {
  animation: typewriter 2s steps(40, end), blink 0.75s step-end infinite;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid;
}
`;

// Utility function to add stagger delays to multiple elements
export function addStaggerDelay(index: number, baseDelay = 100) {
  return {
    animationDelay: `${index * baseDelay}ms`,
  };
}

// Hook for managing animation states
export function useAnimation(initialState = false) {
  const [isAnimating, setIsAnimating] = useState(initialState);
  const [isComplete, setIsComplete] = useState(false);

  const startAnimation = () => {
    setIsAnimating(true);
    setIsComplete(false);
  };

  const completeAnimation = () => {
    setIsAnimating(false);
    setIsComplete(true);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setIsComplete(false);
  };

  return {
    isAnimating,
    isComplete,
    startAnimation,
    completeAnimation,
    resetAnimation,
  };
}