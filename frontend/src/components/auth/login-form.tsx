"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useToast } from "@/components/ui/use-toast";
import { authService, type LoginCredentials } from "@/lib/api/auth";
import { useCallback, useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
type ApiError = Error & {
  status?: number;
  message: string;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (isPending) return;

      try {
        await authService.login(values as LoginCredentials);

        toast({
          title: "Login successful",
          description: "Redirecting to your dashboard...",
        });

        // Use startTransition for navigation to prevent UI blocking
        startTransition(() => {
          router.push("/chat");
          router.refresh(); // Ensure client-side cache is updated
        });
      } catch (error: unknown) {
        const defaultError =
          "An error occurred during login. Please try again.";
        let errorMessage = defaultError;

        if (error && typeof error === "object") {
          const apiError = error as ApiError;

          if (apiError.status === 401) {
            form.setError("password", {
              message: "Invalid email or password",
              type: "manual",
            });
            form.setError("email", {
              type: "manual",
              message: " ", // Empty message to show error state without duplicate message
            });
            errorMessage = "Invalid email or password";
          } else if (apiError.status === 429) {
            errorMessage = "Too many login attempts. Please try again later.";
          } else if (apiError.message) {
            errorMessage = apiError.message;
          }
        }

        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    },
    [isPending, router, toast, form]
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          aria-label="Login form"
          noValidate
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isPending}
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby={
                        form.formState.errors.email ? "email-error" : undefined
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="email-error" role="alert" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                      tabIndex={-1}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        disabled={isPending}
                        className="pr-10"
                        aria-invalid={!!form.formState.errors.password}
                        aria-describedby={
                          form.formState.errors.password
                            ? "password-error"
                            : undefined
                        }
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm p-1"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage id="password-error" role="alert" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !form.formState.isDirty}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
              tabIndex={-1}
            >
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
