import Image from "next/image";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <div className={styles["nav-container"]}>
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={127}
        height={28}
        priority
      />
    </div>
  );
}
