import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="container p-4">
        <div className="flex flex-col items-start gap-4 w-full max-w-xl">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="w-full">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Account</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings.
                </p>
                <Button variant="outline" disabled>
                  Change Email
                </Button>
                <Button variant="outline" disabled>
                  Change Password
                </Button>
              </div>
              <div>
                <h2 className="text-lg font-medium">Preferences</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your experience.
                </p>
                <Button variant="outline" disabled>
                  Theme: System
                </Button>
              </div>
              <div>
                <h2 className="text-lg font-medium">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your notification settings.
                </p>
                <Button variant="outline" disabled>
                  Enable Notifications (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
