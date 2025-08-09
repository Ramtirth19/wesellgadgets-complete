import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccess('If an account with that email exists, a password reset link has been sent.');
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <div className="mb-6 flex items-center space-x-2">
          <Link to="/login" className="text-primary-600 hover:text-primary-500 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
        <p className="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        {error && (
          <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm mb-4">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-success-50 border border-success-200 rounded-lg text-success-700 text-sm mb-4">{success}</div>
        )}
        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Send Reset Link
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
