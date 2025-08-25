// src/UI.jsx
import React from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useState, useEffect } from 'react';

// --- Iconos SVG (Reutilizables) ---
const MicIcon = ({ color = 'white' }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg> );
const PauseIcon = ({ color = 'white' }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> );
const PlayIcon = ({ color = 'white' }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> );

// --- Hook para detectar el tamaño de la pantalla ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

export default function UI({ onCommand, isRotating, toggleRotation, isAnimating, toggleAnimation }) {
  const isMobile = useIsMobile();
  const [inputText, setInputText] = useState('');
  const handleSpeechResult = (transcript) => {
    setInputText(transcript);
    onCommand(transcript);
  };
  const { isListening, startListening, hasRecognitionSupport } = useSpeechRecognition({ onResultCallback: handleSpeechResult });
  const handleManualSend = () => { if (inputText.trim()) { onCommand(inputText); setInputText(''); } };
  const handleKeyPress = (e) => { if (e.key === 'Enter') handleManualSend(); };

  // --- Renderizado Condicional: Dos layouts diferentes ---
  if (isMobile) {
    // LAYOUT VERTICAL PARA MÓVIL
    return (
      <div style={uiContainerMobileStyle}>
        <div style={controlsGroupMobileStyle}>
          <button style={controlButtonMobileStyle} onClick={toggleAnimation}>{isAnimating ? <PauseIcon /> : <PlayIcon />} Animación</button>
          <button style={controlButtonMobileStyle} onClick={toggleRotation}>{isRotating ? <PauseIcon /> : <PlayIcon />} Giro</button>
        </div>
        <div style={inputGroupStyle}>
          <input style={inputStyleMobile} type="text" placeholder="Escribe o habla..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={handleKeyPress}/>
          <button style={buttonStyle} onClick={handleManualSend}>Enviar</button>
          {hasRecognitionSupport && <button style={{ ...micButtonStyle, backgroundColor: isListening ? '#dc3545' : '#28a745' }} onClick={startListening} disabled={isListening}> {isListening ? '...' : <MicIcon />} </button>}
        </div>
      </div>
    );
  } else {
    // LAYOUT HORIZONTAL PARA ESCRITORIO
    return (
      <div style={uiContainerDesktopStyle}>
        <div style={controlsGroupDesktopStyle}>
          <button style={controlButtonDesktopStyle} onClick={toggleAnimation}>{isAnimating ? <PauseIcon /> : <PlayIcon />} <span style={{ marginLeft: '8px' }}>Animación</span></button>
          <button style={controlButtonDesktopStyle} onClick={toggleRotation}>{isRotating ? <PauseIcon /> : <PlayIcon />} <span style={{ marginLeft: '8px' }}>Giro</span></button>
        </div>
        <div style={inputGroupStyle}>
          <input style={inputStyleDesktop} type="text" placeholder="Escribe o presiona el micrófono..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={handleKeyPress}/>
          <button style={buttonStyle} onClick={handleManualSend}>Enviar</button>
          {hasRecognitionSupport && <button style={{ ...micButtonStyle, backgroundColor: isListening ? '#dc3545' : '#28a745' }} onClick={startListening} disabled={isListening}> {isListening ? '...' : <MicIcon />} </button>}
        </div>
      </div>
    );
  }
}

// --- ESTILOS ---
// Estilos comunes
const baseButtonStyles = { height: '45px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s, transform 0.1s' };
const buttonStyle = { ...baseButtonStyles, padding: '0 18px', backgroundColor: '#007bff', color: 'white', fontSize: '1rem', flexShrink: 0 };
const micButtonStyle = { ...baseButtonStyles, width: '45px', flexShrink: 0 };
const inputGroupStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' };

// Estilos para Escritorio
const uiContainerDesktopStyle = { padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' };
const controlsGroupDesktopStyle = { display: 'flex', gap: '0.75rem' };
const inputStyleDesktop = { padding: '10px 14px', border: '1px solid #555', borderRadius: '8px', backgroundColor: '#f0f0f0', fontSize: '1rem', width: '300px' };
const controlButtonDesktopStyle = { ...baseButtonStyles, padding: '0 18px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' };

// Estilos para Móvil
const uiContainerMobileStyle = { padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' };
const controlsGroupMobileStyle = { display: 'flex', gap: '0.75rem', width: '100%' };
const inputStyleMobile = { padding: '10px 14px', border: '1px solid #555', borderRadius: '8px', backgroundColor: '#f0f0f0', fontSize: '1rem', flexGrow: 1, minWidth: 0 };
const controlButtonMobileStyle = { ...baseButtonStyles, flexGrow: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' };