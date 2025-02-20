import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

interface DependenciesSectionProps {
  packageJson: any;
  t: any;
}

const DependenciesSection: React.FC<DependenciesSectionProps> = ({
  packageJson,
  t,
}) => {
  const productionDependencies = packageJson.dependencies || {};
  const developmentDependencies = packageJson.devDependencies || {};

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t("dependencies")}</h3>
        <p className="text-sm text-muted-foreground">{t("librariesUsed")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label className="font-medium">{t("production")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("librariesBundled")}
            </p>
          </div>
          <code className="rounded px-3 py-1 text-sm font-semibold">
            {Object.keys(productionDependencies).length}
          </code>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label className="font-medium">{t("development")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("librariesUsedDevelopment")}
            </p>
          </div>
          <code className="rounded px-3 py-1 text-sm font-semibold">
            {Object.keys(developmentDependencies).length}
          </code>
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="production">
          <AccordionTrigger>{t("productionDependencies")}</AccordionTrigger>
          <AccordionContent className="max-h-96 overflow-auto">
            <div className="grid gap-4">
              {Object.entries(productionDependencies).map(([name, version]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <Label className="font-medium">
                    <a
                      className="text-blue-500 hover:underline"
                      href={`https://www.npmjs.com/package/${name}`}
                      target="_blank"
                    >
                      {name}
                    </a>
                  </Label>
                  <code className="rounded bg-secondary px-2 py-1 text-sm">
                    {String(version)}
                  </code>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="development">
          <AccordionTrigger>{t("developmentDependencies")}</AccordionTrigger>
          <AccordionContent className="max-h-96 overflow-auto">
            <div className="grid gap-4">
              {Object.entries(developmentDependencies).map(
                ([name, version]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <Label className="font-medium">
                      <a
                        className="text-blue-500 hover:underline"
                        href={`https://www.npmjs.com/package/${name}`}
                        target="_blank"
                      >
                        {name}
                      </a>
                    </Label>
                    <code className="rounded bg-secondary px-2 py-1 text-sm">
                      {String(version)}
                    </code>
                  </div>
                ),
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DependenciesSection;
