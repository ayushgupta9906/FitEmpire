import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, CheckCircle2, X, Users, ChevronRight, Check } from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  trainer: string;
  time: string;
  capacity: number;
  booked: number;
  room: string;
  members: Array<{ id: string; name: string; phone: string; attended: boolean }>;
}

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: '1',
      name: 'High-Intensity Crossfit',
      trainer: 'Coach Vikram',
      time: '06:30 PM',
      capacity: 20,
      booked: 18,
      room: 'Studio 1',
      members: [
        { id: 'm1', name: 'Rahul Sharma', phone: '+91 98800 72520', attended: true },
        { id: 'm2', name: 'Priya Patel', phone: '+91 98765 43210', attended: true },
        { id: 'm3', name: 'Amit Kumar', phone: '+91 94104 30095', attended: false },
        { id: 'm4', name: 'Sneha Verma', phone: '+91 94567 81234', attended: false },
      ],
    },
    {
      id: '2',
      name: 'Power Yoga & Core',
      trainer: 'Sarah Chen',
      time: '07:30 PM',
      capacity: 15,
      booked: 14,
      room: 'Studio 2',
      members: [
        { id: 'm5', name: 'Ananya Roy', phone: '+91 95432 19876', attended: true },
        { id: 'm6', name: 'Kavita Singh', phone: '+91 97654 32190', attended: false },
      ],
    },
    {
      id: '3',
      name: 'Zumba Cardio Blast',
      trainer: 'Pooja Hegde',
      time: '08:30 PM',
      capacity: 20,
      booked: 20,
      room: 'Studio 1',
      members: [
        { id: 'm7', name: 'Rohan Gupta', phone: '+91 96543 21987', attended: true },
        { id: 'm8', name: 'Deepak Joshi', phone: '+91 94321 98765', attended: true },
      ],
    },
    {
      id: '4',
      name: 'Olympic Weightlifting',
      trainer: 'Karan Mehra',
      time: '06:00 AM',
      capacity: 12,
      booked: 9,
      room: 'Iron Zone',
      members: [
        { id: 'm9', name: 'Vihaan Malhotra', phone: '+91 93210 98765', attended: false },
      ],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ClassItem | null>(null);

  const [name, setName] = useState('');
  const [trainer, setTrainer] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [room, setRoom] = useState('Studio 1');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !trainer || !time) return;
    const newClass: ClassItem = {
      id: String(Date.now()),
      name,
      trainer,
      time,
      capacity: Number(capacity) || 20,
      booked: 0,
      room,
      members: [],
    };
    setClasses([newClass, ...classes]);
    setModalOpen(false);
    setName('');
    setTrainer('');
    setTime('');
  };

  const toggleMemberAttended = (classId: string, memberId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          const updatedMembers = c.members.map((m) =>
            m.id === memberId ? { ...m, attended: !m.attended } : m
          );
          const updated = { ...c, members: updatedMembers };
          if (selectedBatch?.id === classId) {
            setSelectedBatch(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
            Class Schedules
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
            Workout batches, trainer roster & attendance
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
          style={{ padding: '6px 12px', fontSize: '0.72rem' }}
        >
          <Plus size={14} />
          <span>Add Batch</span>
        </button>
      </div>

      {/* Classes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {classes.map((c) => (
          <div
            key={c.id}
            className="glass-panel"
            style={{ padding: 14, cursor: 'pointer', transition: 'all 0.15s ease' }}
            onClick={() => setSelectedBatch(c)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
                  {c.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#A5B4FC', fontWeight: 600 }}>
                  Trainer: {c.trainer} • {c.room}
                </span>
              </div>

              <span
                className={c.booked >= c.capacity ? 'badge-purple' : 'badge-emerald'}
                style={{ fontSize: '0.62rem', padding: '2px 6px' }}
              >
                {c.booked >= c.capacity ? 'FULL' : `${c.capacity - c.booked} SLOTS LEFT`}
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 10,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} color="#38BDF8" />
                <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>
                  {c.time}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={12} color="#10B981" />
                <span style={{ fontSize: '0.72rem', color: '#FFF', fontWeight: 800 }}>
                  {c.booked}/{c.capacity} Members
                </span>
                <ChevronRight size={14} color="#64748B" style={{ marginLeft: 4 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Member Roster Modal */}
      {selectedBatch && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 100,
          }}
        >
          <div
            className="glass-panel animate-popin"
            style={{
              width: '100%',
              backgroundColor: '#0F172A',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: 18,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
                  {selectedBatch.name} Roster
                </span>
                <span style={{ fontSize: '0.7rem', color: '#38BDF8' }}>
                  {selectedBatch.time} • Trainer: {selectedBatch.trainer}
                </span>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: 8 }}>
              REGISTERED MEMBERS ({selectedBatch.members.length})
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
              {selectedBatch.members.map((m) => (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF', display: 'block' }}>
                      {m.name}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{m.phone}</span>
                  </div>

                  <button
                    onClick={() => toggleMemberAttended(selectedBatch.id, m.id)}
                    style={{
                      backgroundColor: m.attended ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      border: `1px solid ${m.attended ? '#10B981' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: 8,
                      padding: '4px 8px',
                      color: m.attended ? '#10B981' : '#94A3B8',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {m.attended ? <Check size={12} /> : null}
                    <span>{m.attended ? 'Attended' : 'Mark Present'}</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedBatch(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: 14, padding: '10px' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 100,
          }}
        >
          <div
            className="glass-panel animate-popin"
            style={{
              width: '100%',
              backgroundColor: '#0F172A',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF' }}>
                Add New Class Batch
              </span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Class Name</label>
                <input
                  type="text"
                  placeholder="e.g. Boxing Bootcamp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#1E293B',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#FFF',
                    fontSize: '0.8rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Trainer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Coach David"
                  value={trainer}
                  onChange={(e) => setTrainer(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#1E293B',
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
                  <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Time</label>
                  <input
                    type="text"
                    placeholder="07:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: '#1E293B',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: '#FFF',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1E293B',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: '#FFF',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
                Create Class
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
