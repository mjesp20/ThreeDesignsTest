"use client"

import Link from "next/link";
import styles from './page.module.css'
import { useState } from "react";

export default function FormPage() {
  /*const [buttonStates, setButtonState] = useState(
    Array(7).fill(null).map(() => Array(5).fill(false))
  );*/

  const[selectedAnswer, setSelectedAnswer] = useState(
    Array(7).fill(null));


  const handlebuttonclick = (index, answerindex) => {
    const newSelectedAnswer = [...selectedAnswer];
    newSelectedAnswer[index] = answerindex;
    setSelectedAnswer(newSelectedAnswer);
  
  }


    return (
      <div>
        <div className = {styles.topbar}>
        <h1 className= {styles.heading}> Health Questionnaire</h1></div>
        
        <div className= {styles.content}>

        {[...Array(7)].map((_, index) => (
                <div className= {styles.questionbox} key={index}> 
                <div className= {styles.questiondesc}>
                    How are you feeling?
                </div>
                <div className= {styles.answerboxes}>
    
                {[...Array(5)].map((_, answerindex) => (
                    <button className={`${styles.answeroption} ${ 
                      selectedAnswer[index]=== answerindex ? styles.active :''

                    }`}key={answerindex}
                    onClick={() => handlebuttonclick(index,answerindex)}
                    >
                      
                    </button>
                ))}
    
                </div>
            </div>
            ))}

       
        
        
        </div>

        <div className= {styles.endbar}>
          <button className= {styles.nextarrow}>

          </button>
          </div>
        
        {/*<div className = {styles.bottombar}></div>*/}

        
      </div>
    );
  }

 