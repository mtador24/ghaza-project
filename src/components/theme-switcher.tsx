
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      title={theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
    >
      {theme === "light" ? (
        <Moon size={20} className="text-foreground" />
      ) : (
        <Sun size={20} className="text-foreground" />
      )}
      <span className="sr-only">
        {theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
      </span>
    </Button>
  );
}
