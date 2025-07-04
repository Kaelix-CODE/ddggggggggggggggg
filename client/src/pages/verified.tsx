import { StepScreen } from "@/components/step-screen";

export function Verified() {
  return (
    <StepScreen
      title="Identity Verified"
      description="Your identity has been successfully verified. Proceeding to security verification."
      icon={
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      nextStep="/delay1"
      bgColor="bg-green-500"
    />
  );
}
