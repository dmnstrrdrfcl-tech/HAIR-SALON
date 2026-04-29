import { useEffect, useState } from "react";

export default function Loader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      data-testid="initial-loader"
      className={`loader-screen ${gone ? "hidden-loader" : ""}`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="loader-mark">SERENDIPITY</div>
        <div className="overline text-muted-foreground">Hair Atelier · Est. 2015</div>
      </div>
    </div>
  );
}
