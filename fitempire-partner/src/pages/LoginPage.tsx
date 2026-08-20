import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { partnerApi } from '../api';
import { Dumbbell, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, RotateCcw } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid partner credentials. Please check your email and password.');
    }
  };

  const handleResetPassword = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter your partner email address above first.');
      return;
    }
    setResetting(true);
    setError(null);
    try {
      await partnerApi.resetPasswordByEmail(email.trim(), 'Password@123');
      setPassword('Password@123');
      setResetSuccess('Password reset to Password@123! You can now click Sign In.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Verify email address.');
    } finally {
      setResetting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('partner@fitempire.tech');
    setPassword('Partner@123');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#070B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Sleek Mobile Device Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100vh',
          maxHeight: '880px',
          backgroundColor: '#0B0F19',
          borderRadius: '36px',
          border: '10px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '28px 24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          onClick={() => navigate('/welcome')}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>

        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              backgroundColor: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
              <Dumbbell color="#4F46E5" size={28} />
            </div>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
            FitEmpire Partner App
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Gym Desk Management & Pass Verification
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            {email && (
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetting}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <RotateCcw size={12} />
                <span>{resetting ? 'Resetting...' : 'Click to Reset Password to "Password@123"'}</span>
              </button>
            )}
          </div>
        )}

        {resetSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10B981',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={16} />
            <span>{resetSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>
              Partner Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#161F30',
                borderRadius: 14,
                padding: '0 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Mail color="#64748B" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@fitempire.tech"
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '12px 10px',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8' }}>
                Password
              </label>
              <button
                type="button"
                onClick={handleResetPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38BDF8',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset Password?
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#161F30',
                borderRadius: 14,
                padding: '0 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Lock color="#64748B" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '12px 10px',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', padding: 4 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: 6,
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '13px',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Partner Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              padding: '7px 14px',
              color: '#A5B4FC',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⚡ Auto-fill Partner Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

