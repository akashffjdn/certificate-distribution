import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    idCard: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.idCard, formData.password);
    } catch (error) {
      // Error is already handled in context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Certificate Management
              </h1>
              <p className="text-sm text-gray-500">College Competition Portal</p>
            </div>
          </div>
          <p className="text-gray-600">
            Sign in to access your certificates and competitions
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-2">
                ID Card Number
              </label>
              <input
                type="text"
                id="idCard"
                name="idCard"
                required
                value={formData.idCard}
                onChange={handleChange}
                placeholder="Enter your ID card number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">Demo credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-700">Staff Login:</p>
                <p className="text-gray-600">ID: ST001 | Password: password</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-700">Student Login:</p>
                <p className="text-gray-600">ID: CS2101 | Password: password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}