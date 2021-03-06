import React from "react";
import { motion } from "framer-motion";

interface VerticalProps {
  letter: string;
}

const chars = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", ",", ".", "-"];
const amountOfItems = chars.length + 1;
const containerHeight = `${amountOfItems}em`;

export function Vertical({ letter }: VerticalProps) {
  const charIndex = chars.findIndex((char) => char === letter);

  if (charIndex === -1) {
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
        {chars.map((char) => (
          <div key={char}>{char}</div>
        ))}
      </motion.div>
    </div>
  );
}
