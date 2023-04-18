import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditQuestion = () => {
  const { id, qid } = useParams(); // id: game id, qid: question id
  const token = localStorage.getItem('token');
  // Define the question state
  const [question, setQuestion] = useState({
    type: '',
    questionText: '',
    timeLimit: 0,
    points: 0,
    media: '',
    answers: [],
  });

  // Fetch the question data from the server when the component mounts
  useEffect(() => {
    fetch(`http://localhost:5005/admin/game/${id}/question/${qid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch question data');
        }
        return res.json();
      })
      .then(data => {
        setQuestion(data);
      })
      .catch(error => {
        console.log(error);
        console.log('Could not fetch question data');
      });
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Make a PUT request to update the question data
    fetch(`http://localhost:5005/admin/game/${id}/question/${qid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(question)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update question data');
        }
        return res.json();
      })
      .then(data => {
        // Handle successful submission
      })
      .catch(error => {
        console.log(error);
        console.log('Could not update question data');
      });
  };

  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
        {/* Question type (multiple choice, single choice) */}
        {/* Question text */}
        {/* Time limit */}
        {/* Points */}
        {/* Media */}
        {/* Answers */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
    </>
  );
};

export default EditQuestion;
