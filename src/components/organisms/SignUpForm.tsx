import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { Link } from '../atoms/Link';
import { FormField } from '../molecules/FormField';
import { authService } from '../../services/authService';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
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
      await authService.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });

      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'An error occurred during signup. Please try again.';
      
      if (error.message) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists';
        } else if (error.message.includes('password')) {
          errorMessage = error.message;
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
          Create Your Account
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
            label="Full Name"
            type="text"
            placeholder="Your name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
            required
          />
          
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
          
          <FormField 
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
          />
          
          <FormField 
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
          />

          <div>
            <Button 
              type="submit"
              variant="primary" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-7">
          <p className="text-base text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

