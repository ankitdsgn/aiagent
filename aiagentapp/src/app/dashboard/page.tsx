import Nav from "@/components/nav/Nav";
import Side from "@/components/sidebar/Side";
import styles from "./dashboard.module.css";
import VariationItem from "@/components/variation_item/VariationItem";

export default function Page() {
  return (
    <div className={styles["dashboard-main-cont"]}>
      <Nav />
      <div className={styles["dashboard-content"]}>
        <Side />

        <div className={styles["dashboard-right-cont"]}>
          <VariationItem />
        </div>
      </div>
    </div>
  );
}
