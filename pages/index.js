import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
    createParticles();
    
    // Scroll indicator and back to top functionality
    const handleScroll = () => {
      updateScrollIndicator();
      handleBackToTop();
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/fancode-data');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setMatches(data.matches || []);
      }
    } catch (err) {
      setError('Failed to load live events');
    } finally {
      setLoading(false);
    }
  };

  const createParticles = () => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = Math.random() * 6 + 2 + 'px';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = Math.random() * 20 + 20 + 's';
      particlesContainer.appendChild(particle);
    }
  };

  const updateScrollIndicator = () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const indicator = document.getElementById('scrollIndicator');
    if (indicator) {
      indicator.style.transform = `scaleX(${scrollPercent / 100})`;
    }
  };

  const handleBackToTop = () => {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    if (window.scrollY > 500) {
      backToTop.classList.remove('opacity-0', 'invisible');
      backToTop.classList.add('opacity-100', 'visible');
    } else {
      backToTop.classList.remove('opacity-100', 'visible');
      backToTop.classList.add('opacity-0', 'invisible');
    }
  };

  const generateMatchCards = () => {
    if (loading) {
      return (
        <div className="col-span-full text-center py-20 space-y-6">
          <div className="text-8xl text-gray-400">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h3 className="text-3xl font-bold text-gray-300">Loading Live Events</h3>
          <p className="text-gray-400 text-lg">Please wait...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-20 space-y-6">
          <div className="text-8xl text-red-400">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3 className="text-3xl font-bold text-gray-300">Connection Error</h3>
          <p className="text-gray-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="watch-btn mt-4 inline-flex items-center space-x-2"
          >
            <i className="fas fa-refresh"></i>
            <span>Retry</span>
          </button>
        </div>
      );
    }

    if (matches.length === 0) {
      return (
        <div className="col-span-full text-center py-20 space-y-6">
          <div className="text-8xl text-gray-400">
            <i className="fas fa-satellite-dish"></i>
          </div>
          <h3 className="text-3xl font-bold text-gray-300">No Live Events</h3>
          <p className="text-gray-400 text-lg">Check back soon for exciting live sports action</p>
        </div>
      );
    }

    return matches.map((match) => (
      <article key={match.match_id} className="match-card group">
        {match.status === 'LIVE' && (
          <div className="live-indicator">
            <div className="live-dot"></div>
            <span>LIVE</span>
          </div>
        )}
        
        <div className="match-image aspect-video relative">
          <img 
            src={match.src} 
            alt={match.title} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        
        <div className="match-content">
          <div className="flex items-center justify-between mb-4">
            <span className="category-badge">{match.event_category}</span>
            <div className="text-sm text-gray-400">
              <i className="fas fa-clock mr-1"></i>
              {match.startTime.split(' ')[0]}
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">
            {match.event_name}
          </h3>
          
          <div className="team-vs">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm font-semibold text-center flex-1">{match.team_1}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold">VS</span>
              </div>
              <span className="text-sm font-semibold text-center flex-1">{match.team_2}</span>
            </div>
          </div>
          
          <div className="mt-6">
            {match.status === 'LIVE' ? (
              <Link href={`/play/${match.match_id}`}>
                <a className="watch-btn w-full flex items-center justify-center space-x-2">
                  <i className="fas fa-play-circle"></i>
                  <span>Watch Live</span>
                </a>
              </Link>
            ) : (
              <button className="watch-btn disabled-btn w-full flex items-center justify-center space-x-2" disabled>
                <i className="fas fa-clock"></i>
                <span>Starting Soon</span>
              </button>
            )}
          </div>
        </div>
      </article>
    ));
  };

  return (
    <>
      <Head>
        <title>Fancode</title>
        <link rel="icon" href="https://www.fancode.com/skillup-uploads/fc-web-logo/favicon.png" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --primary: #6366f1;
          --secondary: #a855f7;
          --accent: #ec4899;
          --success: #10b981;
          --warning: #f59e0b;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d1b69 100%);
          color: #ffffff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .floating-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 20s infinite linear;
        }

        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        .match-card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }

        .match-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .match-card:hover {
          transform: translateY(-12px) rotateX(5deg) rotateY(5deg);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.25),
            0 0 100px rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .match-card:hover::before {
          opacity: 1;
        }

        .match-image {
          position: relative;
          overflow: hidden;
        }

        .match-image img {
          transition: transform 0.5s ease;
        }

        .match-card:hover .match-image img {
          transform: scale(1.1);
        }

        .live-indicator {
          position: absolute;
          top: 16px;
          left: 16px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
          z-index: 10;
          display: flex;
          align-items: center;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: livePulse 1.5s infinite;
          margin-right: 8px;
          flex-shrink: 0;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .match-content {
          position: relative;
          z-index: 2;
          padding: 24px;
        }

        .category-badge {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
        }

        .watch-btn {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          border: none;
          color: white;
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .watch-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .watch-btn:hover::before {
          left: 100%;
        }

        .watch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
        }

        .disabled-btn {
          background: linear-gradient(135deg, #374151, #4b5563);
          color: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }

        .disabled-btn:hover {
          transform: none;
          box-shadow: none;
        }

        .team-vs {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: 16px;
          margin: 16px 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .floating-nav {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          padding: 12px 32px;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .floating-nav:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(-50%) translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .scroll-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          transform-origin: left;
          transform: scaleX(0);
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        @media (max-width: 768px) {
          .match-card:hover {
            transform: translateY(-8px);
          }
        }
      `}</style>

      <div className="floating-particles" id="particles"></div>
      <div className="scroll-indicator" id="scrollIndicator"></div>
      
      <nav className="floating-nav">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <i className="fas fa-play text-white text-sm"></i>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Fancode Live
          </h1>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div id="matches-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generateMatchCards()}
          </div>
        </div>
      </main>

      <button 
        id="backToTop" 
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-2xl backdrop-blur-sm transition-all opacity-0 invisible hover:scale-110"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <i className="fas fa-rocket"></i>
      </button>
    </>
  );
                            }
