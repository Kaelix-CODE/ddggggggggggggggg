import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { StepScreen } from "@/components/step-screen";
import { Progress } from "@/components/ui/progress";

export function Delay1() {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(30);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/verified4");
          return 0;
        }
        return prev - 1;
      });
      setProgress((prev) => prev + (100 / 30));
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Verification</h2>
            <p className="text-gray-600 mb-6">Please wait while we verify your information</p>
            
            <div className="space-y-4">
              <div className="text-3xl font-bold text-blue-600">
                {countdown}s
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500">
                Verification in progress... Please do not close this page
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Verification Center</h4>
                <p className="text-xs text-gray-600 mt-1">We're analyzing your account details and cross-referencing with our database for security verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
