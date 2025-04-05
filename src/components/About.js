import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <header className="game-header">HectoClash: A Competitive Mental Math Revolution</header>

      <nav className="game-nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/game-modes">Game Modes</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/game">Play Now</Link>
        </div>
        <Link to="/profile" className="profile-btn">Profile</Link>
      </nav>

      <div className="container">
        <section id="about">
          <h2>About HectoClash</h2>
          <p>HectoClash redefines mental math gaming by blending speed, strategy, and competition into an engaging experience. Players solve math puzzles under time constraints, fostering quick thinking and problem-solving skills.</p>
        </section>

        <section id="modes">
          <h2>Battle Modes</h2>
          <ul>
            <li>1v1 Duels – Compete in a head-to-head math showdown.</li>
            <li>Team Battles – Play in groups (2v2, 3v3).</li>
            <li>Survival Mode – Solve as many puzzles as possible before time runs out.</li>
            <li>Puzzle Rush – Solve 10 puzzles in the shortest time.</li>
          </ul>
        </section>

        <section id="leaderboard">
          <h2>Leaderboard</h2>
          <p>Track your ranking at institute, city, and national levels!</p>
        </section>

        <section id="play">
          <h2>Start Playing</h2>
          <Link to="/game">
            <button>Play Now</button>
          </Link>
        </section>
      </div>

      <footer>
        &copy; 2025 HectoClash. All rights reserved.
      </footer>
    </div>
  );
};

export default About; 