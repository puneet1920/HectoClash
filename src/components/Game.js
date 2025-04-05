import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Game.css';

const Game = () => {
  const [randomNumber, setRandomNumber] = useState('Loading...');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [resultClass, setResultClass] = useState('');

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
      let result = eval(expr.replace('^', '**'));
      return Math.abs(result - 100) < 1e-6;
    } catch (error) {
      return false;
    }
  };

  const generateExpressions = (digits, expr, index) => {
    if (index === 6) return evaluateExpression(expr);

    let found = false;
    for (let op of operators) {
      if (generateExpressions(digits, expr + op + digits[index], index + 1)) found = true;
    }

    if (generateExpressions(digits, expr + digits[index], index + 1)) found = true;

    return found;
  };

  const canForm100 = (digits) => {
    return generateExpressions(digits, digits[0], 1);
  };

  const generateValidNumber = () => {
    let num;
    do {
      num = '';
      while (num.length < 6) {
        let digit = Math.floor(Math.random() * 9) + 1;
        num += digit;
      }
    } while (!canForm100(num));
    return num;
  };

  useEffect(() => {
    const number = generateValidNumber();
    setRandomNumber(number);
  }, []);

  const checkExpression = () => {
    let validSymbols = /^[0-9+\-*/^()]+$/;
    if (!validSymbols.test(userInput)) {
      setResult("Invalid symbols used!");
      setResultClass("incorrect");
      return;
    }

    let cleanedInput = userInput.replace(/[^0-9]/g, '');
    if (!randomNumber.startsWith(cleanedInput)) {
      setResult("Digits must appear in the same order!");
      setResultClass("incorrect");
      return;
    }

    if (evaluateExpression(userInput)) {
      setResult("Correct! The result is 100.");
      setResultClass("correct");
    } else {
      setResult("Incorrect! Try again.");
      setResultClass("incorrect");
    }
  };

  return (
    <div className="game-page">
      <header>HectoClash: A Competitive Mental Math Revolution</header>

      <div className="nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/game-modes">Game Modes</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>

      <div className="container">
        <h2>Generated Number:</h2>
        <div className="number-display">{randomNumber}</div>
        <br />
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your expression"
        />
        <button onClick={checkExpression}>Submit</button>
        <p id="result" className={resultClass}>{result}</p>

        <div className="back-btn">
          <Link to="/">Back to Home</Link>
        </div>
      </div>

      <footer>
        &copy; 2025 HectoClash. All rights reserved.
      </footer>
    </div>
  );
};

export default Game; 