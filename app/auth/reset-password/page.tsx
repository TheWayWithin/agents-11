'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updatePassword } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validation states
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    // Validate password strength
    setValidations({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      passwordsMatch: password === confirmPassword && password.length > 0,
    });
  }, [password, confirmPassword]);

  const isValidPassword = Object.values(validations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPassword) {
      setError('Please ensure your password meets all requirements and both passwords match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updatePassword(password);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(result.error?.message || 'Failed to update password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Password Updated!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully updated. You'll be redirected to your dashboard shortly.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <div className="flex justify-center">
            <Lock className="h-12 w-12 text-orange-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* New Password */}
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Password requirements:</p>
              <div className="space-y-1">
                {Object.entries({
                  minLength: 'At least 8 characters',
                  hasUpper: 'One uppercase letter',
                  hasLower: 'One lowercase letter',
                  hasNumber: 'One number',
                  passwordsMatch: 'Passwords match',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <CheckCircle2 
                      className={`h-4 w-4 ${
                        validations[key as keyof typeof validations] 
                          ? 'text-green-500' 
                          : 'text-gray-300'
                      }`} 
                    />
                    <span 
                      className={`text-sm ${
                        validations[key as keyof typeof validations] 
                          ? 'text-green-700' 
                          : 'text-gray-500'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isValidPassword}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-orange-600 hover:text-orange-500"
            >
              Back to login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}