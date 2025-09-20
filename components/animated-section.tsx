"use client";

import { motion } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
}: AnimatedSectionProps) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -200px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getInitialState = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 50 };
      case "down":
        return { opacity: 0, y: -50 };
      case "left":
        return { opacity: 0, x: -50 };
      case "right":
        return { opacity: 0, x: 50 };
      case "fade":
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateState = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "fade":
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialState()}
      animate={isInView ? getAnimateState() : getInitialState()}
      transition={{
        duration,
        delay: isInView ? delay : 0,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
