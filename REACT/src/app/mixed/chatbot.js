"use client"

import Link from "next/link";
import styles from './page.module.css'
import { useState, useEffect, useRef } from "react";

  function Chatbot(){
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [metrics, setMetrics] = useState(null);
 
  const startTimeRef = useRef(null);


    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const rasaUrl = 'http://192.168.117.37:5005/webhooks/rest/webhook';

    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const chatWindowRef= useRef(null);

    const sendMessageToRasa = async (messageText) =>{
      if (!messageText.trim()) return;

      const newUserMessage = {text: messageText, sender:'user'};
      setMessages(prevMessages => [...prevMessages, newUserMessage])
      setInputMessage('');

      try{
        const response =await fetch(rasaUrl, {
          method: 'POST',
          headers: {
            'content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: 'user_id_123',
            message: messageText
          }),

        });

        if(!response.ok){
          console.error('Error sending message to Rasa:', response.statusText);
          return;
        }

        const data = await response.json();
        
        const rasaMessage = data.map(msg => {
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
        
        const endMessageReceived = rasaMessage.some(msg =>
            msg.sender === "bot" && msg.text === 'Det var det sidste spørgsmål, tak for at svarer!'
        );

        if (endMessageReceived){
          handleSubmit();
        }


        setMessages(prevMessages => [...prevMessages, ...rasaMessage]);
  
      } catch (error)
      {
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
    if (event.key === 'Enter'){
      handleSendMessage()
    }
  };

  useEffect(() => {
        sendMessageToRasa('Hej'); 
    }, []); 

  useEffect(() => {
      if (chatWindowRef.current) {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
  }, [messages]);

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


  const handlebuttonclick = (buttonPayLoad) => {
    sendMessageToRasa(buttonPayLoad);
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

  if (submitted && metrics) {
    return (
      <div class= "mt-4">
        <h1>Results</h1>
        <p>Time Spent: {metrics.timeSpent.toFixed(2)} seconds</p>
        <p>Total Clicks: {metrics.clickCount}</p>
      </div>
    );
  }
    return (
      <div>
        <div className= {styles.topbar}>
          <h1 className= {styles.heading}>MixedPage</h1></div>

            

        <div className= { styles.content}>

          <div className= {styles.chatwindow} ref={chatWindowRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]} ` }>
                <p>{msg.text}</p>

                {msg.customType === 'question' && msg.answeroptions && typeof msg.answeroptions === 'number' && msg.answeroptions > 0 && (
                  <div className={styles.answerboxes}>
                    {Array.from({ length: msg.answeroptions }, (_, i) => i + 1).map(optionValue => (                      
                      <button className={`${styles.answeroption}${
                        selectedAnswer === `${optionValue}` ? styles.active : ''
                      }`} key={optionValue}
                      onClick={() => sendMessageToRasa(`${optionValue}`)}
                      >
                       
                      </button>


                    ))}
                  </div>






                )}
   
                {!(msg.customType === 'question' && msg.answeroptions && typeof msg.answeroptions === 'number' && msg.answeroptions > 0) && msg.buttons && msg.buttons.map((button, btnIndex) => (
                  <button
                    key={btnIndex}
                    onClick={sendMessageToRasa(button.buttonPayLoad)}
                    className={styles.answeroption}
                  >
                  </button>
                ))}

             
                
              </div>
            ))}

               
               



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
export default Chatbot
  