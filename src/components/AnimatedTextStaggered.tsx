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
  loop = false, // Default false
  animation = defaultAnimations,
}: AnimatedTextStaggeredProps) => {
  const controls = useAnimation();
  const textArray = Array.isArray(text) ? text : [text];
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const animate = async () => {
    try {
      await controls.start("visible");
      if (loop && repeatDelay) {
        timeoutRef.current = setTimeout(async () => {
          await controls.start("hidden");
          animate(); // Recursively call animate for loop
        }, repeatDelay);
      }
    } catch (error) {
      // Handle any animation errors
      console.error("Animation error:", error);
    }
  };

  useEffect(() => {
    controls.set("hidden");

    if (isInView) {
      animate();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInView]);

  return (
    <Wrapper className={className}>
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        {textArray.join(" ")}
      </span>
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
