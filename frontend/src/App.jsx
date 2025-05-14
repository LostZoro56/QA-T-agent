import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
}

export default App; 