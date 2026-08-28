import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Smartphone, 
  QrCode, 
  Building2, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Send,
  Zap
} from 'lucide-react';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingModalProps {
  gym: any | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutModalProps {
  plan: any | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CorporateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. APP DOWNLOAD / EXPO GO MODAL
export const AppDownloadModal: React.FC<AppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-bg">
      <div className="modal-box-card executive-card">
        <button className="modal-dismiss-btn" onClick={onClose}><X size={18} /></button>

        <div className="modal-header-centered">
          <div className="badge-pill-purple">
            <Smartphone size={13} className="text-purple" />
            <span>FITEMPIRE MOBILE ECOSYSTEM</span>
          </div>
          <h3 className="modal-heading">Open FitEmpire App</h3>
          <p className="modal-subheading">
            Experience the Member Pass & Partner Reception Scanner on your phone or browser.
          </p>
        </div>

        <div className="modal-dual-cards">
          {/* Member App */}
          <div className="modal-app-tile">
            <div className="app-tile-badge member">1. MEMBER PASS APP</div>
            <h4>FitEmpire Member</h4>
            <p>Dynamic 60s QR passes, AI workout splits & 12,000+ gyms.</p>

            <div className="qr-preview-box">
              <QrCode size={105} color="#0F172A" />
              <div className="qr-box-caption">Scan in Expo Go</div>
            </div>

            <a href="http://localhost:8081" target="_blank" rel="noreferrer" className="btn-purple-primary w-full">
              <span>Open Member Web App</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Partner Scanner */}
          <div className="modal-app-tile">
            <div className="app-tile-badge partner">2. PARTNER SCANNER APP</div>
            <h4>Partner Reception</h4>
            <p>0.2s turnstile camera validation & automated weekly payouts.</p>

            <div className="qr-preview-box">
              <QrCode size={105} color="#0F172A" />
              <div className="qr-box-caption">Gym Manager Gate</div>
            </div>

            <a href="http://localhost:3001" target="_blank" rel="noreferrer" className="btn-purple-secondary w-full">
              <span>Open Partner Portal</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="modal-bottom-trust-note">
          <ShieldCheck size={14} color="#059669" />
          <span>Compatible with all iOS & Android devices via Expo Go or Mobile Web</span>
        </div>
      </div>

      <style>{modalStyles}</style>
    </div>
  );
};

