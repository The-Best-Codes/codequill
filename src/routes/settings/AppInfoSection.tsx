import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AppInfoSectionProps {
  packageJson: any;
  APP_VERSION: string;
  t: any;
}

const AppInfoSection: React.FC<AppInfoSectionProps> = ({
  packageJson,
  APP_VERSION,
  t,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t("appInfo")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("informationAboutCodeQuill")}
        </p>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border p-6 space-y-4">
          <div>
            <h4 className="text-xl font-semibold">{packageJson.name}</h4>
            <p className="text-sm text-muted-foreground">
              {packageJson.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label className="font-medium">{t("version")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("installedVersion")}
              </p>
            </div>
            <code className="rounded px-3 py-1 text-sm font-semibold">
              {APP_VERSION}
            </code>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label className="font-medium">{t("license")}</Label>
              <p className="text-sm text-muted-foreground">{t("openSource")}</p>
            </div>
            <code className="rounded px-3 py-1 text-sm font-semibold">
              {packageJson.license}
            </code>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">{t("createdBy")}</Label>
              <p className="text-sm text-muted-foreground">
                {packageJson.author.name}
              </p>
            </div>
            <a
              href={packageJson.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {t("website")}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="w-full" asChild>
            <a
              href={packageJson.repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full"
            >
              {t("sourceCode")}
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a
              href="https://github.com/The-Best-Codes/codequill/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full"
            >
              {t("reportIssue")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppInfoSection;
