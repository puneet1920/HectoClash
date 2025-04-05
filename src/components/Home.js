import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <header>HectoClash: A Competitive Mental Math Revolution</header>

      <nav>
        <Link to="/about">About</Link>
        <Link to="/game-modes">Game Modes</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/game">Play Now</Link>
        <div className="profile" onClick={() => window.location.href = '/profile'}>👤 Profile</div>
      </nav>

      <div className="hero-wrapper">
        <div className="spline-background">
          <iframe 
            src="https://my.spline.design/particleaibrain-44c658de200b6a576044df4b436bac11/" 
            allowFullScreen
            title="Spline Background"
          ></iframe>

          {/* Overlay to cover watermark */}
          <div className="spline-overlay"></div>
        </div>

        <div className="hero">
          <h1>Play HectoClash Online with Friends</h1>
          <p>Challenge players worldwide or test your skills against AI!</p>
          <Link to="/game">
            <button>Start Playing</button>
          </Link>
        </div>
      </div>

      <footer>
        &copy; 2025 HectoClash. All rights reserved.
      </footer>
    </div>
  );
};

export default Home; 