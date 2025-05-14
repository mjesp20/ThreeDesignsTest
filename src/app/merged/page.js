"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import surveyData from '@/data/sf12.json';

export default function FormPage() {
  // State management
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const startTimeRef = useRef(null);

  // Initialize timer and click tracking
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const handleClick = () => {
      setClickCount((prev) => prev + 1);
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const endTime = Date.now();
    const timeSpent = startTimeRef.current ? (endTime - startTimeRef.current) / 1000 : 0;
    setMetrics({
      timeSpent,
      clickCount,
    });
  };

  // Render results after submission
  if (submitted && metrics) {
    return (
      <div className={styles.container}>
        <div className={styles.topbar}>
          <h1 className={styles.heading}>Results</h1>
        </div>
        <div className={styles.content}>
          <div className={styles.resultsContainer}>
            <p className={styles.resultItem}>Time Spent: {metrics.timeSpent.toFixed(2)} seconds</p>
            <p className={styles.resultItem}>Total Clicks: {metrics.clickCount}</p>
          </div>
        </div>
        <div className={styles.endbar} />
      </div>
    );
  }

  // Render survey form
  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <h1 className={styles.heading}>{surveyData.title}</h1>
      </div>
      <div className={styles.content}>
        {surveyData.questions.map((question) => (
          <div className={styles.questionBox} key={question.id}>
            <h2 className={styles.questionText}>{question.text}</h2>
            <div className={styles.answerBoxes}>
              {question.options.map((option) => (
                <div className={styles.answerOption} key={option.value}>
                  <button
                    className={`${styles.answerButton} ${responses[question.id] === option.value ? styles.active : ''}`}
                    onClick={() => handleResponseChange(question.id, option.value)}
                    aria-label={option.label}
                  />
                  <div className={styles.answerText}>{option.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={Object.keys(responses).length !== surveyData.questions.length}
        >
          Submit
        </button>
      </div>
      <div className={styles.endbar} />
    </div>
  );
}