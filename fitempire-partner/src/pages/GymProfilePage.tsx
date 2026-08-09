import React, { useState } from 'react';
import { Building, MapPin, Clock, Phone, Mail, CheckCircle2, Save, Sparkles } from 'lucide-react';

export const GymProfilePage: React.FC = () => {
  const [gymName, setGymName] = useState('Strike Force MMA & Fitness Hub');
  const [address, setAddress] = useState('80 Feet Road, Koramangala, Bangalore');
  const [operatingHours, setOperatingHours] = useState('06:00 AM – 10:00 PM');
  const [phone, setPhone] = useState('+91 98800 72520');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [amenities, setAmenities] = useState([
    { id: 'ac', name: 'Air Conditioning', active: true },
    { id: 'shower', name: 'Hot Showers & Changing', active: true },
    { id: 'locker', name: 'Digital Lockers', active: true },
    { id: 'sauna', name: 'Steam & Sauna', active: true },
    { id: 'weights', name: 'Olympic Free Weights', active: true },
    { id: 'cardio', name: 'Cardio Deck', active: true },
  ]);

  const toggleAmenity = (id: string) => {
    setAmenities(amenities.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
          Gym Center Profile
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
          Information visible to members in the FitEmpire app
        </p>
      </div>

      {savedSuccess && (
        <div
          className="animate-popin"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            borderRadius: 12,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10B981',
            color: '#10B981',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={16} />
          <span>Gym settings updated successfully!</span>
        </div>
      )}

      {/* Form Card */}
      <div className="glass-panel" style={{ padding: 14 }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Venue Name</label>
            <input
              type="text"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              style={{
                width: '100%',
                background: '#111B30',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '8px 10px',
                color: '#FFF',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Address / Area</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                background: '#111B30',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '8px 10px',
                color: '#FFF',
                fontSize: '0.8rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Timings</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                style={{
                  width: '100%',
                  background: '#111B30',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '8px 10px',
                  color: '#FFF',
                  fontSize: '0.8rem',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Desk Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  background: '#111B30',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '8px 10px',
                  color: '#FFF',
                  fontSize: '0.8rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 4 }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Center Amenities
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {amenities.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => toggleAmenity(a.id)}
                  style={{
                    backgroundColor: a.active ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${a.active ? '#4F46E5' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: 10,
                    padding: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: a.active ? '#FFF' : '#94A3B8', fontWeight: 600 }}>
                    {a.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: a.active ? '#10B981' : '#64748B' }}>
                    {a.active ? '✓' : '—'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 10 }}>
            <Save size={15} />
            <span>Save Profile Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
};
