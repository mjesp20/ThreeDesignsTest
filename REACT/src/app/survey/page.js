// src/app/sf12-survey/page.js

"use client";
import { useState } from 'react';
import surveyData from '@/data/sf12.json';

export default function SF12SurveyPage() {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey responses:", responses);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Thank you for completing the survey!</h1>
        <pre>{JSON.stringify(responses, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{surveyData.title}</h1>
      <p className="mb-4">{surveyData.description}</p>
      <p className="mb-6 italic">{surveyData.instructions}</p>
      
      <form onSubmit={handleSubmit}>
        {surveyData.questions.map((question) => (
          <div key={question.id} className="mb-6">
            <p className="font-medium mb-2">{question.text}</p>
            
            {question.subQuestions ? (
              // Handle questions with subquestions
              <div className="ml-4 space-y-4">
                {question.subQuestions.map((subQ) => (
                  <div key={subQ.id} className="mb-4">
                    <p className="mb-2">{subQ.text}</p>
                    <div className="space-y-2">
                      {subQ.options.map((option) => (
                        <label key={option.value} className="block">
                          <input
                            type="radio"
                            name={subQ.id}
                            value={option.value}
                            checked={responses[subQ.id] === option.value}
                            onChange={() => handleResponseChange(subQ.id, option.value)}
                            className="mr-2"
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
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option.value} className="block">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={responses[question.id] === option.value}
                      onChange={() => handleResponseChange(question.id, option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}