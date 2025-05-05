"use client";
import styles from './page.module.css'
import { useState } from 'react';
import surveyData from '@/data/sf12.json';

export default function HomePage() {

  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
    
    const handleResponseChange = (questionId, value) => {
      setResponses(prev => ({
        ...prev,
        [questionId]: value
      }));
    };
  
    const handleSubmit = (e) => {
      //Stop tracking
    };


  return(
  <div>
    <div className = {styles.topbar}>{surveyData.title}</div>
    <div className = {styles.content}>
      {surveyData.questions.map((question) => (
        <div key={question.id} className="mb-6">
          <p>{question.text}</p>
          
          {question.subQuestions ? (
            // Handle questions with subquestions
            <div>
              {question.subQuestions.map((subQ) => (
                <div key={subQ.id} >
                  <p>{subQ.text}</p>
                  <div>
                    {subQ.options.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={subQ.id}
                          value={option.value}
                          checked={responses[subQ.id] === option.value}
                          onChange={() => handleResponseChange(subQ.id, option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Handle questions with direct options
            <div>
              {question.options.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={responses[question.id] === option.value}
                    onChange={() => handleResponseChange(question.id, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

    </div>
    <div className = {styles.bottombar}>
    </div>
  </div>
  )
}