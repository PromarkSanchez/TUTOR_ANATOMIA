// src/InfoPanel.jsx
import React from 'react';

// Recibe la nueva función 'onClose'
export default function InfoPanel({ partData, onClose }) {
  const isVisible = partData !== null;

  return (
    <div style={panelStyle(isVisible)}>
      {isVisible && (
        <>
          {/* --- ¡NUEVO BOTÓN! --- */}
          <button style={closeButtonStyle} onClick={onClose}>×</button>
          
          <h2 style={titleStyle}>{partData.name}</h2>
          <p style={contentStyle}>{partData.description}</p>
        </>
      )}
    </div>
  );
}

// --- Estilos completos para copiar y pegar ---
const panelStyle = (isVisible) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '300px',
  maxHeight: 'calc(100vh - 40px)',
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  color: '#333',
  fontFamily: 'sans-serif',
  overflowY: 'auto',
  transition: 'opacity 0.4s ease, transform 0.4s ease',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
  visibility: isVisible ? 'visible' : 'hidden',
  zIndex: 1000,
});

const titleStyle = {
  margin: '0 0 10px 0',
  paddingBottom: '10px',
  borderBottom: '2px solid #007bff',
  fontSize: '22px',
};

const contentStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '28px',
  cursor: 'pointer',
  color: '#888',
  lineHeight: '1',
  padding: '0',
};