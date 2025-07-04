import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ReactNode } from "react";

interface StepScreenProps {
  title: string;
  description: string;
  icon: ReactNode;
  nextStep: string;
  bgColor?: string;
  showProgress?: boolean;
  progressValue?: number;
}

export function StepScreen({ 
  title, 
  description, 
  icon, 
  nextStep, 
  bgColor = "bg-blue-600",
  showProgress = false,
  progressValue = 0
}: StepScreenProps) {
  const [, navigate] = useLocation();

  const handleContinue = () => {
    navigate(nextStep);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md mx-auto text-center animate-slide-up">
        <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000 progress-bar"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        )}
        
        <Button 
          onClick={handleContinue}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-glow"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
