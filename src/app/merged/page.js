"use client";

import styles from './page.module.css'
import { useEffect, useRef, useState } from 'react';
import surveyData from '@/data/sf12.json';

export default function FormPage() {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [metrics, setMetrics] = useState(null); // remove the type annotation
  const startTimeRef = useRef(null);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
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

  const handleSubmit = () => {
    setSubmitted(true);
    const endTime = Date.now();
    const timeSpent = startTimeRef.current ? (endTime - startTimeRef.current) / 1000 : 0;

    setMetrics({
      timeSpent,
      clickCount,
    });

    
  };

  return (
    <div>
      <div className={styles.topbar}>
        <h1 className={styles.heading}>{surveyData.title}</h1>
      </div>
      <div className={styles.content}>


        <div className={styles.content}>
          {surveyData.questions.map((question) => (
            <div className={styles.questionbox} key={question.id}>
              <div className={styles.questiondesc}>
                {question.text}
              </div>

              {question.subQuestions ? (
                // Handle questions with subquestions
                question.subQuestions.map((subQ) => (
                  <div key={subQ.id} className={styles.div}>
                    <div className={styles.questiondesc}>
                      {subQ.text}
                    </div>
                    <div className={styles.answerboxes}>
                      {subQ.options.map((option, answerIndex) => (
                        <div key={option.value}>
                          <button
                            className={`${styles.answeroption} ${responses[subQ.id] === option.value ? styles.active : ''
                              }`}
                            onClick={() => handleResponseChange(subQ.id, option.value)}
                          >

                          </button>
                          <div> {option.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Handle questions with direct options
                <div className={styles.answerboxes}>
                  {question.options.map((option, answerIndex) => (
                    <div key={option.value}>
                      <button
                        
                        className={`${styles.answeroption} ${responses[question.id] === option.value ? styles.active : ''
                          }`}
                        onClick={() => handleResponseChange(question.id, option.value)}
                      >
                      </button>
                      <div className={styles.answeroptiontext}>{option.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            className={styles.submitbutton}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className={styles.endbar}>
      </div>
    </div>

    
  );
}