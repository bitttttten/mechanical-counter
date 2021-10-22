import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Vertical } from "./vertical";

export interface MechanicalCounterProps {
  text: string;
  height?: string | number;
}

export function MechanicalCounter({
  text,
  height = "1em",
}: MechanicalCounterProps) {
  const [isLoaded, set] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const getTextStats = generateTextStats(ref);

  const textArray = text.split("");
  const stats = textArray.map(getTextStats);
  const totalWidth = stats.reduce(count, 0);

  // we need to wait until we have the ref
  // so we can calculate the font height
  useEffect(() => {
    if (isLoaded) {
      return void 0;
    }

    let isMounted = true;
    while (!ref.current && isMounted) {}
    set(true);
    return () => {
      isMounted = false;
    };
  }, [ref]);

  const placeholder = (
    <span
      style={{
        color: "transparent",
        position: `absolute`,
        top: 0,
        left: 0,
        height,
        lineHeight: typeof height === "string" ? height : `${height}px`,
      }}
      ref={ref}
    >
      {text}
    </span>
  );

  if (!isLoaded) {
    return placeholder;
  }

  return (
    <motion.div
      animate={{
        width: totalWidth,
      }}
      initial={{
        width: totalWidth,
      }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ ease: "easeOut" }}
      style={{
        overflow: "hidden",
        position: "relative",
        height,
        lineHeight: typeof height === "string" ? height : `${height}px`,
      }}
    >
      {placeholder}
      <AnimatePresence initial={false}>
        {textArray.map((letter, index) => {
          const left = stats.slice(0, index).reduce(count, 0);
          const width = stats[index];

          // i want to keep the first 3 characters static
          // and then also animate from the right to left, so i invert the index
          const key =
            index < 3
              ? `static-${index}`
              : `letter-${textArray.length - index}`;

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
