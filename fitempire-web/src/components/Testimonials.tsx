import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Ananya Deshmukh',
    role: 'Product Designer • Bengaluru',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    rating: 5,
    tag: 'Lost 12 Kgs in 5 Months',
    review: 'FitEmpire completely unlocked my fitness! I go to Cult for HIIT near my office in the morning and swim at Bengaluru Club on weekends. The 60-second dynamic QR check-in is so seamless.'
  },
  {
    name: 'Vikram Singhania',
    role: 'Gym Owner • Golds Gym Koramangala',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    rating: 5,
    tag: 'Partner Gym Owner',
    review: 'Our afternoon slots between 12 PM to 4 PM used to be empty. FitEmpire brings 40-50 verified members daily and pays out weekly without fail. Best partner platform in India!'
  },
  {
    name: 'Rohan Mehta',
    role: 'VP Engineering • Mumbai',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    rating: 5,
    tag: 'Frequent Traveler',
    review: 'I travel between Delhi, Bangalore and Mumbai every week. Having one pass that works across premium gyms, airport fitness lounges, and local studios is an absolute game-changer.'
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="testimonials-purple-section">
      <div className="container">
        
        <div className="test-header-center">
          <div className="badge-pill-purple">
            <Sparkles size={13} className="text-purple" />
            <span>MEMBER & PARTNER EXPERIENCES</span>
          </div>
          <h2 className="test-title">
            Loved by Members. <span className="text-purple-gradient">Trusted by 12,000+ Gyms.</span>
          </h2>
          <p className="test-subtitle">Over 2,500,000+ verified workouts completed across India.</p>
        </div>

        <div className="reviews-cards-grid">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="review-card-box executive-card">
              <Quote size={28} className="review-quote-bg" />
              
              <div className="stars-row">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} size={15} fill="#D97706" color="#D97706" />
                ))}
              </div>

              <p className="review-comment">"{rev.review}"</p>

              <div className="author-row">
                <img src={rev.photo} alt={rev.name} className="author-photo" />
                <div className="author-details">
                  <strong className="author-name">{rev.name}</strong>
                  <span className="author-role">{rev.role}</span>
                  <span className="author-tag text-purple">{rev.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .testimonials-purple-section {
          padding: 70px 0;
          background: #FFFFFF;
        }
        .test-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }
        .test-title {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          margin: 12px 0 8px;
        }
        .test-subtitle {
          font-size: 16px;
          color: #64748B;
        }
        .reviews-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .review-card-box {
          padding: 28px;
          display: flex;
          flex-direction: column;
          position: relative;
          background: #FFFFFF;
        }
        .review-quote-bg {
          color: var(--purple-border);
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .stars-row {
          display: flex;
          gap: 3px;
          margin-bottom: 12px;
        }
        .review-comment {
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 22px;
          flex: 1;
        }
        .author-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid var(--border-light);
        }
        .author-photo {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--purple-border);
        }
        .author-details {
          display: flex;
          flex-direction: column;
        }
        .author-name {
          font-size: 14px;
          color: #0F172A;
        }
        .author-role {
          font-size: 11px;
          color: #64748B;
        }
        .author-tag {
          font-size: 11px;
          font-weight: 700;
          margin-top: 2px;
        }

        @media (max-width: 960px) {
          .reviews-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
