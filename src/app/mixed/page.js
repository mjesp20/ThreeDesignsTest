"use client"

import Link from "next/link";
import styles from './page.module.css'
import { useState } from "react";

export default function MixedPage() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handlebuttonclick = (answerindex) => {
    const uniqueId = `${answerindex}`;
    setSelectedAnswer(uniqueId);
  
  }

    return (
      <div>
        <div className= {styles.topbar}>
          <h1 className= {styles.heading}>MixedPage</h1></div>

          <div className= { styles.content}>

            {[...Array(1)].map((_, index) => (
          <div className= {styles.AImessage} key={index}> 

          </div>
        ))}

        {[...Array(1)].map((_, personindex) => (
          <div className= {styles.personMessage} key={personindex}> 

          </div>
        ))}
          
          <div className= {styles.answerboxes}>
            {[...Array(5)].map((_, answerindex)=>(
              <button className={`${styles.answeroption} ${ 
                selectedAnswer === `${answerindex}` ? styles.active: ''
              }`} key={answerindex}
              onClick={() =>handlebuttonclick(answerindex)}
              >

              </button>


            ))}


          </div>

          </div>
      </div>
    );
  }