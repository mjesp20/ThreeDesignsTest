"use client";
import styles from './page.module.css'
import { useState } from 'react';
import surveyData from '@/data/sf12.json';

export default function HomePage() {
  return(
  <div>
    <div className={styles.buttons}>
      <a className={styles.button} href="/form">Form</a>
      <a className={styles.button} href="/mixed">Mixed</a>
      <a className={styles.button} href="/chatbot">CA</a>
    </div>
  </div>
  )
}