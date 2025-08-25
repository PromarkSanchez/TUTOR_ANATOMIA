// src/useSpeechRecognition.js
import { useState, useEffect, useRef } from 'react';

// Declaramos 'recognition' fuera para que sea una única instancia
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'es-PE';
  recognition.interimResults = false;
}

// El hook ahora acepta un 'callback' como argumento
export const useSpeechRecognition = ({ onResultCallback }) => {
  const [isListening, setIsListening] = useState(false);
  // Usamos una ref para el callback para evitar que el useEffect se vuelva a ejecutar innecesariamente
  const onResultRef = useRef(onResultCallback);
  onResultRef.current = onResultCallback;

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResultRef.current) {
        onResultRef.current(transcript); // ¡Llamamos al callback con el resultado!
      }
    };
    
    const handleEnd = () => setIsListening(false);
    const handleError = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      setIsListening(false);
    };

    // Asignamos los manejadores de eventos
    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('end', handleEnd);
    recognition.addEventListener('error', handleError);

    // Función de limpieza
    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('end', handleEnd);
      recognition.removeEventListener('error', handleError);
    };
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  return {
    isListening,
    startListening,
    hasRecognitionSupport: !!recognition,
  };
};