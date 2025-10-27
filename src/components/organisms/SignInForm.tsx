import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { Link } from '../atoms/Link';
import { Input } from '../atoms/Input';
import { FormField } from '../molecules/FormField';
import { authService } from '../../services/authService';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const SignInForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const formCardClasses = 'bg-gray-900/75 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10';

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
        general: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.signIn({
        email: formData.email,
        password: formData.password
      });

      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = 'An error occurred during sign in. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email before signing in';
        } else {
          errorMessage = error.message;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className={formCardClasses}>
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-3">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-gray-100">NEXXT Task</h1>
          <p className="text-base text-gray-400 mt-1">Seamless Teamwork. Inspired Productivity.</p>
        </div>

        {/* Form Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-100 mb-7">
          Access Your Account
        </h2>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField 
            label="Email"
            type="email"
            placeholder="email@example.com"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />
          
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="block text-sm font-medium text-gray-300">
                Password
                <span className="text-orange-500 ml-1">*</span>
              </label>
              <Link to="/forgot-password" className="text-sm">
                Forgot password?
              </Link>
            </div>
            <Input 
              type="password"
              placeholder="Your password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <Button 
              type="submit"
              variant="primary" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-7">
          <p className="text-base text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

