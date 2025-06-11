import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPollCreate() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [sessionCode, setSessionCode] = useState(null);
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/create-poll', { question, options });
      setSessionCode(res.data.sessionCode); // backend returns code
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create poll');
    }
  };

  return (
    <div>
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addOption}>Add Option</button>
        <button type="submit">Launch Poll</button>
      </form>

      {sessionCode && <p>Poll launched! Share this session code with users: <b>{sessionCode}</b></p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
