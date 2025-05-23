import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/contexts/themeContext"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-4">
      <Label htmlFor="theme-switch">Modo noturno</Label>
      <Switch
        id="theme-switch"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme} 
      />
    </div>
  )
}
