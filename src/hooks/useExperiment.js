import { useEffect, useState } from "react";

/** Sticky A/B bucket with URL override (?exp=A or ?exp=B) */
export function useExperiment(key = "hero") {
  const [bucket, setBucket] = useState(() => {
    const url = new URL(window.location.href);
    const qp = url.searchParams.get("exp") || url.searchParams.get("variant");
    if (qp === "A" || qp === "B") return qp;

    const stored = localStorage.getItem(`exp:${key}`);
    if (stored === "A" || stored === "B") return stored;

    let uid = localStorage.getItem("uid");
    if (!uid) {
      uid = Math.random().toString(36).slice(2);
      localStorage.setItem("uid", uid);
    }
    let sum = 0;
    for (let i = 0; i < uid.length; i++) sum += uid.charCodeAt(i);
    const v = sum % 2 === 0 ? "A" : "B";
    localStorage.setItem(`exp:${key}`, v);
    return v;
  });

  // simple local exposure log (optional)
  useEffect(() => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    events.unshift({ ts: Date.now(), type: "exposure", key, bucket });
    localStorage.setItem("events", JSON.stringify(events.slice(0, 100)));
  }, [key, bucket]);

  const override = (v) => {
    localStorage.setItem(`exp:${key}`, v);
    setBucket(v);
  };

  return { bucket, override };
}
