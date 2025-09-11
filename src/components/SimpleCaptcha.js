import { useState, useEffect } from 'react';

const SimpleCaptcha = ({ onVerify, disabled = false }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let result;
    let questionText;
    
    switch (operator) {
      case '+':
        result = num1 + num2;
        questionText = `${num1} + ${num2}`;
        break;
      case '-':
        // Ensure positive result
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        result = larger - smaller;
        questionText = `${larger} - ${smaller}`;
        break;
      case '*':
        // Use smaller numbers for multiplication
        const small1 = Math.floor(Math.random() * 5) + 1;
        const small2 = Math.floor(Math.random() * 5) + 1;
        result = small1 * small2;
        questionText = `${small1} × ${small2}`;
        break;
      default:
        result = num1 + num2;
        questionText = `${num1} + ${num2}`;
    }
    
    setQuestion(questionText);
    setAnswer(result.toString());
    setUserAnswer('');
    setIsVerified(false);
    setError('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer.trim() === answer) {
      setIsVerified(true);
      setError('');
      onVerify(true);
    } else {
      setError('Incorrect answer. Please try again.');
      generateQuestion(); // Generate new question on wrong answer
      onVerify(false);
    }
  };

  const handleRefresh = () => {
    generateQuestion();
    onVerify(false);
  };

  return (
    <div className="simple-captcha border rounded p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <small className="text-muted">Security Check</small>
        <button 
          type="button" 
          className="btn btn-link btn-sm p-0"
          onClick={handleRefresh}
          disabled={disabled}
          title="Generate new question"
        >
          🔄
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
        <span className="fw-bold text-primary">{question} = ?</span>
        <input
          type="number"
          className={`form-control form-control-sm ${error ? 'is-invalid' : isVerified ? 'is-valid' : ''}`}
          style={{ width: '80px' }}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={disabled || isVerified}
          placeholder="Answer"
          required
        />
        <button 
          type="submit" 
          className="btn btn-primary btn-sm"
          disabled={disabled || isVerified || !userAnswer.trim()}
        >
          {isVerified ? '✓' : 'Verify'}
        </button>
      </form>
      
      {error && <div className="text-danger small mt-1">{error}</div>}
      {isVerified && <div className="text-success small mt-1">✓ Security check passed</div>}
    </div>
  );
};

export default SimpleCaptcha;
