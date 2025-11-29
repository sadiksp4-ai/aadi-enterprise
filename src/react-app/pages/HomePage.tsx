import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import './HomePage.css';

const CLIENTS = [
  "Grand Hyatt", "Marriott", "Hilton", "JW Marriott", "Accor", 
  "The Ritz-Carlton", "Westin", "Sheraton", "Radisson Blu", "Novotel",
  "W Hotels", "Le Meridien", "Apollo Hospitals", "Conrad", "Fairfield by Marriott",
  "Hyatt Regency", "Oakwood Premier", "Royal Western India Turf Club", "The Corinthians"
];

const CATEGORIES = [
  "Commercial Kitchen", "F&B Service", "Hygiene and Housekeeping", "Front Office", "Banquet"
];

const CATEGORY_IMAGES: Record<string, string> = {
  "Commercial Kitchen": "/commercial_kitchen.jpg",
  "F&B Service": "/f&b.jpg",
  "Hygiene and Housekeeping": "/housekeeping.jpg",
  "Front Office": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
  "Banquet": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop"
};

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="hero-video-element"
          >
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content-container">
          <h1 className="hero-main-title">
            World-Class <br/>
            <span className="hero-highlight-text">Hospitality Solutions.</span>
          </h1>
          <p className="hero-description">
             Your trusted partner for stylish & functional F&B equipment. From pre-opening consultation to premium installation.
          </p>
          <div className="hero-buttons">
            <a 
              href="https://drive.google.com/drive/folders/1f6st0JQ64rPWvfX-nhnfuVSjP5kFCohs?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Explore Solutions
            </a>
            <button 
              onClick={() => navigate('/contact')} 
              className="btn btn-outline"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="trust-container">
          <div className="trust-content">
             <div className="trust-item">
                <Award className="trust-icon" size={24} />
                <span className="trust-text">ISO 9001:2015</span>
             </div>
             <div className="trust-item">
                <ShieldCheck className="trust-icon" size={24} />
                <span className="trust-text">GeM Certified</span>
             </div>
             <div className="trust-item">
                <CheckCircle className="trust-icon" size={24} />
                <span className="trust-text">FSSAI Compliant</span>
             </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-proposition-section">
        <div className="section-container">
           <div className="section-header">
             <h2 className="section-title">Why Choose Aadi?</h2>
             <div className="section-divider"></div>
           </div>

           <div className="value-grid">
             {[
               {
                 icon: <Globe size={40} />,
                 title: "Global Brands",
                 desc: "Direct partners with Rational, Hoshizaki, Winterhalter, and other industry leaders."
               },
               {
                 icon: <CheckCircle size={40} />,
                 title: "End-to-End Execution",
                 desc: "Kitchen layout planning, equipment sourcing, installation, and training."
               },
               {
                 icon: <Award size={40} />,
                 title: "Expert Consultation",
                 desc: "Tailored pre-opening advice and reliable after-sales support for your property."
               }
             ].map((item, idx) => (
               <div key={idx} className="value-card">
                 <div className="value-icon">{item.icon}</div>
                 <h3 className="value-title">{item.title}</h3>
                 <p className="value-desc">{item.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Clients Ticker */}
      <section className="clients-section">
        <div className="clients-container">
          <h3 className="clients-title">Trusted By Leading Brands</h3>
        </div>
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {[...CLIENTS, ...CLIENTS].map((client, idx) => (
              <span 
                key={idx} 
                className="ticker-item"
                onClick={() => navigate('/clients')}
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Preview */}
      <section className="categories-section">
        <div className="section-container">
           <div className="categories-header">
             <div>
               <h2 className="section-title text-left">Our Categories</h2>
               <p className="categories-subtitle">Comprehensive solutions for every corner of your hotel.</p>
             </div>
             <button onClick={() => navigate('/products')} className="view-all-btn">
               View All <ArrowRight size={16} className="icon-ml" />
             </button>
           </div>

           <div className="categories-grid">
             {CATEGORIES.slice(0, 3).map((cat, idx) => (
               <div 
                key={idx} 
                onClick={() => navigate('/products')}
                className="category-card"
               >
                 <img 
                   src={CATEGORY_IMAGES[cat] || `https://picsum.photos/seed/${cat}/600/800`}
                   alt={cat} 
                   className="category-image"
                 />
                 <div className="category-overlay"></div>
                 <div className="category-content">
                   <h3 className="category-title">{cat}</h3>
                   <span className="category-explore">
                     Explore <ArrowRight size={14} className="icon-ml" />
                   </span>
                 </div>
               </div>
             ))}
           </div>
           
           <div className="mobile-view-all">
             <button onClick={() => navigate('/products')} className="btn btn-primary">View All Products</button>
           </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
