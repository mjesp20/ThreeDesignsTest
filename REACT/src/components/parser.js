// SF12SurveyParser.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to parse and use the SF-12 survey data
 * @param {Object} surveyData - The SF-12 survey JSON data
 * @returns {Object} - Object containing the parsed survey data and utility functions
 */
export const useSF12Survey = (surveyData) => {
  const [responses, setResponses] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  
  // Initialize empty responses object
  useEffect(() => {
    if (!surveyData) return;
    
    const initialResponses = {};
    
    // Create empty response entries for each question and subquestion
    surveyData.questions.forEach(question => {
      if (question.subQuestions) {
        question.subQuestions.forEach(subQ => {
          initialResponses[subQ.id] = "";
        });
      } else {
        initialResponses[question.id] = "";
      }
    });
    
    setResponses(initialResponses);
  }, [surveyData]);
  
  // Handle response changes
  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Check if survey is complete
  useEffect(() => {
    if (Object.keys(responses).length === 0) return;
    
    const allAnswered = Object.values(responses).every(response => response !== "");
    setIsComplete(allAnswered);
  }, [responses]);
  
  // Calculate SF-12 scores
  const calculateScores = () => {
    if (!isComplete) return null;
    
    // This is a placeholder for the actual SF-12 scoring algorithm
    // The actual scoring is complex and requires specific weighting and normalization
    // You would need to implement the full algorithm based on SF-12 documentation
    
    return {
      physicalHealthScore: "Calculation not implemented", // Placeholder
      mentalHealthScore: "Calculation not implemented"    // Placeholder
    };
  };
  
  // Get flattened questions array for easier rendering
  const getFlattenedQuestions = () => {
    if (!surveyData) return [];
    
    const flattened = [];
    
    surveyData.questions.forEach(question => {
      if (question.subQuestions) {
        // For questions with subquestions, add the main question as a header
        flattened.push({
          ...question,
          isHeader: true
        });
        
        // Then add each subquestion
        question.subQuestions.forEach(subQ => {
          flattened.push({
            ...subQ,
            parentId: question.id
          });
        });
      } else {
        // For regular questions, just add them directly
        flattened.push(question);
      }
    });
    
    return flattened;
  };
  
  return {
    title: surveyData?.title || "",
    description: surveyData?.description || "",
    instructions: surveyData?.instructions || "",
    questions: surveyData?.questions || [],
    flattenedQuestions: getFlattenedQuestions(),
    responses,
    handleResponseChange,
    isComplete,
    calculateScores
  };
};

/**
 * Component to render the SF-12 survey
 * @param {Object} props - Component props
 * @param {Object} props.surveyData - The SF-12 survey JSON data
 * @param {Function} props.onComplete - Callback function when survey is completed
 */
const SF12Survey = ({ surveyData, onComplete }) => {
  const {
    title,
    description,
    instructions,
    flattenedQuestions,
    responses,
    handleResponseChange,
    isComplete,
    calculateScores
  } = useSF12Survey(surveyData);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete && onComplete) {
      const scores = calculateScores();
      onComplete(responses, scores);
    }
  };
  
  if (!surveyData) {
    return <div>Loading survey...</div>;
  }
  
  return (
    <div className="sf12-survey">
      <h1>{title}</h1>
      <p className="survey-description">{description}</p>
      <p className="survey-instructions">{instructions}</p>
      
      <form onSubmit={handleSubmit}>
        {flattenedQuestions.map((question, index) => (
          <div key={question.id} className={question.isHeader ? "question-header" : "question-item"}>
            {question.isHeader ? (
              <h3>{question.text}</h3>
            ) : (
              <div className="question">
                <p>{question.text}</p>
                <div className="options">
                  {question.options?.map((option) => (
                    <label key={option.value} className="option-label">
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
              </div>
            )}
          </div>
        ))}
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!isComplete}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SF12Survey;