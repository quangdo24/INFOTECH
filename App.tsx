import React, { Suspense, useState, Component, ErrorInfo, ReactNode } from 'react';
import { ArchitectScene } from './components/ArchitectScene';
import { UIOverlay } from './components/UIOverlay';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-red-50 text-red-900 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-4">{this.state.error?.message || 'Unknown error'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
            <pre className="mt-4 text-xs text-left bg-red-100 p-4 rounded overflow-auto max-h-64">
              {this.state.error?.stack}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// App acts as the layout container. 
// It holds the Canvas (background) and the Overlay (foreground).
export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  // Default to true for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}