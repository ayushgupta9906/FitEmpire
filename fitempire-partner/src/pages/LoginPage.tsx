import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('partner@fitempire.in');
  const [password, setPassword] = useState('Partner@123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid partner credentials. Please check your email and password.');
    }
  };

  const handleFillDemo = () => {
    setEmail('partner@fitempire.in');
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
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
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
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
              <Dumbbell color="#4F46E5" size={28} />
            </div>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
            FitEmpire Partner App
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Gym Desk Management & Pass Verification
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>
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
                placeholder="partner@fitempire.in"
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '14px 10px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: 6 }}>
              Password
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
              <Lock color="#64748B" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '14px 10px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: 10,
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              fontSize: '0.95rem',
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
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              padding: '8px 16px',
              color: '#A5B4FC',
              fontSize: '0.78rem',
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
