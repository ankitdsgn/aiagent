"use client";

import Nav from "@/components/nav/Nav";
import Side from "@/components/sidebar/Side";
import styles from "./dashboard.module.css";
import VariationItem, {
  Variation,
} from "@/components/variation_item/VariationItem";
import { useAIStore } from "@/app/stores/aistores";
import { Empty } from "antd";

export default function Page() {
  const variations = useAIStore((s) => s.variations) as Variation[]; // or type your store to Variation[]

  return (
    <div className={styles["dashboard-main-cont"]}>
      <Nav />
      <div className={styles["dashboard-content"]}>
        <Side />
        <div className={styles["dashboard-right-cont"]}>
          <div
            className={`${styles["variations-cont-temp"]} ${styles["variations-cont-temp-cmn"]}`}
          >
            {variations.length === 0 ? (
              <Empty
                description="No variations generated yet."
                className={styles["empty-state"]}
              />
            ) : (
              variations.map((v, i) => <VariationItem key={i} output={v} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
