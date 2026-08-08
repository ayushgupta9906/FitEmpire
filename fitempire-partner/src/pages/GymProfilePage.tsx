import React, { useState } from 'react';
import { Building, MapPin, Clock, Phone, Mail, CheckCircle2, Save, Sparkles } from 'lucide-react';

export const GymProfilePage: React.FC = () => {
  const [gymName, setGymName] = useState('FitEmpire Flagship Fitness Hub');
  const [address, setAddress] = useState('80 Feet Road, 5th Block, Koramangala, Bangalore, Karnataka 560095');
  const [operatingHours, setOperatingHours] = useState('06:00 AM – 10:00 PM (Mon-Sun)');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('partner@fitempire.in');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [amenities, setAmenities] = useState([
    { id: 'ac', name: 'Air Conditioning', active: true },
    { id: 'shower', name: 'Hot Showers & Changing Rooms', active: true },
    { id: 'locker', name: 'Secure Digital Lockers', active: true },
    { id: 'sauna', name: 'Steam Room & Sauna', active: true },
    { id: 'weights', name: 'Olympic Free Weights & Dumbbells', active: true },
    { id: 'cardio', name: 'Technogym Cardio Deck', active: true },
    { id: 'crossfit', name: 'CrossFit Rig & Turf Track', active: false },
    { id: 'juice', name: 'Protein Shake & Juice Bar', active: true },
  ]);

  const toggleAmenity = (id: string) => {
    setAmenities(amenities.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            Gym Profile & Operating Settings
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Information displayed to FitEmpire members on the mobile app gym finder.
          </p>
        </div>

        <button onClick={handleSave} className="btn-primary">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 18px',
            borderRadius: 12,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10B981',
            color: '#34D399',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={18} />
          <span>Gym Profile & Operating Facilities updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>
            Facility Information
          </h2>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
              Gym Commercial Name
            </label>
            <input
              type="text"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              style={{
                width: '100%',
                height: 46,
                borderRadius: 10,
                backgroundColor: 'rgba(13, 20, 36, 0.9)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#FFF',
                padding: '0 14px',
                outline: 'none',
                fontWeight: 600,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
              Location & Full Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                height: 46,
                borderRadius: 10,
                backgroundColor: 'rgba(13, 20, 36, 0.9)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#FFF',
                padding: '0 14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                Operating Timings
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 10,
                  backgroundColor: 'rgba(13, 20, 36, 0.9)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#FFF',
                  padding: '0 14px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                Front Desk Contact
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 10,
                  backgroundColor: 'rgba(13, 20, 36, 0.9)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#FFF',
                  padding: '0 14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div className="glass-panel" style={{ padding: 28 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', marginBottom: 6 }}>
            Gym Amenities & Equipment
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: 18 }}>
            Toggle features available at your gym facility for pass holders.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {amenities.map((a) => (
              <div
                key={a.id}
                onClick={() => toggleAmenity(a.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  backgroundColor: a.active ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: a.active ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: a.active ? '#3B82F6' : 'transparent',
                    border: a.active ? 'none' : '1px solid #64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {a.active && <CheckCircle2 size={14} color="#FFF" />}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: a.active ? 700 : 500, color: a.active ? '#FFF' : '#94A3B8' }}>
                  {a.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
