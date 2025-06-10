import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";

interface ThemeSectionProps {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({ theme, setTheme }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t("theme")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("chooseYourPreferredAppearance")}
        </p>
      </div>
      <RadioGroup
        defaultValue={theme || "system"}
        onValueChange={setTheme}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        {["light", "dark", "dim", "system"].map((value) => (
          <Label
            key={value}
            className="cursor-pointer [&:has([data-state=checked])]:border-primary"
          >
            <div className="flex items-center w-full space-x-2 rounded-lg border p-4 hover:bg-secondary transition-colors">
              <RadioGroupItem value={value} id={value} />
              <span className="capitalize">
                {t(`theme${value.charAt(0).toUpperCase() + value.slice(1)}`)}
              </span>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ThemeSection;
