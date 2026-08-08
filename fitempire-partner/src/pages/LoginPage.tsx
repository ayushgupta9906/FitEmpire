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
        height: '100vh',
        width: '100%',
        backgroundColor: '#0B0F19',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '28px 24px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                backgroundColor: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
                marginBottom: 16,
              }}
            >
              <Dumbbell color="#4F46E5" size={30} style={{ transform: 'scaleX(-1)', transformOrigin: 'center', display: 'inline-block' }} />
            </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
            FitEmpire Partner Portal
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>
              Partner Business Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(13, 20, 36, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 12,
                padding: '0 14px',
              }}
            >
              <Mail size={18} color="#64748B" style={{ marginRight: 10 }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@fitempire.in"
                style={{
                  width: '100%',
                  height: 46,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>
              Partner Portal Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(13, 20, 36, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 12,
                padding: '0 14px',
              }}
            >
              <Lock size={18} color="#64748B" style={{ marginRight: 10 }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: 46,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', height: 48, marginTop: 8 }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Gym Partner Desk</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Registered partner with FitEmpire? Contact admin if your account is locked.
          </div>
        </div>
    </div>
  );
};
