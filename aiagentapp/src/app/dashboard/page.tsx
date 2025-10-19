"use client";

import Nav from "@/components/nav/Nav";
import Side from "@/components/sidebar/Side";
import styles from "./dashboard.module.css";
import VariationItem, {
  Variation,
} from "@/components/variation_item/VariationItem";
import { useAIStore } from "@/app/stores/aistores";

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
              <p className="text-gray-500">
                No variations yet. Create some in the sidebar!
              </p>
            ) : (
              variations.map((v, i) => <VariationItem key={i} output={v} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