// 2. GYM WORKOUT BOOKING MODAL
export const BookingModal: React.FC<BookingModalProps> = ({ gym, isOpen, onClose }) => {
  const [slotTime, setSlotTime] = useState('07:00 AM - 08:30 AM');
  const [booked, setBooked] = useState(false);

  if (!isOpen || !gym) return null;

  return (
    <div className="modal-overlay-bg">
      <div className="modal-box-card executive-card">
        <button className="modal-dismiss-btn" onClick={onClose}><X size={18} /></button>

        {!booked ? (
          <div>
            <div className="modal-header-centered">
              <div className="badge-pill-purple">
                <Zap size={13} className="text-purple" />
                <span>INSTANT WORKOUT RESERVATION</span>
              </div>
              <h3 className="modal-heading">Book Workout Slot</h3>
              <p className="modal-subheading">{gym.name} • {gym.area}</p>
            </div>

            <div className="slot-picker-group">
              <label className="slot-picker-label">Select Preferred Workout Time Slot:</label>
              <div className="slot-chips-list">
                {['06:00 AM - 07:30 AM', '07:30 AM - 09:00 AM', '12:00 PM - 01:30 PM (Off-Peak)', '06:00 PM - 07:30 PM', '08:00 PM - 09:30 PM'].map((slot) => (
                  <button 
                    key={slot} 
                    className={`slot-chip-btn ${slotTime === slot ? 'active' : ''}`}
                    onClick={() => setSlotTime(slot)}
                  >
                    <Clock size={13} />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="reservation-summary-card">
              <div className="res-row">
                <span>Facility Access:</span>
                <strong>{gym.popularFor}</strong>
              </div>
              <div className="res-row">
                <span>Check-in Method:</span>
                <span className="text-purple font-bold">Dynamic 60s QR Token</span>
              </div>
              <div className="res-row">
                <span>Pass Cost:</span>
                <strong className="text-emerald font-bold">Included in FitEmpire Pass (₹0)</strong>
              </div>
            </div>

            <button className="btn-purple-primary w-full" onClick={() => setBooked(true)}>
              <span>Confirm Workout Slot</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="modal-success-content">
            <div className="success-icon-shield">
              <CheckCircle2 size={44} color="#059669" />
            </div>
            <h3 className="modal-heading">Workout Slot Confirmed!</h3>
            <p className="modal-subheading">Your pass for <strong>{gym.name}</strong> on {slotTime} has been generated.</p>
            
            <div className="pass-token-badge">
              TOKEN: EMP-BOOK-{Math.floor(1000 + Math.random() * 9000)}
            </div>
            
            <p className="pass-instructions-text">
              Simply show this token or open the FitEmpire app at reception for turnstile entry.
            </p>
            
            <button className="btn-purple-primary w-full" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>

      <style>{modalStyles}</style>
    </div>
  );
};

// 3. PLAN CHECKOUT MODAL
export const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  if (!isOpen || !plan) return null;

  return (
    <div className="modal-overlay-bg">
      <div className="modal-box-card executive-card">
        <button className="modal-dismiss-btn" onClick={onClose}><X size={18} /></button>

        {step === 1 ? (
          <div>
            <div className="modal-header-centered">
              <div className="badge-pill-purple">
                <CreditCard size={13} className="text-purple" />
                <span>INSTANT PASS ACTIVATION</span>
              </div>
              <h3 className="modal-heading">{plan.name}</h3>
              <p className="modal-subheading">{plan.tagline}</p>
            </div>

            <div className="reservation-summary-card">
              <div className="res-row">
                <span>Tenure Duration:</span>
                <strong>{plan.tenure === '1m' ? '1 Month' : plan.tenure === '3m' ? '3 Months' : plan.tenure === '6m' ? '6 Months' : '12 Months'}</strong>
              </div>
              <div className="res-row">
                <span>Monthly Rate:</span>
                <strong>₹{plan.rawMonthly.toLocaleString('en-IN')}/mo</strong>
              </div>
              <div className="res-row total">
                <span>Total Payable Amount (incl. GST):</span>
                <span className="total-digits">₹{plan.totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="checkout-inputs-group">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="modal-form-input" 
                required
              />
              <input 
                type="tel" 
                placeholder="Mobile Number (+91)" 
                value={userPhone} 
                onChange={(e) => setUserPhone(e.target.value)} 
                className="modal-form-input" 
                required
              />
            </div>

            <button className="btn-purple-primary w-full" onClick={() => setStep(2)}>
              <span>Proceed to Razorpay / UPI (₹{plan.totalCost.toLocaleString('en-IN')})</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="modal-success-content">
            <div className="success-icon-shield">
              <Sparkles size={44} color="#7C3AED" />
            </div>
            <h3 className="modal-heading">Membership Activated!</h3>
            <p className="modal-subheading">Welcome to FitEmpire, <strong>{userName || 'Champion'}</strong>!</p>
            <p className="pass-instructions-text" style={{ marginBottom: 20 }}>
              Your universal access pass for 12,000+ gyms is now live on mobile number <strong>{userPhone || '+91-9876543210'}</strong>.
            </p>
            <a href="http://localhost:8081" target="_blank" rel="noreferrer" className="btn-purple-primary w-full">
              <span>Open FitEmpire App & View Pass</span>
              <ArrowRight size={14} />
            </a>
          </div>
        )}
      </div>

      <style>{modalStyles}</style>
    </div>
  );
};

// 4. PARTNER ONBOARDING MODAL
export const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-bg">
      <div className="modal-box-card executive-card">
        <button className="modal-dismiss-btn" onClick={onClose}><X size={18} /></button>

        {!submitted ? (
          <div>
            <div className="modal-header-centered">
              <div className="badge-pill-purple">
                <Building2 size={13} className="text-purple" />
                <span>ZERO ONBOARDING FEES</span>
              </div>
              <h3 className="modal-heading">Partner Your Gym</h3>
              <p className="modal-subheading">Start receiving verified FitEmpire members and weekly payouts.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="partner-modal-form">
              <input type="text" placeholder="Gym / Fitness Studio Name" required className="modal-form-input" />
              <div className="form-grid-2">
                <input type="text" placeholder="City (e.g. Bengaluru)" required className="modal-form-input" />
                <input type="text" placeholder="Locality / Area" required className="modal-form-input" />
              </div>
              <div className="form-grid-2">
                <input type="text" placeholder="Owner / Manager Name" required className="modal-form-input" />
                <input type="tel" placeholder="Mobile Number (+91)" required className="modal-form-input" />
              </div>
              <input type="number" placeholder="Estimated Daily Peak Capacity (e.g. 100)" className="modal-form-input" />

              <button type="submit" className="btn-purple-primary w-full">
                <Send size={15} />
                <span>Submit Partner Application</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-success-content">
            <div className="success-icon-shield">
              <CheckCircle2 size={44} color="#059669" />
            </div>
            <h3 className="modal-heading">Application Received!</h3>
            <p className="modal-subheading">Our City Gym Partner Manager will call you within 24 hours to setup your turnstile scanner and verify your listing.</p>
            <button className="btn-purple-primary w-full" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>

      <style>{modalStyles}</style>
    </div>
  );
};

// 5. CORPORATE INQUIRY MODAL
export const CorporateModal: React.FC<CorporateModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-bg">
      <div className="modal-box-card executive-card">
        <button className="modal-dismiss-btn" onClick={onClose}><X size={18} /></button>

        {!submitted ? (
          <div>
            <div className="modal-header-centered">
              <div className="badge-pill-purple">
                <Building2 size={13} className="text-purple" />
                <span>FITEMPIRE CORPORATE WELLNESS</span>
              </div>
              <h3 className="modal-heading">Request Corporate Proposal</h3>
              <p className="modal-subheading">Tailored employee fitness packages with volume corporate pricing.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="partner-modal-form">
              <input type="text" placeholder="Company / Organization Name" required className="modal-form-input" />
              <div className="form-grid-2">
                <input type="email" placeholder="Official Corporate Email" required className="modal-form-input" />
                <input type="tel" placeholder="Contact Number (+91)" required className="modal-form-input" />
              </div>
              <input type="number" placeholder="Approx. Number of Employees (e.g. 250)" required className="modal-form-input" />

              <button type="submit" className="btn-purple-primary w-full">
                <span>Request Custom Proposal & Deck</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-success-content">
            <div className="success-icon-shield">
              <CheckCircle2 size={44} color="#059669" />
            </div>
            <h3 className="modal-heading">Proposal Requested!</h3>
            <p className="modal-subheading">Our Corporate Wellness Consultant will share the customized proposal and HR dashboard demo with your team today.</p>
            <button className="btn-purple-primary w-full" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>

      <style>{modalStyles}</style>
    </div>
  );
};

const modalStyles = `
  .modal-overlay-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: modalFadeIn 0.2s ease-out;
  }
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
  }
  .modal-box-card {
    width: 100%;
    max-width: 580px;
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    padding: 34px;
    position: relative;
    box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
    border: 1px solid var(--purple-border);
  }
  .modal-dismiss-btn {
    position: absolute;
    top: 18px;
    right: 18px;
    background: #F1F5F9;
    border: none;
    color: #64748B;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-smooth);
  }
  .modal-dismiss-btn:hover {
    color: #0F172A;
    background: var(--purple-light);
  }
  .modal-header-centered {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 22px;
  }
  .modal-heading {
    font-size: 24px;
    font-weight: 900;
    color: #0F172A;
    margin: 10px 0 4px;
  }
  .modal-subheading {
    font-size: 13px;
    color: #64748B;
  }
  .modal-dual-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 22px;
  }
  .modal-app-tile {
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .app-tile-badge {
    font-size: 9px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    margin-bottom: 6px;
  }
  .app-tile-badge.member {
    background: var(--purple-light);
    color: var(--purple-primary);
  }
  .app-tile-badge.partner {
    background: #EDE9FE;
    color: var(--indigo-primary);
  }
  .modal-app-tile h4 {
    font-size: 14px;
    font-weight: 800;
    color: #0F172A;
  }
  .modal-app-tile p {
    font-size: 11px;
    color: #64748B;
    margin: 4px 0 12px;
    min-height: 32px;
  }
  .qr-preview-box {
    background: #FFFFFF;
    padding: 8px;
    border: 1px solid var(--border-light);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 12px;
  }
  .qr-box-caption {
    font-size: 9px;
    color: #0F172A;
    font-weight: 700;
    margin-top: 4px;
  }
  .modal-bottom-trust-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    color: #64748B;
    text-align: center;
  }
  .modal-form-input {
    width: 100%;
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    padding: 11px 14px;
    border-radius: var(--radius-sm);
    color: #0F172A;
    font-size: 13.5px;
    outline: none;
    margin-bottom: 10px;
    font-family: inherit;
  }
  .modal-form-input:focus {
    border-color: var(--purple-primary);
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
  .partner-modal-form, .checkout-inputs-group {
    margin-bottom: 18px;
  }
  .form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .slot-picker-group {
    margin-bottom: 18px;
  }
  .slot-picker-label {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    display: block;
    margin-bottom: 8px;
  }
  .slot-chips-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .slot-chip-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-sm);
    color: #334155;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: all var(--transition-smooth);
  }
  .slot-chip-btn.active {
    background: var(--purple-light);
    border-color: var(--purple-primary);
    color: var(--purple-primary);
    font-weight: 700;
  }
  .reservation-summary-card {
    background: #F8FAFC;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 14px;
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .res-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #475569;
  }
  .res-row.total {
    border-top: 1px solid var(--border-light);
    padding-top: 8px;
    font-size: 13px;
    color: #0F172A;
    font-weight: 700;
  }
  .total-digits {
    font-family: var(--font-heading);
    font-size: 19px;
    font-weight: 900;
    color: var(--purple-primary);
  }
  .modal-success-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
  }
  .success-icon-shield {
    margin-bottom: 12px;
  }
  .pass-token-badge {
    font-family: monospace;
    font-size: 15px;
    font-weight: 800;
    background: #DCFCE7;
    border: 1px solid #10B981;
    color: #059669;
    padding: 6px 16px;
    border-radius: var(--radius-full);
    margin-bottom: 14px;
  }
  .pass-instructions-text {
    font-size: 11.5px;
    color: #64748B;
  }

  @media (max-width: 600px) {
    .modal-dual-cards, .form-grid-2 {
      grid-template-columns: 1fr;
    }
  }
`;
