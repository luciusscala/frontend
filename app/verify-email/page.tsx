"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setIsVerified(true);
      }
    };

    checkVerification();
  }, [supabase.auth]);

  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: (await supabase.auth.getUser()).data.user?.email || "",
      });

      if (error) throw error;

      setError("Verification email sent! Please check your inbox.");
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            Please check your email for a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant={error.includes("sent") ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center p-4">
            <Mail className="h-12 w-12 text-muted-foreground" />
          </div>

          <p className="text-sm text-muted-foreground text-center">
            We've sent a verification email to your address. Please click the link in the email to verify your account.
          </p>

          <Button
            className="w-full"
            onClick={handleResendVerification}
            disabled={isVerified}
          >
            Resend Verification Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 