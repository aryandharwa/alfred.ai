import React from 'react';
import { motion } from 'framer-motion';

const TypingAnimation = () => {
  return (
    <div className="flex space-x-2 p-4">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: (dot - 1) * 0.2
          }}
        />
      ))}
    </div>
  );
};

export default TypingAnimation; 