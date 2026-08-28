import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'What is the FitEmpire Universal Pass and how does it work?',
    a: 'FitEmpire gives you flexible access to 12,000+ top gyms and fitness studios across India through a single subscription. Once you activate a pass, open the FitEmpire app, pick any partner gym (e.g., Gold’s, Cult.fit, Anytime Fitness, local CrossFit boxes), show your 60-second dynamic QR code at the reception turnstile, and start working out.'
  },
  {
    q: 'How does the 60-Second Dynamic QR code guarantee security?',
    a: 'To eliminate pass sharing, fraud, and the need for physical plastic cards, the FitEmpire app generates a military-grade encrypted dynamic QR pass that automatically regenerates every 60 seconds. Gym receptionists verify your pass instantly via our Partner Scanner in under 0.2 seconds.'
  },
  {
    q: 'What is FITFEAST dedicated nutrition support?',
    a: 'FITFEAST pairs you with a certified clinical nutritionist on WhatsApp. You receive personalized Indian macro meal plans, grocery guides, and real-time consultation whether your goal is fat loss, lean muscle gain, or athletic endurance.'
  },
  {
    q: 'What is ARIA AI Coach?',
    a: 'ARIA is our proprietary AI workout coach. It continuously analyzes your training volume, heart rate zones, and muscle recovery fatigue to build custom periodized workout circuits for your gym sessions.'
  },
  {
    q: 'How does the 1-Tap Pass Freeze guarantee work?',
    a: 'If you are traveling, busy at work, or feeling under the weather, you can pause your membership directly in the app for up to 30 days. Your validity is extended with zero loss of days and zero hidden fees.'
  },
  {
    q: 'What payment options are supported?',
    a: 'We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, Net Banking, and zero-cost EMI plans powered securely by Razorpay.'
  }
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="faq-purple-section">
      <div className="container">
        
        <div className="faq-header-center">
          <div className="badge-pill-purple">
            <HelpCircle size={13} className="text-purple" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="faq-title">
            Got Questions? <span className="text-purple-gradient">We’ve Got Answers</span>
          </h2>
        </div>

        <div className="faq-accordion-container">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div 
                key={i} 
                className={`faq-accordion-item executive-card ${isOpen ? 'active' : ''}`}
                onClick={() => setOpenIdx(isOpen ? null : i)}
              >
                <div className="faq-question-bar">
                  <span className="faq-q-text">{faq.q}</span>
                  <div className={`faq-arr-box ${isOpen ? 'rotated' : ''}`}>
                    <ChevronDown size={16} />
                  </div>
                </div>
                {isOpen && (
                  <div className="faq-answer-bar">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .faq-purple-section {
          padding: 70px 0;
          background: #F8FAFC;
        }
        .faq-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
        }
        .faq-title {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          margin-top: 10px;
        }
        .faq-accordion-container {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-accordion-item {
          padding: 20px 24px;
          cursor: pointer;
          background: #FFFFFF;
          transition: all var(--transition-smooth);
        }
        .faq-accordion-item.active {
          border-color: var(--purple-primary);
          box-shadow: 0 4px 18px rgba(124, 58, 237, 0.08);
        }
        .faq-question-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }
        .faq-q-text {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
        }
        .faq-arr-box {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          transition: all var(--transition-smooth);
          flex-shrink: 0;
        }
        .faq-arr-box.rotated {
          transform: rotate(180deg);
          background: var(--purple-light);
          color: var(--purple-primary);
        }
        .faq-answer-bar {
          padding-top: 14px;
          margin-top: 14px;
          border-top: 1px solid var(--border-light);
        }
        .faq-answer-bar p {
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
        }
      `}</style>
    </section>
  );
};
