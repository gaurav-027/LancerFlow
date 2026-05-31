"use client";;
import { cn } from "../../lib/utils";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const UserRoundIcon = forwardRef((
 {
  onMouseEnter,
  onMouseLeave,
  className,
  size = 24,
  duration = 1,
  isAnimated = true,
  ...props
 },
 ref,
) => {
 const controls = useAnimation();
 const reduced = useReducedMotion();
 const isControlled = useRef(false);

 useImperativeHandle(ref, () => {
  isControlled.current = true;
  return {
   startAnimation: () => controls.start("animate"),
   stopAnimation: () => controls.start("normal"),
  };
 });

 const handleEnter = useCallback((e) => {
  if (!isAnimated || reduced) return;
  if (!isControlled.current) controls.start("animate");
  else onMouseEnter?.(e);
 }, [controls, reduced, isAnimated, onMouseEnter]);

 const handleLeave = useCallback((e) => {
  if (!isControlled.current) controls.start("normal");
  else onMouseLeave?.(e);
 }, [controls, onMouseLeave]);

 const curveVariants = {
  normal: { strokeDashoffset: 0, opacity: 1 },
  animate: {
   strokeDashoffset: [40, 0],
   opacity: [0.3, 1],
   transition: {
    duration: 0.6 * duration,
    delay: 0.3,
    ease: "easeInOut",
   },
  },
 };

 const headVariants = {
  normal: { scale: 1, opacity: 1 },
  animate: {
   scale: [0.5, 1.2, 1],
   opacity: [0, 1],
   transition: { duration: 0.6 * duration, ease: "easeOut" },
  },
 };

 return (
  <motion.div
   className={cn("inline-flex items-center justify-center", className)}
   onMouseEnter={handleEnter}
   onMouseLeave={handleLeave}
   {...props}>
   <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-user-round-icon lucide-user-round">
    <motion.circle
     cx="12"
     cy="8"
     r="5"
     variants={headVariants}
     initial="normal"
     animate={controls} />
    <motion.path
     d="M20 21a8 8 0 0 0-16 0"
     strokeDasharray="40"
     strokeDashoffset="0"
     variants={curveVariants}
     initial="normal"
     animate={controls} />
   </motion.svg>
  </motion.div>
 );
});

UserRoundIcon.displayName = "UserRoundIcon";
export { UserRoundIcon };
