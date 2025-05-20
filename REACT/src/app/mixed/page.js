"use client"

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function MixedPage() {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [metrics, setMetrics] = useState(null);

  // Refs
  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null); // New ref for auto-scrolling
  const startTimeRef = useRef(null);
  
  // API endpoint
  const rasaUrl = 'http://localhost:5005/webhooks/rest/webhook';

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

  // Start conversation when component mounts
  useEffect(() => {
    sendMessageToRasa('Start');
  }, []);

  // Auto-scroll chat window when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessageToRasa = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const newUserMessage = { text: messageText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');

    try {
      const response = await fetch(rasaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user_id_123',
          message: messageText
        }),
      });

      if (!response.ok) {
        console.error('Error sending message to Rasa:', response.statusText);
        return;
      }

      const data = await response.json();

      const rasaMessages = data.map(msg => {
        if (msg.custom) {
          return {
            sender: 'bot',
            text: msg.custom.text,
            customType: msg.custom.type,
            customId: msg.custom.id,
            answeroptions: msg.custom.answeroptions,
            buttons: msg.buttons,
          };
        } else {
          return {
            sender: 'bot',
            text: msg.text,
            buttons: msg.buttons,
            customType: undefined,
            customId: undefined,
            answeroptions: undefined,
          };
        }
      });

      // Check if this is the end message
      const endMessageReceived = rasaMessages.some(msg =>
        msg.sender === "bot" && msg.text === 'Det var det sidste spørgsmål, tak for at svarer!'
      );

      if (endMessageReceived) {
        handleSubmit();
      }

      // Add bot messages to chat
      setMessages(prevMessages => [...prevMessages, ...rasaMessages]);

    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessageToRasa(inputMessage);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
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
        <div className={styles.endbar}></div>
      </div>
    );
  }

  // Render mixed interface with both form elements and chat
  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <h1 className={styles.heading}>Chatbot alternativ</h1>
      </div>
      
      <div className={styles.content}>
        <div className={styles.chatwindow} ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
              <p>{msg.text}</p>
              
              {/* Render answer options if this is a question message */}
              {msg.customType === 'question' && msg.answeroptions && 
                typeof msg.answeroptions === 'number' && msg.answeroptions > 0 && (
                <div className={styles.answerboxes}>
                  {Array.from({ length: msg.answeroptions }, (_, i) => i + 1).map(optionValue => (
                    <div key={optionValue} className={styles.answeroptions}>
                      <button 
                        className={styles.answeroption} 
                        onClick={() => sendMessageToRasa(`${optionValue}`)}
                      />
                      <div className={styles.answertext}>{optionValue}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Render buttons if they exist and it's not an answer options message */}
              {!(msg.customType === 'question' && msg.answeroptions && 
                typeof msg.answeroptions === 'number' && msg.answeroptions > 0) && 
                msg.buttons && msg.buttons.map((button, btnIndex) => (
                <button
                  key={btnIndex}
                  onClick={() => sendMessageToRasa(button.payload)}
                  className={styles.answeroption}
                />
              ))}
            </div>
          ))}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className={styles.inputcontent}>
        <div className={styles.inputArea}>
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      

    </div>
  );
}