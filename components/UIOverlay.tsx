import React, { useState } from 'react';

interface UIOverlayProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ activeSection, onNavigate, isDarkMode, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const menuItems = ['HOME', 'PROJECTS', 'TOOLS', 'CONTACT'];
  
  // Dynamic text classes
  const textPrimary = isDarkMode ? 'text-arch-100' : 'text-arch-900';
  const textSecondary = isDarkMode ? 'text-arch-500' : 'text-arch-500'; // Keep middle grey for secondary
  const borderPrimary = isDarkMode ? 'border-arch-100' : 'border-arch-900';
  const borderSecondary = isDarkMode ? 'border-arch-800' : 'border-arch-300';
  const cardBg = isDarkMode ? 'bg-arch-900/80' : 'bg-white/80';
  const mobileMenuBg = isDarkMode ? 'bg-arch-900' : 'bg-arch-100';

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 md:p-12 pointer-events-none select-none relative">
      
      {/* Header / Nav */}
      <header className="flex justify-between items-start pointer-events-auto z-50">
        <div className="flex flex-col gap-1">
          <h1 className={`text-2xl font-display font-bold tracking-widest transition-colors duration-500 ${textPrimary}`}>
            Q_INFOTECH
          </h1>
          <span className="text-xs font-sans text-arch-500 tracking-widest uppercase">
            EST. 2025 - TECH/CYBER
          </span>
        </div>

        <div className="flex flex-col items-end gap-6">
            {/* Theme Toggle - Desktop */}
            <button 
                onClick={toggleTheme}
                className={`hidden md:block text-[10px] font-bold tracking-widest uppercase border px-3 py-1 rounded-full transition-all duration-300 hover:opacity-70 ${isDarkMode ? 'border-arch-500 text-arch-100' : 'border-arch-900 text-arch-900'}`}
            >
                {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex flex-col items-end gap-2">
            {menuItems.map((item) => (
                <button 
                key={item}
                onClick={() => onNavigate(item.toLowerCase())}
                className={`text-xs font-bold tracking-[0.2em] transition-all duration-300 hover:opacity-100 opacity-60
                    ${activeSection === item.toLowerCase() ? `${textPrimary} border-b ${borderPrimary} opacity-100` : textSecondary}
                `}
                >
                {item}
                </button>
            ))}
            </nav>

            {/* Mobile Hamburger / Close Button */}
            <button 
              className={`md:hidden ${textPrimary} transition-opacity hover:opacity-70 p-2`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? (
                 /* Close Icon */
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
              ) : (
                 /* Hamburger Icon */
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                 </svg>
              )}
            </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center gap-8 ${mobileMenuBg} pointer-events-auto md:hidden transition-colors duration-500`}>
           {menuItems.map((item) => (
                <button 
                key={item}
                onClick={() => {
                  onNavigate(item.toLowerCase());
                  setMobileMenuOpen(false);
                }}
                className={`text-2xl font-display font-bold tracking-[0.2em] transition-all duration-300 
                    ${activeSection === item.toLowerCase() ? textPrimary : textSecondary}
                `}
                >
                {item}
                </button>
            ))}
            <div className="mt-8">
               <button 
                  onClick={() => {
                    toggleTheme();
                  }}
                  className={`text-xs font-bold tracking-widest uppercase border px-4 py-2 rounded-full ${isDarkMode ? 'border-arch-500 text-arch-100' : 'border-arch-900 text-arch-900'}`}
              >
                  {isDarkMode ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}
              </button>
            </div>
        </div>
      )}

      {/* Main Dynamic Content Area */}
      <main className={`flex-grow flex items-center w-full pointer-events-none ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        {activeSection === 'home' && (
          <div className="relative">
             <h2 className={`text-5xl md:text-8xl font-display font-light leading-tight transition-colors duration-700 ${textPrimary} opacity-90`}>
              WEB PAGE <br/>
              COMING <br/>
              <span className="font-bold">SOON</span>
            </h2>
            <div className={`w-24 h-1 mt-6 transition-colors duration-700 ${isDarkMode ? 'bg-arch-100' : 'bg-arch-900'}`} />
            <p className={`mt-4 max-w-sm text-sm font-sans leading-relaxed backdrop-blur-sm p-2 rounded transition-colors duration-700 ${isDarkMode ? 'text-arch-300 bg-arch-900/30' : 'text-arch-800 bg-arch-100/50'}`}>
              Constructing the digital infrastructure for the future.
              Check back soon for updates.
            </p>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="w-full flex items-center justify-start pointer-events-auto">
             <h3 className={`text-4xl font-display font-light ${textPrimary} border-l-4 ${borderPrimary} pl-6`}>
               COMING SOON....
             </h3>
          </div>
        )}

        {activeSection === 'tools' && (
           <div className="w-full flex items-center justify-start pointer-events-auto">
              <h3 className={`text-4xl font-display font-light ${textPrimary} border-l-4 ${borderPrimary} pl-6`}>
                COMING SOON....
              </h3>
           </div>
        )}
        
        {activeSection === 'contact' && (
           <div className={`pointer-events-auto ${cardBg} backdrop-blur-md p-8 max-w-md border ${borderSecondary} transition-colors duration-500`}>
              <h3 className={`text-xl font-display font-bold mb-6 ${textPrimary}`}>GET IN TOUCH</h3>
              <div className={`space-y-4 text-sm font-sans ${isDarkMode ? 'text-arch-300' : 'text-arch-800'}`}>
                <div className={`flex justify-between border-b ${borderSecondary} pb-2`}>
                  <span>LINKEDIN</span>
                  <a href="https://www.linkedin.com/in/doq18" target="_blank" rel="noopener noreferrer" className="hover:text-arch-500 transition-colors uppercase">
                    @doq18
                  </a>
                </div>
                <div className={`flex justify-between border-b ${borderSecondary} pb-2`}>
                  <span>GITHUB</span>
                  <a href="https://github.com/quangdo24" target="_blank" rel="noopener noreferrer" className="hover:text-arch-500 transition-colors uppercase">
                    @here
                  </a>
                </div>
              </div>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="flex justify-end items-end text-[10px] md:text-xs font-mono text-arch-500 uppercase tracking-widest pointer-events-auto z-10">
        <div className="text-right">
          <p>© 2025 Q_INFOTECH SYSTEMS</p>
        </div>
      </footer>
    </div>
  );
};