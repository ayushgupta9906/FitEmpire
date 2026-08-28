import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Dumbbell, 
  ShieldCheck, 
  Search, 
  Flame,
  ArrowRight,
  Check,
  Zap
} from 'lucide-react';

interface GymExplorerProps {
  onBookGym: (gym: any) => void;
}

const SAMPLE_GYMS = [
  {
    id: 'gym-1',
    name: 'Golds Gym Koramangala',
    city: 'Bengaluru',
    area: 'Koramangala 5th Block',
    distance: '0.8 km away',
    rating: 4.9,
    reviewsCount: 840,
    category: 'gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop',
    amenities: ['Air Conditioned', 'Steam & Sauna', 'Personal Trainers', 'Free Parking'],
    popularFor: 'Strength Training • Olympic Barbells',
    badge: 'Popular #1'
  },
  {
    id: 'gym-2',
    name: 'Cult.Fit Elite Indiranagar',
    city: 'Bengaluru',
    area: '100ft Road, Indiranagar',
    distance: '1.4 km away',
    rating: 4.9,
    reviewsCount: 1250,
    category: 'crossfit',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
    amenities: ['HRX Training', 'Boxing Ring', 'Locker & Showers', 'Cafeteria'],
    popularFor: 'High Intensity CrossFit • S&C',
    badge: 'Elite Partner'
  },
  {
    id: 'gym-3',
    name: 'Anytime Fitness HSR Layout',
    city: 'Bengaluru',
    area: 'Sector 4, HSR Layout',
    distance: '2.1 km away',
    rating: 4.8,
    reviewsCount: 620,
    category: 'gym',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&auto=format&fit=crop',
    amenities: ['24/7 Access', 'Cardio Deck', 'Certified Trainers', 'Wifi'],
    popularFor: 'Late Night Workout • Clean Facilities',
    badge: '24/7 Open'
  },
  {
    id: 'gym-4',
    name: 'Bengaluru Aquatic & Swim Club',
    city: 'Bengaluru',
    area: 'Domlur / HAL Airport Road',
    distance: '3.0 km away',
    rating: 5.0,
    reviewsCount: 490,
    category: 'swimming',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop',
    amenities: ['Olympic Heated Pool', 'Coaching Lanes', 'Jacuzzi & Sauna', 'Steam'],
    popularFor: 'Olympic Pool • Water Aerobics',
    badge: 'Premium Pool'
  },
  {
    id: 'gym-5',
    name: 'Prana Yoga & Pilates Sanctuary',
    city: 'Bengaluru',
    area: 'Lavelle Road, Central Bengaluru',
    distance: '3.8 km away',
    rating: 4.9,
    reviewsCount: 380,
    category: 'yoga',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop',
    amenities: ['Reformer Pilates', 'Aerial Yoga', 'Meditation Hall', 'Herbal Tea'],
    popularFor: 'Ashtanga Yoga • Core Reformer',
    badge: 'Mind & Body'
  },
  {
    id: 'gym-6',
    name: 'Knockout Combat MMA & Boxing',
    city: 'Delhi NCR',
    area: 'Connaught Place, New Delhi',
    distance: '1.2 km away',
    rating: 4.9,
    reviewsCount: 710,
    category: 'boxing',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop',
    amenities: ['Full Boxing Ring', 'Kickboxing Bags', 'Pro Coaches', 'Showers'],
    popularFor: 'Muay Thai • Self Defense',
    badge: 'Pro Fight Club'
  }
];

