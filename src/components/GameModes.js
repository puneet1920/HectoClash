import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './GameModes.css';

const GameModes = () => {
  const carouselRef = useRef(null);

  const gameModes = [
    {
      id: 1,
      name: 'Online Multiplayer',
      description: 'Challenge players from around the world in real-time matches!',
      image: '/images/onlinemulti.jpg',
      link: '/game'
    },
    {
      id: 2,
      name: 'Puzzle Rush',
      description: 'Race against time to solve as many puzzles as possible!',
      image: '/images/puzzlerush.jpg',
      link: '/puzzle-rush'
    },
    {
      id: 3,
      name: 'Offline Mode',
      description: 'Practice your skills against AI opponents.',
      image: '/images/offline.jpg',
      link: '/offline'
    },
    {
      id: 4,
      name: 'Survival Mode',
      description: 'See how long you can survive against increasingly difficult challenges!',
      image: '/images/survival.jpg',
      link: '/survival'
    },
    {
      id: 5,
      name: 'More Ways',
      description: 'Discover additional game modes and challenges.',
      image: '/images/moreways.jpg',
      link: '/more'
    }
  ];

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="game-modes-page">
      <header>HectoClash</header>
      <nav>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/game-modes">Game Modes</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
        <Link to="/profile" className="profile-button">Profile</Link>
      </nav>
      <div className="container">
        <h2>Game Modes</h2>
        <div className="game-modes-grid" ref={carouselRef}>
          {gameModes.map(mode => (
            <Link to={mode.link} key={mode.id} className="game-mode-card">
              <div className="game-mode-image">
                <img src={mode.image} alt={mode.name} />
              </div>
              <div className="game-mode-info">
                <h3>{mode.name}</h3>
                <p>{mode.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="carousel-nav">
          <button className="carousel-button" onClick={scrollLeft}>←</button>
          <button className="carousel-button" onClick={scrollRight}>→</button>
        </div>
      </div>
      <footer>
        <p>© 2023 HectoClash. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GameModes; 