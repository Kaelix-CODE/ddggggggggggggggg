import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useVerification() {
  const { toast } = useToast();
  
  const getVerificationId = () => {
    return sessionStorage.getItem("verificationId");
  };

  const progressMutation = useMutation({
    mutationFn: async ({ step }: { step: string }) => {
      const id = getVerificationId();
      if (!id) throw new Error("No verification ID found");
      
      const response = await apiRequest(`/api/verification/${id}/progress`, {
        method: "POST",
        body: JSON.stringify({ step }),
      });
      return response;
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to progress verification",
        variant: "destructive",
      });
    },
  });

  const backupCodeMutation = useMutation({
    mutationFn: async ({ backup_code }: { backup_code: string }) => {
      const id = getVerificationId();
      if (!id) throw new Error("No verification ID found");
      
      const response = await apiRequest(`/api/verification/${id}/backup-code`, {
        method: "POST",
        body: JSON.stringify({ backup_code }),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Verification Complete",
        description: "Your account has been successfully verified!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Backup Code",
        description: error.message || "Please check your backup code and try again.",
        variant: "destructive",
      });
    },
  });

  const verificationQuery = useQuery({
    queryKey: ["verification", getVerificationId()],
    queryFn: async () => {
      const id = getVerificationId();
      if (!id) throw new Error("No verification ID found");
      
      const response = await apiRequest(`/api/verification/${id}`);
      return response.submission;
    },
    enabled: !!getVerificationId(),
  });

  return {
    progressMutation,
    backupCodeMutation,
    verificationQuery,
    getVerificationId,
  };
}
