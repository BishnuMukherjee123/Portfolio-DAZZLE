import { Moon, Sun } from "lucide-react";
import { useTheme } from "./use-theme";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="relative w-10 h-10 rounded-full flex items-center justify-center 
                   hover:bg-gray-100 dark:hover:bg-gray-800 
                   transition-all duration-300"
      >
        {/* Sun icon (for light mode) */}
        <Sun
          className="h-5 w-5 text-yellow-500 transition-all duration-500
                     dark:rotate-90 dark:scale-0"
        />
        {/* Moon icon (for dark mode) */}
        <Moon
          className="absolute h-5 w-5 text-blue-400 transition-all duration-500
                     rotate-90 scale-0 dark:rotate-0 dark:scale-100"
        />
      </button>
    </div>
  );
}
