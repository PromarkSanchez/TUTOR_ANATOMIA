// src/App.jsx
import React, { useState, useEffect } from 'react';
import Canvas3D from './Canvas3D';
import UI from './UI';
import InfoPanel from './InfoPanel';

// --- HOOK PERSONALIZADO (Se queda aquí fuera, es reutilizable) ---
const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};


export default function App() {
  const { height } = useWindowSize(); // Medimos la altura dentro del componente

  // Todos los estados y funciones que ya tenías...
  const [selectedPartInfo, setSelectedPartInfo] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  const anatomyKeywordMap = {
    // ---- Válvulas Cardiacas ----
    "válvula aórtica": ["aortic_valve_01_jnt21", "Válvula Aórtica", "Controla la salida de sangre del ventrículo izquierdo a la aorta. Es una de las válvulas semilunares."],
    "válvula mitral": ["left_mitral_valve_jnt15", "Válvula Mitral", "También llamada válvula bicúspide, regula el flujo sanguíneo de la aurícula izquierda al ventrículo izquierdo."],
    "válvula tricúspide": ["right_tricuspid_valve_jnt24", "Válvula Tricúspide", "Regula el flujo de sangre entre la aurícula derecha y el ventrículo derecho. Tiene tres valvas."],
    "válvula pulmonar": ["left_pulmonary_valve_jnt11", "Válvula Pulmonar", "Controla el flujo de sangre del ventrículo derecho a las arterias pulmonares, que la llevan a los pulmones."],

    // ---- Cámaras del Corazón ----
    "aurícula izquierda": ["left_atrium_jnt13", "Aurícula Izquierda", "Recibe sangre rica en oxígeno desde los pulmones a través de las venas pulmonares."],
    "aurícula derecha": ["right_atrium_jnt6", "Aurícula Derecha", "Recibe sangre con bajo nivel de oxígeno que regresa del cuerpo a través de las venas cavas."],
    // Nota: Los ventrículos no tienen un hueso propio en este modelo, están controlados por 'cardiac_muscle'
    "ventrículo": ["cardiac_muscle_jnt7", "Ventrículos (Músculo)", "Las cámaras inferiores del corazón. El ventrículo derecho bombea sangre a los pulmones y el izquierdo al resto del cuerpo."],
    
    // ---- Tejidos y Estructuras Principales ----
    "músculo cardíaco": ["cardiac_muscle_jnt7", "Músculo Cardíaco (Miocardio)", "El miocardio es el tejido muscular del corazón, responsable de las potentes contracciones que bombean la sangre."],
    "miocardio": ["cardiac_muscle_jnt7", "Músculo Cardíaco (Miocardio)", "El miocardio es el tejido muscular del corazón, responsable de las potentes contracciones que bombean la sangre."],
    
    // ---- Raíz del Modelo ----
    // Este es útil para seleccionar el corazón completo
    "corazón completo": ["heart_jnt5", "Corazón Completo", "Una vista general del corazón, mostrando sus cuatro cámaras, válvulas y los principales vasos sanguíneos que entran y salen."],
    "corazón": ["heart_jnt5", "Corazón Completo", "Una vista general del corazón, mostrando sus cuatro cámaras, válvulas y los principales vasos sanguíneos que entran y salen."],
  };


  const handleCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    let foundPart = null;
    const matchingKeyword = Object.keys(anatomyKeywordMap)
      .filter(keyword => lowerCommand.includes(keyword))
      .sort((a, b) => b.length - a.length)[0];
    if (matchingKeyword) {
      const [boneName, name, description] = anatomyKeywordMap[matchingKeyword];
      foundPart = { boneName, name, description };
    } else {
      foundPart = { boneName: null, name: "Comando no reconocido", description: "Intenta con una parte anatómica válida." };
    }
    setSelectedPartInfo(foundPart);
  };
  
  const toggleRotation = () => setIsRotating(!isRotating);
  const toggleAnimation = () => setIsAnimating(!isAnimating);
  const handleClosePanel = () => setSelectedPartInfo(null);

  // --- ¡LA CORRECCIÓN! MOVEMOS LOS ESTILOS AQUÍ DENTRO ---
  // Ahora SÍ tienen acceso a la variable 'height'.
  const appStyles = {
    height: `${height}px`, // ¡Ahora esto funciona!
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1d212b',
    overflow: 'hidden',
  };

  const headerStyles = { flex: '0 0 auto', padding: '10px 0', textAlign: 'center', color: 'white' };
  const mainContentStyles = { flex: '1 1 auto', position: 'relative', minHeight: 0 };
  const footerStyles = { flex: '0 0 auto' };
  // --- FIN DE LA CORRECCIÓN ---

  return (
    <div style={appStyles}>
      <header style={headerStyles}>
        <h1>Demo Interactivo - Hered-IA</h1>
      </header>
      
      <main style={mainContentStyles}>
        <Canvas3D
          selectedBoneInfo={selectedPartInfo}
          isRotating={isRotating}
          isAnimating={isAnimating}
        />
        <InfoPanel partData={selectedPartInfo} onClose={handleClosePanel} />
      </main>

      <footer style={footerStyles}>
        <UI
          onCommand={handleCommand}
          isRotating={isRotating}
          toggleRotation={toggleRotation}
          isAnimating={isAnimating}
          toggleAnimation={toggleAnimation}
        />
      </footer>
    </div>
  );
}