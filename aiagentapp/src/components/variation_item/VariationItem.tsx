"use client";

import styles from "./VaraitionItem.module.css";
import { Flex, Progress } from "antd";
import { useEffect, useState } from "react";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export type Variation = {
  variation: string;
  temp: number;
  top_p: number; // keep the API’s snake_case key
};

type Props = { output: Variation };

export default function VariationItem({ output }: Props) {
  const prefersReduced = useReducedMotion();

  // progress demo
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 26, mass: 1.05 });
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const unsub = spring.on("change", (v) => setPercent(Math.round(v)));
    mv.set(60);
    return () => unsub();
  }, [mv, spring]);

  return (
    <MotionConfig
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
      }
      reducedMotion="user"
    >
      <motion.div
        className={styles["variation-item"]}
        initial={prefersReduced ? false : { opacity: 0, y: 10, scale: 0.995 }}
        animate={prefersReduced ? {} : { opacity: 1, y: 0, scale: 1 }}
        whileHover={prefersReduced ? {} : { y: -2, scale: 1.002 }}
        whileTap={prefersReduced ? {} : { scale: 0.992 }}
        layout
      >
        {/* Top */}
        <div className={styles["variation-top-cont"]}>
          <div className={styles["variation-top-head"]}>VARIATION</div>
          <div className={styles["variation-top-metric"]}>
            <p className={styles["variation-top-metric-text"]}>Custom metric</p>
            <Progress
              strokeColor={["var(--primary)", "var(--primary)", "#f50"]}
              percent={percent}
              steps={3}
            />
          </div>
        </div>

        {/* Bottom */}
        <div className={styles["variation-bottom-cont"]}>
          <p className={styles["variation-text"]}>{output.variation}</p>

          <Flex
            className={styles["variation-metric-cont"]}
            gap={12}
            wrap="wrap"
          >
            <div className={styles["variation-metric"]}>
              <p className={styles["variation-metric-label"]}>Temp</p>
              <p className={styles["variation-metric-value"]}>
                {output.temp.toFixed(2)}
              </p>
            </div>
            <div className={styles["variation-metric"]}>
              <p className={styles["variation-metric-label"]}>Top p</p>
              <p className={styles["variation-metric-value"]}>
                {output.top_p.toFixed(2)}
              </p>
            </div>
          </Flex>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
