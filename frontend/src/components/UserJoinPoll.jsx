import React, { useState } from 'react';
import axios from 'axios';

export default function UserJoinPoll() {
  const [sessionCode, setSessionCode] = useState('');
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState('');

  const joinPoll = async () => {
    try {
      const res = await axios.get(`/api/poll/${sessionCode}`);
      setPoll(res.data);
      setMessage('');
    } catch (err) {
      setMessage('Poll not found or invalid session code');
      setPoll(null);
    }
  };

  const submitVote = async () => {
    if (selectedOption === null) {
      setMessage('Please select an option');
      return;
    }
    try {
      await axios.post(`/api/poll/${sessionCode}/vote`, { optionIndex: selectedOption });
      setMessage('Vote submitted! Thank you.');
    } catch (err) {
      setMessage('Failed to submit vote');
    }
  };

  if (!poll) {
    return (
      <div>
        <h2>Join a Poll</h2>
        <input
          placeholder="Enter Session Code"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
        />
        <button onClick={joinPoll}>Join</button>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>{poll.question}</h2>
      {poll.options.map((opt, i) => (
        <div key={i}>
          <input
            type="radio"
            name="pollOption"
            value={i}
            onChange={() => setSelectedOption(i)}
          />
          <label>{opt}</label>
        </div>
      ))}
      <button onClick={submitVote}>Submit Vote</button>
      {message && <p>{message}</p>}
    </div>
  );
}
