"use client"

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css"

export default function ChatPage() {

    const [responses, setResponses] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [metrics, setMetrics] = useState(null);

    const startTimeRef = useRef(null);


    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const rasaUrl = 'http://localhost:5005/webhooks/rest/webhook';

    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const chatWindowRef = useRef(null);

    const sendMessageToRasa = async (messageText) => {
        if (!messageText.trim()) return;

        const newUserMessage = { text: messageText, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, newUserMessage])
        setInputMessage('');

        try {
            const response = await fetch(rasaUrl, {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
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

            if (endMessageReceived) {
                handleSubmit();
            }


            setMessages(prevMessages => [...prevMessages, ...rasaMessage]);

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
            <div class="mt-4">
                <h1>Results</h1>
                <p>Time Spent: {metrics.timeSpent.toFixed(2)} seconds</p>
                <p>Total Clicks: {metrics.clickCount}</p>
            </div>
        );
    }
    return (

        <div>
            <div className={styles.topbar}>
                <h1 className={styles.heading}>Questionnaire</h1></div>

            <div className={styles.content}>

                <div className={styles.chatwindow}></div>

                <div>
                    <div className={styles.topbar}>
                        <h1 className={styles.heading}>Health Chatbot</h1></div>
                    <div className={styles.content}>
                        <div className={styles.chatwindow}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`${styles.message} ${styles[msg.sender]} `}>
                                    <p>{msg.text}</p>
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
            </div>



        </div>
    );
}
