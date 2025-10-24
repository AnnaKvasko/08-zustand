"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./Modal.module.css";

export default function ModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
