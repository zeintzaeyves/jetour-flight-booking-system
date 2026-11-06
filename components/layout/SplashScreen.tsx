"use client";

import { useEffect, useState } from "react";

const KEY = "jetour-splash";

// Shown once per browser session. The CSS animation hides it by itself, so a slow or
// failed hydration can never trap anyone behind it; the effect only unmounts it afterwards.
export const splashScript = `try{if(sessionStorage.getItem("${KEY}"))document.documentElement.classList.add("no-splash")}catch(e){}`;

export default function SplashScreen() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const t = setTimeout(() => setGone(true), seen ? 0 : 1900);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  return (
    <div id="splash" aria-hidden className="splash">
      <div className="splash-inner">
        <span className="splash-word">Jetour</span>
        <span className="splash-bar" />
      </div>
    </div>
  );
}
