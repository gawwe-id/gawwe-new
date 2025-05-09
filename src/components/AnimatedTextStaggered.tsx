"use client";

import { useEffect, useRef, JSX } from "react";
import { motion, useAnimation, useInView, Variant } from "framer-motion";

type AnimatedTextStaggeredProps = {
  text: string | string[];
  el?: keyof JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
  repeatDelay?: number;
  loop?: boolean;
  animation?: {
    hidden: Variant;
    visible: Variant;
  };
};

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export const AnimatedTextStaggered = ({
  text,
  el: Wrapper = "p",
  className,
  once,
  repeatDelay,
  loop = false,
  animation = defaultAnimations,
}: AnimatedTextStaggeredProps) => {
  const controls = useAnimation();
  const textArray = Array.isArray(text) ? text : [text];
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const animate = async () => {
    if (!isMountedRef.current) return;

    try {
      await controls.start("visible");
      if (loop && repeatDelay && isMountedRef.current) {
        timeoutRef.current = setTimeout(async () => {
          if (isMountedRef.current) {
            await controls.start("hidden");
            animate();
          }
        }, repeatDelay);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Animation error:", error);
      }
    }
  };

  useEffect(() => {
    if (!isMountedRef.current) return;

    const initializeAnimation = async () => {
      await controls.set("hidden");
      if (isInView) {
        animate();
      }
    };

    initializeAnimation();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInView, controls]);

  return (
    <Wrapper className={className}>
      <span className="sr-only">{textArray.join(" ")}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
        aria-hidden
      >
        {textArray.map((line, lineIndex) => (
          <span style={{ display: "block" }} key={`${line}-${lineIndex}`}>
            {line.split(" ").map((word, wordIndex) => (
              <span
                style={{ display: "inline-block" }}
                key={`${word}-${wordIndex}`}
              >
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={`${char}-${charIndex}`}
                    style={{ display: "inline-block" }}
                    variants={animation}
                  >
                    {char}
                  </motion.span>
                ))}
                <span style={{ display: "inline-block" }}>&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