export const GymExplorer: React.FC<GymExplorerProps> = ({ onBookGym }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredGyms = SAMPLE_GYMS.filter((gym) => {
    const matchesCat = selectedCategory === 'all' || gym.category === selectedCategory;
    const matchesQuery = 
      gym.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      gym.area.toLowerCase().includes(searchFilter.toLowerCase()) ||
      gym.city.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <section id="explore-gyms" className="gyms-purple-section">
      <div className="container">
        
        {/* Section Heading */}
        <div className="gyms-header-center">
          <div className="badge-pill-purple">
            <ShieldCheck size={13} className="text-purple" />
            <span>12,000+ VERIFIED FITNESS PARTNERS</span>
          </div>
          <h2 className="gyms-title">
            Explore Premium Gyms & <span className="text-purple-gradient">Studios Near You</span>
          </h2>
          <p className="gyms-subtitle">
            Search top fitness centres in your locality. Your FitEmpire pass grants instant access.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="gyms-filter-toolbar executive-card">
          <div className="gym-search-box">
            <Search size={16} className="text-purple" />
            <input 
              type="text" 
              placeholder="Search by gym name, locality or city..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div className="categories-pill-row">
            <button 
              className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories ({SAMPLE_GYMS.length})
            </button>
            <button 
              className={`cat-pill ${selectedCategory === 'gym' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('gym')}
            >
              Gym Workouts
            </button>
            <button 
              className={`cat-pill ${selectedCategory === 'crossfit' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('crossfit')}
            >
              CrossFit / HIIT
            </button>
            <button 
              className={`cat-pill ${selectedCategory === 'yoga' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('yoga')}
            >
              Yoga & Pilates
            </button>
            <button 
              className={`cat-pill ${selectedCategory === 'swimming' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('swimming')}
            >
              Swimming
            </button>
            <button 
              className={`cat-pill ${selectedCategory === 'boxing' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('boxing')}
            >
              Boxing / MMA
            </button>
          </div>
        </div>

        {/* Gyms Grid */}
        <div className="gyms-cards-grid">
          {filteredGyms.map((gym) => (
            <div key={gym.id} className="gym-item-card executive-card">
              
              <div className="gym-img-wrap">
                <img src={gym.image} alt={gym.name} className="g-img" />
                <span className="g-badge">{gym.badge}</span>
                <span className="g-distance">
                  <MapPin size={11} />
                  {gym.distance}
                </span>
              </div>

              <div className="gym-content-wrap">
                <div className="gym-top-info">
                  <div>
                    <h3 className="g-name">{gym.name}</h3>
                    <div className="g-loc">{gym.area} • {gym.city}</div>
                  </div>
                  <div className="g-rating">
                    <Star size={13} fill="#D97706" color="#D97706" />
                    <span>{gym.rating}</span>
                  </div>
                </div>

                <div className="g-popular-tag">
                  <Flame size={13} color="#7C3AED" />
                  <span>{gym.popularFor}</span>
                </div>

                <div className="g-amenities-row">
                  {gym.amenities.map((am, i) => (
                    <span key={i} className="g-amenity-chip">
                      <Check size={11} color="#059669" />
                      {am}
                    </span>
                  ))}
                </div>

                <div className="gym-card-action-bar">
                  <div className="g-pass-inc">
                    <ShieldCheck size={14} color="#7C3AED" />
                    <span>Included in Pass</span>
                  </div>

                  <button 
                    className="btn-purple-primary btn-book-slot"
                    onClick={() => onBookGym(gym)}
                  >
                    <span>Book Slot</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      <style>{`
        .gyms-purple-section {
          padding: 70px 0;
          background: #FFFFFF;
        }
        .gyms-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
        }
        .gyms-title {
          font-size: 38px;
          font-weight: 900;
          color: #0F172A;
          margin: 12px 0 8px;
        }
        .gyms-subtitle {
          font-size: 16px;
          color: #64748B;
        }
        .gyms-filter-toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 18px;
          margin-bottom: 36px;
          background: #F8FAFC;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          flex-wrap: wrap;
        }
        .gym-search-box {
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          padding: 8px 14px;
        }
        .gym-search-box input {
          border: none;
          outline: none;
          font-size: 13.5px;
          color: #0F172A;
          width: 100%;
          font-family: inherit;
        }
        .categories-pill-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
        }
        .cat-pill {
          padding: 7px 14px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }
        .cat-pill:hover {
          border-color: var(--purple-border);
          color: var(--purple-primary);
        }
        .cat-pill.active {
          background: var(--purple-gradient);
          color: #FFFFFF;
          border-color: transparent;
        }
        .gyms-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .gym-item-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
        }
        .gym-img-wrap {
          height: 190px;
          position: relative;
        }
        .g-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .gym-item-card:hover .g-img {
          transform: scale(1.05);
        }
        .g-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .g-distance {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.75);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .gym-content-wrap {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .gym-top-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .g-name {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
        }
        .g-loc {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }
        .g-rating {
          display: flex;
          align-items: center;
          gap: 3px;
          background: #FEF3C7;
          color: #92400E;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .g-popular-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--purple-primary);
          margin-bottom: 12px;
        }
        .g-amenities-row {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 18px;
        }
        .g-amenity-chip {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          color: #475569;
          background: #F1F5F9;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .gym-card-action-bar {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-light);
        }
        .g-pass-inc {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 700;
          color: #334155;
        }
        .btn-book-slot {
          padding: 7px 16px;
          font-size: 12px;
        }

        @media (max-width: 1024px) {
          .gyms-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .gyms-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
