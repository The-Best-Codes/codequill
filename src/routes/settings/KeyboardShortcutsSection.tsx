import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const KeyboardShortcutsSection = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t("keyboardShortcuts")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("viewCommonKeyboardShortcuts")}
        </p>
      </div>
      <div className="grid gap-4">
        {[
          { label: t("saveSnippet"), shortcut: "Ctrl + S" },
          { label: t("createNewSnippet"), shortcut: "Ctrl + N" },
          { label: t("toggleSidebar"), shortcut: "Ctrl + B" },
          { label: t("searchSnippets"), shortcut: "Ctrl + K" },
          { label: t("previewCode"), shortcut: "Ctrl + P" },
          { label: t("openSettings"), shortcut: "Ctrl + Comma" },
          { label: t("formatCode"), shortcut: "Ctrl + Shift + I" },
          { label: t("undo"), shortcut: "Ctrl + Z" },
          { label: t("redo"), shortcut: "Ctrl + Y" },
        ].map(({ label, shortcut }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <Label className="font-medium">{label}</Label>
            <code className="rounded bg-secondary px-2 py-1 text-sm">
              {shortcut}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyboardShortcutsSection;
