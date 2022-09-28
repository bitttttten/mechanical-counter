import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Vertical } from "./vertical";

export interface MechanicalCounterProps {
  text: string | number;
  height?: string | number;
}

const transition = { ease: "easeOut" };

export function MechanicalCounter({
  text,
  height = "1em",
}: MechanicalCounterProps) {
  const [isLoaded, set] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const getTextStats = useMemo(() => generateTextStats(ref), [ref]);

  // we need to wait until we have the ref
  // so we can calculate the font height
  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      typeof document.fonts.ready === "object"
    ) {
      document.fonts.ready.finally(() => set(true));
    } else {
      set(true);
    }
  }, []);

  const baseStyles = {
    height,
    lineHeight: typeof height === "string" ? height : `${height}px`,
  };

  if (!isLoaded) {
    // it's opacity 0 since we only really want to get the ref
    // to calculate the font height
    return (
      <div style={{ ...baseStyles, opacity: 0 }}>
        <span ref={ref}>{text}</span>
      </div>
    );
  }

  const textArray = String(text).split("");
  const stats = textArray.map(getTextStats);
  const totalWidth = Math.ceil(stats.reduce(count, 0));

  return (
    <motion.div
      initial={{
        width: totalWidth,
      }}
      animate={{
        width: totalWidth,
      }}
      transition={transition}
      style={{
        ...baseStyles,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* this is the text that the user can select and copy */}
      <span
        style={{
          color: "transparent",
          position: `absolute`,
          top: 0,
          left: 0,
        }}
        ref={ref}
      >
        {text}
      </span>

      <AnimatePresence initial={false}>
        {textArray.map((letter, index) => {
          const x = stats.slice(0, index).reduce(count, 0);
          const width = stats[index];

          // animate from the right to left, so we need to invert the index
          const key = `${textArray.length - index}`;

          return (
            <motion.span
              key={key}
              layoutId={key}
              animate={{ x, width, opacity: 1 }}
              initial={{ x, width, opacity: 0 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              <Vertical letter={letter} />
            </motion.span>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

function count(acc: number, curr: number) {
  return acc + curr;
}

function generateTextStats(ref: React.RefObject<HTMLDivElement>) {
  const cache = new Map<string, number>();

  // safety for nodejs/ssr
  if (typeof document === "undefined") {
    return function (letter: string): number {
      return cache.get(letter) ?? 0;
    };
  }

  let hasCalculatedFont = false;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  return function (letter: string): number {
    if (!cache.has(letter)) {
      if (!hasCalculatedFont) {
        context.font = getFont(ref.current ?? document.body);
        hasCalculatedFont = true;
      }
      cache.set(letter, context.measureText(letter)?.width ?? 0);
    }

    return cache.get(letter) ?? 0;
  };
}

function getFont(element: HTMLElement) {
  const font = getComputedStyle(element).getPropertyValue("font");

  if (font) {
    return font;
  }

  const fontFamily = getComputedStyle(element).getPropertyValue("font-family");
  const fontSize = getComputedStyle(element).getPropertyValue("font-size");

  return `${fontSize} / ${fontSize} ${fontFamily}`;
}
