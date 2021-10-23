import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Vertical } from "./vertical";

export interface MechanicalCounterProps {
  text: string | number;
  height?: string | number;
}

export function MechanicalCounter({
  text,
  height = "1em",
}: MechanicalCounterProps) {
  const [isLoaded, set] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const getTextStats = generateTextStats(ref);

  const textArray = String(text).split("");
  const stats = textArray.map(getTextStats);
  const totalWidth = stats.reduce(count, 0);

  // we need to wait until we have the ref
  // so we can calculate the font height
  useEffect(() => {
    set(true);
  }, []);

  const baseStyles = {
    height,
    lineHeight: typeof height === "string" ? height : `${height}px`,
  };

  if (!isLoaded) {
    // it's opacity 0 since we only really want to get the ref
    // to calculate the font height
    return (
      <div>
        <span style={{ ...baseStyles, opacity: 0 }} ref={ref}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        width: totalWidth,
      }}
      animate={{
        width: totalWidth,
      }}
      transition={{ ease: "easeOut" }}
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
          const left = stats.slice(0, index).reduce(count, 0);
          const width = stats[index];

          // animate from the right to left, so we need to invert the index
          const key = `${textArray.length - index}`;

          return (
            <motion.span
              key={key}
              layoutId={key}
              animate={{ left, width, opacity: 1 }}
              initial={{ left, width, opacity: 0 }}
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
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  return function (letter: string): number {
    if (!cache.has(letter)) {
      context.font = getComputedStyle(ref.current ?? document.body).font;

      cache.set(letter, context.measureText(letter)?.width ?? 0);
    }

    return cache.get(letter) ?? 0;
  };
}
