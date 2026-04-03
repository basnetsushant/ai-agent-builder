import { useEffect, useState } from "react";

const SessionTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutess = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-sm text-white">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      Session: {minutess}:{secs}
    </div>
  );
};

export default SessionTimer;
