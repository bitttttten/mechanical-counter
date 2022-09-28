import React from "react";
import { motion } from "framer-motion";

interface VerticalProps {
  letter: string;
}

const chars = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", ",", ".", "-"];
const amountOfItems = chars.length + 1;
const containerHeight = `${amountOfItems}em`;

// we make a map of char to index: 9 => 0, 8 => 1, 7 => 2, etc.
const charsIndex = new Map<string, number>(
  Array(chars.length).fill(true).map((_, index) => [chars[index], index])
)

const children = chars.map((char) => <div key={char}>{char}</div>);

export function Vertical({ letter }: VerticalProps) {
  const charIndex = charsIndex.get(letter);

  if (!charIndex) {
    return <React.Fragment>{letter}</React.Fragment>;
  }

  const y = `${(-charIndex / (amountOfItems - 1)) * 100}%`;

  return (
    <div style={{ height: containerHeight, position: "relative" }}>
      <motion.div
        initial={{ y, opacity: 0 }}
        animate={{ y, opacity: 1 }}
        exit={{ y, opacity: 0 }}
        transition={{ ease: "easeOut" }}
        style={{
          position: `absolute`,
          left: 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
