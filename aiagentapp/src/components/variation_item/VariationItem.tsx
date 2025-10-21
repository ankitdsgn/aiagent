"use client";

import styles from "./VariationItem.module.css";
import { Flex, Progress, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/** If your API might send strings/nulls, keep the unions. */
export type Variation = {
  variation: string;
  temp: number | string | null | undefined;
  top_p: number | string | null | undefined; // API uses snake_case
};

type Props = { output: Variation };

/** Safe formatter for numbers */
function formatFixed(value: unknown, digits = 2): string {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : NaN;
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

/** ------- Clarity metric (0–100) -------
 * Short + simple sentences score higher.
 * - Sentence length: 30% weight (<= 30 words best)
 * - Simple words ratio: 70% weight (<=6 chars or in common list)
 */
function clarityScore(text: string): number {
  if (!text || !text.trim()) return 0;

  const sentences = text
    .split(/[.!?]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return 0;

  const commonWords = new Set([
    "the",
    "is",
    "a",
    "to",
    "and",
    "of",
    "it",
    "in",
    "that",
    "for",
    "on",
    "with",
    "this",
    "as",
    "by",
    "an",
    "be",
    "are",
    "or",
    "from",
    "at",
    "we",
    "you",
    "they",
  ]);

  let scoreSum = 0;

  for (const s of sentences) {
    const words = s.split(/\s+/g).filter(Boolean);

    const wc = words.length || 1;

    // Simplicity: proportion of short/common words
    const simpleCount = words.filter(
      (w) => w.length <= 6 || commonWords.has(w.toLowerCase())
    ).length;
    const simplicity = simpleCount / wc;

    // Length: closer to short is better (cap at 30 words)
    const lengthFactor = 1 - Math.min(wc / 30, 1);

    // Per-sentence clarity
    const sentenceScore = 0.7 * simplicity + 0.3 * lengthFactor;
    scoreSum += sentenceScore;
  }

  const avg = scoreSum / sentences.length;
  return Math.max(0, Math.min(100, Number((avg * 100).toFixed(1))));
}

export default function VariationItem({ output }: Props) {
  const prefersReduced = useReducedMotion();

  // Motion plumbing for the progress bar
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 26, mass: 1.05 });
  const [percent, setPercent] = useState(0);

  // Compute clarity when text changes
  const clarity = useMemo(
    () => clarityScore(String(output?.variation ?? "")),
    [output?.variation]
  );

  // Animate progress to clarity value
  useEffect(() => {
    const unsub = spring.on("change", (v) =>
      setPercent(Math.max(0, Math.min(100, Math.round(v))))
    );
    mv.set(clarity);
    return () => unsub();
  }, [clarity, mv, spring]);

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
            <p className={styles["variation-top-metric-text"]}>Clarity</p>
            <Tooltip
              title={
                <>
                  <div>Short + simple sentences score higher.</div>
                  <div>Weight: 70% simple words, 30% length.</div>
                </>
              }
            >
              <Progress
                strokeColor={["rgba(27, 186, 144, 1)"]}
                percent={percent}
                steps={1}
              />
            </Tooltip>
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
                {formatFixed(output?.temp, 2)}
              </p>
            </div>

            <div className={styles["variation-metric"]}>
              <p className={styles["variation-metric-label"]}>Top p</p>
              <p className={styles["variation-metric-value"]}>
                {formatFixed(output?.top_p, 2)}
              </p>
            </div>
          </Flex>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
