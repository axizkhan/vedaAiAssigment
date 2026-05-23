import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/ui/component.utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gesturePresets } from "@/lib/motion/gesture.utils";
import { Button, ButtonProps } from "@/components/ui/button";

export interface AnimatedButtonProps extends ButtonProps {
  motionProps?: HTMLMotionProps<"button">;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, motionProps, ...props }, ref) => {
    const prefersReduced = useReducedMotion();
    
    // We wrap the standard Button in a motion span or directly apply motion to a button.
    // Since Button is likely a standard functional component, we use motion.button
    // but apply the Button styles. Actually, easiest is mapping standard Button component.
    
    // If we want to use the exact UI Button but with motion, we can use motion(Button) 
    // or wrap its content. For simplicity and maintaining Button's internal state:
    
    return (
      <motion.div
        whileTap={prefersReduced ? undefined : gesturePresets.tapButton}
        whileHover={prefersReduced ? undefined : gesturePresets.hoverButton}
        className="inline-block"
      >
        <Button ref={ref} className={className} {...props} />
      </motion.div>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";
