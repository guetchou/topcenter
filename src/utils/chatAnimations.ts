import { cn } from "@/lib/utils";

export type PulseIntensity = 'low' | 'medium' | 'high';

export interface AnimationConfig {
  pulse: Record<PulseIntensity, string>;
  bounce: string;
  wiggle: string;
  popIn: string;
  slideIn: string;
}

// Chat animation utility to keep animation logic consistent
export const chatAnimations: AnimationConfig = {
  pulse: {
    low: "animate-pulse-slow",
    medium: "animate-pulse",
    high: "animate-pulse-fast"
  },
  bounce: "animate-bounce-subtle",
  wiggle: "animate-wiggle",
  popIn: "animate-pop-in",
  slideIn: "animate-slide-in"
};

// Helper to get appropriate animation class
export const getAnimationClass = (
  animate: boolean,
  animationType: keyof AnimationConfig,
  intensity?: PulseIntensity
) => {
  if (!animate) return "";
  
  if (animationType === 'pulse' && intensity) {
    return chatAnimations.pulse[intensity];
  }
  
  return chatAnimations[animationType];
};

// Helper to apply multiple animations with conditions
export const applyAnimations = (
  baseClasses: string,
  animations: { 
    type: keyof AnimationConfig, 
    active: boolean,
    intensity?: PulseIntensity
  }[]
) => {
  const animationClasses = animations
    .filter(anim => anim.active)
    .map(anim => getAnimationClass(anim.active, anim.type, anim.intensity))
    .filter(Boolean);
  
  return cn(baseClasses, ...animationClasses);
};
