"use client";
import Nav from "@/components/nav/Nav";
import styles from "./loading.module.css";
import Image from "next/image";
import Loader from "@/components/loader/Loader";
import LinearLoader from "@/components/linear_loader/LinearLoader";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Any side effects or cleanup can be handled here if needed

    //wait for loader to finish then redirect to dashboard
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 3000); // 5 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [router]);
  return (
    <main>
      <Nav />
      <div className={styles["loading-main-cont"]}>
        <Loader />
        <h1 className={styles["loading-title"]}>
          Stepping into the Lab. Get ready to see how parameter tuning changes a
          model.
        </h1>
        <Image
          src="/images/loadingcenterimg.png"
          alt="Loading..."
          width={500} // intrinsic dimensions (e.g. from file)
          height={200}
          className={styles["loading-center-img"]}
          style={{ width: "auto", height: "auto" }}
        />
        <LinearLoader />
        <p className={styles["loading-text"]}>Loading please wait</p>
      </div>
    </main>
  );
}
