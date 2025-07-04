import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { VerificationSubmission, EmailReceiverList, emailReceiverSchema } from "@shared/schema";
import { Trash2, Users, CheckCircle, Clock, Mail, Plus } from "lucide-react";

export function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["/api/admin/submissions"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("/api/admin/submissions", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response;
    },
  });

  const { data: emailReceivers, isLoading: isLoadingReceivers } = useQuery({
    queryKey: ["/api/admin/email-receivers"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("/api/admin/email-receivers", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response;
    },
  });

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest(`/api/admin/submissions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Submission Deleted",
        description: "The verification submission has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete submission",
        variant: "destructive",
      });
    },
  });

  const addEmailReceiverMutation = useMutation({
    mutationFn: async (data: { email: string; name: string }) => {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest("/api/admin/email-receivers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Email Receiver Added",
        description: "The email receiver has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-receivers"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add email receiver.",
        variant: "destructive",
      });
    },
  });

  const deleteEmailReceiverMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("admin_token");
      const response = await apiRequest(`/api/admin/email-receivers/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Email Receiver Deleted",
        description: "The email receiver has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-receivers"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete email receiver.",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(emailReceiverSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmitEmail = (data: { email: string; name: string }) => {
    addEmailReceiverMutation.mutate(data);
    form.reset();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin-login");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      deleteSubmissionMutation.mutate(id);
    }
  };

  const handleDeleteReceiver = (id: string) => {
    if (window.confirm("Are you sure you want to delete this email receiver?")) {
      deleteEmailReceiverMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (step: string, completedAt?: string | Date) => {
    if (completedAt) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
    }
    if (step === "verified5") {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Final Step</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
  };

  if (isLoading || isLoadingReceivers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Facebook Verification Management</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {submissions?.submissions?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {submissions?.submissions?.filter((s: VerificationSubmission) => s.completed_at).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {submissions?.submissions?.filter((s: VerificationSubmission) => !s.completed_at).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Email Receivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {emailReceivers?.receivers?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Verification Submissions</CardTitle>
                <CardDescription>
                  All verification requests and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Profile URL</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Current Step</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions?.submissions?.map((submission: VerificationSubmission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                          <TableCell>{submission.full_name}</TableCell>
                          <TableCell>
                            <a 
                              href={submission.profile_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate block max-w-[200px]"
                            >
                              {submission.profile_url}
                            </a>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{submission.c_user}</TableCell>
                          <TableCell>{submission.current_step}</TableCell>
                          <TableCell>
                            {getStatusBadge(submission.current_step, submission.completed_at ? submission.completed_at.toString() : undefined)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(submission.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              disabled={deleteSubmissionMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {(!submissions?.submissions || submissions.submissions.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No verification submissions found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Email Management</CardTitle>
                <CardDescription>
                  Manage email receivers for notification alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Email Configuration</h3>
                    <p className="text-sm text-blue-700">
                      <strong>Sender:</strong> shdictator@gmail.com
                    </p>
                    <p className="text-sm text-blue-700">
                      Notifications will be sent to all email addresses below when new submissions are received or deleted.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Add New Email Receiver</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitEmail)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter receiver name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter email address" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button type="submit" disabled={addEmailReceiverMutation.isPending}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Receiver
                        </Button>
                      </form>
                    </Form>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Current Email Receivers</h3>
                    <div className="space-y-2">
                      {emailReceivers?.receivers?.map((receiver: EmailReceiverList) => (
                        <div key={receiver.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{receiver.name}</div>
                            <div className="text-sm text-gray-600">{receiver.email}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReceiver(receiver.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={deleteEmailReceiverMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!emailReceivers?.receivers || emailReceivers.receivers.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          No email receivers configured. Add one above to start receiving notifications.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}