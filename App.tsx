import React, { Suspense, useState } from 'react';
import { ArchitectScene } from './components/ArchitectScene';
import { UIOverlay } from './components/UIOverlay';

// App acts as the layout container. 
// It holds the Canvas (background) and the Overlay (foreground).
export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  // Default to true for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden transition-colors duration-700 ease-in-out ${
        isDarkMode ? 'bg-arch-900' : 'bg-arch-100'
      }`}
    >
      {/* 3D Scene Layer - Fixed Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="flex items-center justify-center h-full text-arch-500">INITIALIZING...</div>}>
          <ArchitectScene activeSection={activeSection} isDarkMode={isDarkMode} />
        </Suspense>
      </div>

      {/* UI Layer - Absolute Positioning on top */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <UIOverlay 
          activeSection={activeSection} 
          onNavigate={setActiveSection} 
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
      </div>
    </div>
  );
}