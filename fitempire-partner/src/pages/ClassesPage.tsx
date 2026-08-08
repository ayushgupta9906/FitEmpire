import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, CheckCircle2, X } from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState([
    { id: '1', name: 'High-Intensity Crossfit', trainer: 'Coach Vikram', time: '06:30 PM - 07:30 PM', capacity: 20, booked: 18, room: 'Studio 1' },
    { id: '2', name: 'Power Yoga & Core', trainer: 'Ananya Roy', time: '07:30 PM - 08:30 PM', capacity: 15, booked: 14, room: 'Mind & Body Studio' },
    { id: '3', name: 'Zumba Cardio Blast', trainer: 'Pooja Hegde', time: '08:30 PM - 09:30 PM', capacity: 20, booked: 20, room: 'Studio 2' },
    { id: '4', name: 'Olympic Weightlifting', trainer: 'Karan Mehra', time: '06:00 AM - 07:00 AM', capacity: 12, booked: 9, room: 'Main Iron Zone' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [trainer, setTrainer] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [room, setRoom] = useState('Studio 1');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !trainer || !time) return;
    const newClass = {
      id: String(Date.now()),
      name,
      trainer,
      time,
      capacity: Number(capacity) || 20,
      booked: 0,
      room,
    };
    setClasses([newClass, ...classes]);
    setModalOpen(false);
    setName('');
    setTrainer('');
    setTime('');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            Gym Classes & Schedule Management
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Manage daily group workout batches, certified instructors, and member capacity slots.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={18} />
          <span>Add New Class Slot</span>
        </button>
      </div>

      {/* Grid of Classes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {classes.map((c) => (
          <div key={c.id} className="glass-panel glass-panel-hover" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>{c.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: 2 }}>{c.room}</div>
              </div>
              <span className="badge-cyan">
                {c.booked} / {c.capacity} BOOKED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#CBD5E1' }}>
                <User size={15} color="#3B82F6" />
                <span>Trainer: <strong style={{ color: '#FFF' }}>{c.trainer}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#CBD5E1' }}>
                <Clock size={15} color="#10B981" />
                <span>Timing: <strong style={{ color: '#FFF' }}>{c.time}</strong></span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>
                <span>Occupancy</span>
                <span>{Math.round((c.booked / c.capacity) * 100)}%</span>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(c.booked / c.capacity) * 100}%`,
                    height: '100%',
                    background: c.booked >= c.capacity ? '#EF4444' : 'linear-gradient(90deg, #3B82F6, #10B981)',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }}
        >
          <div className="glass-panel" style={{ width: '100%', maxWidth: 500, padding: 32, position: 'relative' }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: 20 }}>
              Schedule New Class Slot
            </h2>

            <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                  Class Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HIIT Strength & Conditioning"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    height: 44,
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
                  Lead Instructor
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coach Siddharth"
                  value={trainer}
                  onChange={(e) => setTrainer(e.target.value)}
                  style={{
                    width: '100%',
                    height: 44,
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
                  Time Slot
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 05:30 PM - 06:30 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: 'rgba(13, 20, 36, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#FFF',
                    padding: '0 14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    style={{
                      width: '100%',
                      height: 44,
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
                    Studio / Room
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    style={{
                      width: '100%',
                      height: 44,
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

              <button type="submit" className="btn-primary" style={{ width: '100%', height: 46, marginTop: 10 }}>
                Publish Class Slot
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
