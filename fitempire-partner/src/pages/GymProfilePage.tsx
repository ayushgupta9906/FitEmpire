import React, { useState, useEffect, useRef } from 'react';
import {
  Building, MapPin, Clock, Phone, Mail, CheckCircle2, Save,
  Sparkles, Lock, IndianRupee, RefreshCw, Star, Users, Calendar,
  UploadCloud, Image, ShieldCheck, Zap
} from 'lucide-react';
import { partnerApi } from '../api';

const AMENITY_LABELS: Record<string, string> = {
  AC: 'Air Conditioning', PARKING: 'Free Parking', SHOWERS: 'Hot Showers',
  LOCKERS: 'Digital Lockers', SAUNA: 'Sauna / Steam', WIFI: 'Free Wi-Fi',
  POOL: 'Swimming Pool', CAFE: 'Café / Juice Bar', PERSONAL_TRAINING: 'Personal Training',
  DIET_CONSULTATION: 'Diet Consultation', CHANGING_ROOM: 'Changing Rooms',
  SUPPLEMENTS: 'Supplement Store',
};

const DAY_SHORT: Record<string, string> = {
  MON: 'M', TUE: 'T', WED: 'W', THU: 'Th', FRI: 'F', SAT: 'Sa', SUN: 'Su',
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: '#111B30',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '9px 11px',
  color: '#FFF',
  fontSize: '0.8rem',
  fontWeight: 600,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.68rem',
  color: '#64748B',
  fontWeight: 700,
  display: 'block',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const GymProfilePage: React.FC = () => {
  const [gymData, setGymData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable state
  const [gymName, setGymName] = useState('');
  const [openingTime, setOpeningTime] = useState('05:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [phone, setPhone] = useState('');
  const [gymEmail, setGymEmail] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('2000');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [workingDays, setWorkingDays] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGymData();
  }, []);

  const fetchGymData = async () => {
    setLoading(true);
    try {
      const res = await partnerApi.getGymDetails();
      const gymsData = res.data?.data;
      const gym = Array.isArray(gymsData) ? gymsData[0] : gymsData?.content?.[0] || gymsData;
      if (gym) {
        setGymData(gym);
        setGymName(gym.name || '');
        setPhone(gym.phone || gym.branches?.[0]?.phone || '');
        setGymEmail(gym.email || gym.branches?.[0]?.email || '');
        setCoverImg(gym.coverImageUrl || '');
        const branch = gym.branches?.[0];
        if (branch) {
          setOpeningTime(branch.openingTime?.substring(0, 5) || '05:00');
          setClosingTime(branch.closingTime?.substring(0, 5) || '22:00');
          setAmenities(branch.amenities || []);
          setWorkingDays(branch.workingDays || []);
          if (branch.monthlyMembershipPrice) {
            setMonthlyPrice(String(branch.monthlyMembershipPrice));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load gym data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await partnerApi.uploadPhoto(file);
      if (res.data?.data?.url) {
        setCoverImg(res.data.data.url);
      }
    } catch (err) {
      console.error('Cover upload error:', err);
    } finally {
      setUploadingCover(false);
    }
  };

  const toggleAmenity = (a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const toggleDay = (d: string) => {
    setWorkingDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSavedSuccess(true);
    setSaving(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid #4F46E5', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Loading gym profile...</span>
      </div>
    );
  }

  const branch = gymData?.branches?.[0];
  const perVisitRate = ((parseFloat(monthlyPrice) || 0) / 30).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>Gym Center Profile</h1>
        <p style={{ color: '#64748B', fontSize: '0.72rem', margin: '2px 0 0' }}>
          Manage your center listing, pricing settlement & operating hours
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10B981', color: '#10B981', fontSize: '0.78rem', fontWeight: 700,
        }}>
          <CheckCircle2 size={15} />
          <span>Profile saved successfully!</span>
        </div>
      )}

      {/* Cover Image Banner with Direct Upload */}
      <div style={{
        borderRadius: 14, overflow: 'hidden', height: 130, position: 'relative',
        background: '#111B30', border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {coverImg ? (
          <img src={coverImg} alt="Gym cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
            <Image size={28} />
            <span style={{ fontSize: '0.75rem', marginTop: 4 }}>No Cover Photo Uploaded</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingCover}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8, padding: '6px 10px', color: '#FFF',
            fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          {uploadingCover ? <RefreshCw size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <UploadCloud size={12} />}
          {uploadingCover ? 'Uploading...' : 'Change Photo'}
        </button>

        <div style={{
          position: 'absolute', bottom: 8, left: 10,
          background: 'rgba(0,0,0,0.65)', borderRadius: 8, padding: '4px 10px',
        }}>
          <span style={{ color: '#FFF', fontSize: '0.75rem', fontWeight: 800 }}>{gymName || 'My Center'}</span>
        </div>
      </div>

      {/* Dynamic Payout Settlement Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderRadius: 12, padding: 12, border: '1px solid rgba(245, 158, 11, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} color="#F59E0B" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Your Payout Settlement Rate
            </span>
          </div>
          <span style={{ fontSize: '0.62rem', background: '#10B981', color: '#FFF', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
            AUTOMATIC
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981' }}>₹{perVisitRate}</span>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>/ scan visit (₹{monthlyPrice} ÷ 30 days)</span>
        </div>

        <span style={{ fontSize: '0.68rem', color: '#CBD5E1', lineHeight: 1.4, display: 'block' }}>
          💡 Whenever a FitEmpire member checks into your gym via QR scan, <strong>₹{perVisitRate}</strong> is credited to your wallet in real-time.
        </span>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Basic Info & Pricing */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Building size={14} color="#6C63FF" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Center Details</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <label style={labelStyle}>Venue Name</label>
              <input type="text" value={gymName} onChange={e => setGymName(e.target.value)} style={fieldStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={labelStyle}>Monthly Membership (₹)</label>
                <input type="number" value={monthlyPrice} onChange={e => setMonthlyPrice(e.target.value)} style={fieldStyle} placeholder="2000" />
              </div>
              <div>
                <label style={labelStyle}>Desk Phone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={fieldStyle} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Contact Email</label>
              <input type="email" value={gymEmail} onChange={e => setGymEmail(e.target.value)} style={fieldStyle} placeholder="info@gym.com" />
            </div>
          </div>
        </div>

        {/* Address */}
        {branch && (
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <MapPin size={14} color="#FFB038" />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Location</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.5 }}>
              <div>{branch.addressLine1}</div>
              {branch.addressLine2 && <div>{branch.addressLine2}</div>}
              <div>{branch.city}, {branch.state} {branch.pincode}</div>
            </div>
          </div>
        )}

        {/* Timings */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Clock size={14} color="#38BDF8" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#BAE6FD', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Operating Hours</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            <div>
              <label style={labelStyle}>Opens</label>
              <input type="time" value={openingTime} onChange={e => setOpeningTime(e.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Closes</label>
              <input type="time" value={closingTime} onChange={e => setClosingTime(e.target.value)} style={fieldStyle} />
            </div>
          </div>

          <label style={labelStyle}>Working Days</label>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(day => (
              <button key={day} type="button" onClick={() => toggleDay(day)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  backgroundColor: workingDays.includes(day) ? '#4F46E5' : 'rgba(255,255,255,0.07)',
                  color: workingDays.includes(day) ? '#FFF' : '#64748B',
                  fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {DAY_SHORT[day]}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Sparkles size={14} color="#A78BFA" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amenities</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {Object.entries(AMENITY_LABELS).map(([key, label]) => (
              <button key={key} type="button" onClick={() => toggleAmenity(key)}
                style={{
                  background: amenities.includes(key) ? 'rgba(79,70,229,0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${amenities.includes(key) ? '#4F46E5' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 8, padding: '6px 8px', textAlign: 'left', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                <span style={{ fontSize: '0.68rem', color: amenities.includes(key) ? '#FFF' : '#94A3B8', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '0.65rem', color: amenities.includes(key) ? '#10B981' : '#334155' }}>
                  {amenities.includes(key) ? '✓' : '—'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: '#FFF', border: 'none', borderRadius: 12, padding: '12px',
            fontSize: '0.85rem', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: saving ? 0.7 : 1,
          }}>
          {saving ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</> : <><Save size={14} /> Save Profile</>}
        </button>
      </form>
    </div>
  );
};
