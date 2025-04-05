import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './PuzzleRush.css';

const PuzzleRush = () => {
  const [timerValue, setTimerValue] = useState(60);
  const [randomNumber, setRandomNumber] = useState("Click Start");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const [resultClass, setResultClass] = useState("");
  const [gameActive, setGameActive] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [startDisabled, setStartDisabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const timerRef = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize audio context on user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      try {
        // Create a new audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        // Resume the audio context if it's suspended
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        
        // Load sound files
        loadSounds();
        
        console.log('Audio context initialized');
      } catch (error) {
        console.error('Error initializing audio context:', error);
        setSoundEnabled(false);
      }
    }
  };

  // Load sound files
  const loadSounds = async () => {
    try {
      // Create new audio elements
      correctSoundRef.current = new Audio('/sounds/correct.mp3');
      wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
      
      // Preload audio files
      await Promise.all([
        correctSoundRef.current.load(),
        wrongSoundRef.current.load()
      ]);
      
      console.log('Sound files loaded successfully');
    } catch (error) {
      console.error('Error loading sound files:', error);
      setSoundEnabled(false);
    }
  };

  // Play sound with fallback mechanism
  const playSound = (soundRef) => {
    if (!soundEnabled) return;
    
    try {
      if (soundRef.current) {
        // Reset sound to start
        soundRef.current.currentTime = 0;
        
        // Try to play the sound
        const playPromise = soundRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing sound:', error);
            
            // If autoplay was prevented, try to initialize audio context
            if (error.name === 'NotAllowedError') {
              initAudio();
            }
          });
        }
      }
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  };

  // Toggle sound on/off
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled && !audioContextRef.current) {
      initAudio();
    }
  };

  // Initialize audio on component mount
  useEffect(() => {
    // Try to initialize audio context
    initAudio();
    
    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const operators = ['+', '-', '*', '/', '^'];

  const applyOperator = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return (b !== 0) ? a / b : 1e9;
      case '^': return Math.pow(a, b);
      default: return 1e9;
    }
  };

  const evaluateExpression = (expr) => {
    try {
      // Replace ^ with ** for exponentiation
      const safeExpr = expr.replace(/\^/g, '**');
      // Use Function constructor instead of eval for better security
      const result = new Function('return ' + safeExpr)();
      return Math.abs(result - 100) < 1e-6;
    } catch (error) {
      console.error('Expression evaluation error:', error);
      return false;
    }
  };

  const generateExpressions = (digits, expr, index) => {
    if (index === 6) return evaluateExpression(expr);
    for (let op of operators) {
      if (generateExpressions(digits, expr + op + digits[index], index + 1)) return true;
    }
    return generateExpressions(digits, expr + digits[index], index + 1);
  };

  const canForm100 = (digits) => {
    return generateExpressions(digits, digits[0], 1);
  };

  const generateValidNumber = () => {
    let num;
    do {
      num = '';
      while (num.length < 6) {
        num += Math.floor(Math.random() * 9) + 1;
      }
    } while (!canForm100(num));
    return num;
  };

  const startGame = () => {
    // Initialize audio on game start (user interaction)
    initAudio();
    
    if (timerRef.current) clearInterval(timerRef.current);

    setInputDisabled(false);
    setSubmitDisabled(false);
    setStartDisabled(true);
    setResult("");
    setGameActive(true);

    timerRef.current = setInterval(() => {
      setTimerValue(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setGameActive(false);
          setInputDisabled(true);
          setSubmitDisabled(true);
          setStartDisabled(false);
          setResult(`Time's up! Final Score: ${score}`);
          setResultClass("incorrect");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    const newNumber = generateValidNumber();
    setRandomNumber(newNumber);
    setUserInput("");
  };

  const restartGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimerValue(60);
    setScore(0);
    setUserInput("");
    setInputDisabled(true);
    setSubmitDisabled(true);
    setStartDisabled(false);
    setResult("");
    setRandomNumber("Click Start");
    setGameActive(false);
  };

  const checkExpression = () => {
    try {
      let validSymbols = /^[0-9+\-*/^()]+$/;
      if (!validSymbols.test(userInput)) {
        playSound(wrongSoundRef);
        setResult("Invalid symbols used!");
        setResultClass("incorrect");
        return;
      }

      let cleanedInput = userInput.replace(/[^0-9]/g, '');
      if (!randomNumber.startsWith(cleanedInput)) {
        playSound(wrongSoundRef);
        setResult("Digits must appear in the same order!");
        setResultClass("incorrect");
        return;
      }

      if (evaluateExpression(userInput)) {
        setScore(prevScore => prevScore + 1);
        setResult("Correct! The result is 100.");
        setResultClass("correct");
        playSound(correctSoundRef);
        const newNumber = generateValidNumber();
        setRandomNumber(newNumber);
        setUserInput("");
      } else {
        playSound(wrongSoundRef);
        setResult("Incorrect! Try again.");
        setResultClass("incorrect");
      }
    } catch (error) {
      console.error('Error in checkExpression:', error);
      setResult("An error occurred. Please try again.");
      setResultClass("incorrect");
      playSound(wrongSoundRef);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkExpression();
    }
  };

  return (
    <div className="puzzle-rush-page">
      <header>HectoClash: A Competitive Mental Math Revolution</header>
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
        <h2>Timer:</h2>
        <div className="timer-container">
          <div id="timer">{timerValue}</div>
        </div>
        <button onClick={startGame} id="startBtn" disabled={startDisabled}>Start Game</button>
        <div className="score-display">Score: {score}</div>
        <h2>Generated Number:</h2>
        <div className="number-display">{randomNumber}</div>
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your expression" 
          disabled={inputDisabled} 
        />
        <button onClick={checkExpression} id="submitBtn" disabled={submitDisabled}>Submit</button>
        <button onClick={restartGame} id="restartBtn">Restart</button>
        <button onClick={toggleSound} className="sound-toggle">
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
        <p id="result" className={resultClass}>{result}</p>
        <div className="back-btn">
          <Link to="/game-modes">Back to Mode</Link>
        </div>
      </div>
      <footer>
        &copy; 2025 HectoClash. All rights reserved.
      </footer>
    </div>
  );
};

export default PuzzleRush; 