import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.body.classList.toggle("dark-mode", newDark);
  };

  return (
    <div className={`theme-switch ${dark ? "dark" : ""}`} onClick={toggleTheme}>
      <div className="switch-circle">{dark ? "🌙" : "☀️"}</div>
    </div>
  );
}
