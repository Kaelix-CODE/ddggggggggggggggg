interface ProgressIndicatorProps {
  currentPath: string;
}

export function ProgressIndicator({ currentPath }: ProgressIndicatorProps) {
  const steps = [
    { path: "/", label: "Form" },
    { path: "/help", label: "Help" },
    { path: "/verified", label: "Identity" },
    { path: "/delay1", label: "Processing" },
    { path: "/verified2", label: "Security" },
    { path: "/delay2", label: "Finalizing" },
    { path: "/verified3", label: "Config" },
    { path: "/verified4", label: "Final" },
    { path: "/password-verify", label: "Password" },
    { path: "/verified5", label: "Complete" }
  ];

  const currentStepIndex = steps.findIndex(step => step.path === currentPath);
  const currentStep = currentStepIndex !== -1 ? currentStepIndex : 0;

  return (
    <div className="hidden md:flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-2">
        Step {currentStep + 1} of {steps.length}
      </span>
    </div>
  );
}
