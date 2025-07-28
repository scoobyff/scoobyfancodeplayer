/* Responsive Design */
        @media (max-width: 768px) {
          .match-info {
            width: 95%;
            padding: 15px;
          }

          .match-title {
            font-size: 1.2rem;
          }

          .telegram-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .social-links {
            gap: 15px;
          }

          .social-link {
            font-size: 1.3rem;
          }
        }

        /* JW Player Custom Styling */
        .jw-controls {
          opacity: 1 !important;
          visibility: visible !important;
        }

        .jw-button-color {
          color: #00c2ff !important;
        }

        .jw-progress {
          background: rgba(0, 194, 255, 0.3) !important;
        }

        .jw-buffer {
          background: rgba(0, 194, 255, 0.5) !important;
        }

        .jw-rail {
          background: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>

      <div className="content-wrapper">
        <div id="player-container"></div>
        
        {match && (
          <div className="match-info">
            <div className="match-title">{match.title || 'Live Match'}</div>
            <div className="match-details">
              {match.description || 'Enjoy the live stream'}
            </div>
            <div className="live-indicator">
              LIVE
            </div>
          </div>
        )}

        <a 
          href="https://t.me/scoobystreams" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="telegram-btn"
        >
          <i className="fab fa-telegram-plane" style={{marginRight: '10px'}}></i>
          Join Telegram
        </a>

        <div className="footer">
          <div className="footer-text">
            Thanks for watching! Join our community for more live streams.
          </div>
          <div className="social-links">
            <a href="https://t.me/scoobystreams" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-telegram-plane"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
          }
