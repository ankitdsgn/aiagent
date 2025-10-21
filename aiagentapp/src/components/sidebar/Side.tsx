"use client";

import api from "@/lib/axios";
import "@ant-design/v5-patch-for-react-19";
import styles from "./Side.module.css";
import { Input, Button, Slider, Skeleton, Switch } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Variants, TargetAndTransition } from "framer-motion";
import { useAIStore } from "@/app/stores/aistores";

function SliderSkeleton() {
  return (
    <Skeleton.Node
      active
      style={{ width: "100%", height: 24, borderRadius: 999 }}
    />
  );
}

/* ---------- Animated number (hydration-safe) ---------- */
function NumberTicker({
  value,
  fractionDigits = 2,
}: {
  value: number;
  fractionDigits?: number;
}) {
  // Render a static formatted value on the server/first paint,
  // then animate once mounted to avoid text-content mismatches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 260, damping: 30, mass: 0.9 });
  const rounded = useTransform(spring, (v) => v.toFixed(fractionDigits));

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  // During SSR / before mount, output a stable string.
  const initialText = useMemo(
    () => value.toFixed(fractionDigits),
    [value, fractionDigits]
  );

  return <motion.span>{mounted ? rounded : initialText}</motion.span>;
}

/* ---------- Motion variants (typed) ---------- */
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Side() {
  const setStoreVariations = useAIStore((s) => s.setVariations);

  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [textAreaValue, setTextAreaValue] = useState("");

  // Initial "page load" skeleton state
  const [initialLoading, setInitialLoading] = useState(true);
  // Action loading (when clicking Create variations)
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const [inputToggle, setInputToggle] = useState(false);

  const handleCreate = async () => {
    if (!textAreaValue) return;
    setWorking(true);

    try {
      const response = await api.post("/api/llm-chatgpt", {
        input_toggle: inputToggle,
        prompt: textAreaValue,
        temperature,
        top_p: topP,
      });

      const next = Array.isArray(response?.data?.variations?.variations)
        ? response.data.variations.variations
        : [];
      setStoreVariations(next);
    } catch (error) {
      console.error("API error:", error);
      setTextAreaValue("");
      setTemperature(0.7);
      setTopP(0.9);
    } finally {
      setWorking(false);
    }
  };

  return (
    <motion.div
      className={styles["side-main-cont"]}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.p
        className={styles["side-system-ins"]}
        variants={sectionVariants}
        custom={0}
      >
        System Instructions
      </motion.p>

      {/* Label */}
      <motion.label
        className={styles["side-label"]}
        htmlFor="message"
        variants={sectionVariants}
        custom={1}
      >
        Your input
      </motion.label>

      {/* Textarea: skeleton -> content crossfade */}
      <AnimatePresence mode="wait">
        {initialLoading ? (
          <motion.div
            key="ta-skeleton"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <Skeleton.Input
              active
              block
              style={{ height: 120, borderRadius: 10, marginBottom: 8 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="ta-content"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Input.TextArea
              className={styles["side-textarea"]}
              id="message"
              style={{ lineHeight: "20px" }}
              rows={5}
              placeholder="Type your message here..."
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              disabled={working}
              maxLength={300}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button: skeleton -> animated button, with hover/tap */}
      <AnimatePresence mode="wait">
        {initialLoading ? (
          <motion.div
            key="btn-skeleton"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <Skeleton.Button
              active
              block
              style={{ height: 40, borderRadius: 10, marginTop: 8 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="btn-content"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="primary"
                className={styles["side-submit-btn"]}
                disabled={!textAreaValue}
                loading={working}
                onClick={handleCreate}
              >
                Create variations
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration header (block container, legal nesting) */}
      <motion.div
        className={[
          styles["side-system-ins"],
          styles["side-system-ins-2"],
        ].join(" ")}
        variants={sectionVariants}
        custom={2}
      >
        <p>AI CONFIGURATION</p>
        <div className={styles["side-switch-cont"]}>
          <Switch
            checked={inputToggle}
            onChange={(checked) => setInputToggle(checked)}
            disabled={working}
            size="small"
          />
        </div>
      </motion.div>

      {/* -------- Temperature -------- */}
      <motion.p
        className={styles["side-config-item-head"]}
        variants={sectionVariants}
        custom={3}
      >
        Temperature
      </motion.p>
      <motion.p
        className={styles["side-config-item-sub"]}
        variants={sectionVariants}
        custom={4}
      >
        Controls how creative the responses are, lower values make it focused,
        higher values make it imaginative.
      </motion.p>

      <motion.div
        className={styles["side-config-slider-cont"]}
        variants={sectionVariants}
        custom={5}
      >
        <div className={styles["side-config-slider-labels"]}>
          <p className={styles["side-config-slider-label"]}>Range</p>
          {/* Use div because AntD Skeleton renders <div> */}
          <div className={styles["side-config-slider-label"]}>
            <AnimatePresence mode="wait">
              {initialLoading ? (
                <motion.div
                  key="t-skel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Skeleton.Input size="small" style={{ width: 48 }} active />
                </motion.div>
              ) : (
                <motion.span
                  key="t-val"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <NumberTicker value={temperature} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {initialLoading ? (
            <motion.div
              key="t-slider-skel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SliderSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="t-slider"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={temperature}
                onChange={(v) => setTemperature(v as number)}
                disabled={!inputToggle || working}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* -------- Top P -------- */}
      <motion.p
        className={styles["side-config-item-head"]}
        variants={sectionVariants}
        custom={6}
      >
        Top P
      </motion.p>
      <motion.p
        className={styles["side-config-item-sub"]}
        variants={sectionVariants}
        custom={7}
      >
        Controls how many likely words are used, lower for focus, higher for
        variety.
      </motion.p>

      <motion.div
        className={styles["side-config-slider-cont"]}
        variants={sectionVariants}
        custom={8}
      >
        <div className={styles["side-config-slider-labels"]}>
          <p className={styles["side-config-slider-label"]}>Range</p>
          <div className={styles["side-config-slider-label"]}>
            <AnimatePresence mode="wait">
              {initialLoading ? (
                <motion.div
                  key="p-skel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Skeleton.Input size="small" style={{ width: 48 }} active />
                </motion.div>
              ) : (
                <motion.span
                  key="p-val"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <NumberTicker value={topP} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {initialLoading ? (
            <motion.div
              key="p-slider-skel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SliderSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="p-slider"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Slider
                min={0.1}
                max={1}
                step={0.01}
                value={topP}
                onChange={(v) => setTopP(v as number)}
                disabled={!inputToggle || working}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
