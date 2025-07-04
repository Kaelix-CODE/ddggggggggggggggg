import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { backupCodeSchema, type BackupCode } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerification } from "@/hooks/use-verification";

export function Verified5() {
  const { backupCodeMutation } = useVerification();
  
  const form = useForm<BackupCode>({
    resolver: zodResolver(backupCodeSchema),
    defaultValues: {
      backup_code: "",
    },
  });

  const onSubmit = (data: BackupCode) => {
    backupCodeMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md mx-auto animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Backup Code</h2>
          <p className="text-gray-600">Please enter your 8-digit backup code to complete verification.</p>
        </div>
        
        {/* Video Section */}
        <div className="mb-6">
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 100-5H9v5zm0 0v6m3-3h6m-6 3h6m6-6V9a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorial</h3>
            <p className="text-sm text-gray-600 mb-3">Watch this quick video to learn how to find your backup code</p>
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to play tutorial video</p>
          </div>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="backup_code" className="text-sm font-medium text-gray-700">
              8-Digit Backup Code
            </Label>
            <Input
              id="backup_code"
              {...form.register("backup_code")}
              placeholder="12345678"
              className="h-12 rounded-xl border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-center text-lg font-mono"
              maxLength={8}
            />
            {form.formState.errors.backup_code && (
              <p className="text-sm text-red-600">{form.formState.errors.backup_code.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-glow transform hover:scale-105"
            disabled={backupCodeMutation.isPending}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Complete Verification
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Can't find your backup code?{" "}
            <a href="#" className="text-blue-600 hover:underline">Get help</a>
          </p>
        </div>
      </div>
    </div>
  );
}
