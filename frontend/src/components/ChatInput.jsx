import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSendMessage, isLoading, onFileUpload }) => {
  
  const [message, setMessage] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      try {
        await onSendMessage(message);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        // You might want to show an error toast here
      }
    }
  };

  const handleFileClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file);
    }
  };
  
  const handleSendWithFile = async () => {
    if (selectedFile && !isLoading) {
      try {
        // Pass the message text along with the file
        await onFileUpload(selectedFile, message.trim() ? message : '');
        setMessage('');
        setSelectedFile(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error sending file:', error);
      }
    }
  };

  return (
    <div className="px-4 pb-6">
      <div className={`bg-white rounded-xl shadow-lg border-2 ${isLoading ? 'border-gray-200' : 'border-indigo-100 hover:border-indigo-200'} transition-colors`}>
        <form onSubmit={handleSubmit} className="relative">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf,.docx,.feature,.py,.js,.jsx,.ts,.tsx,.html,.css"
            disabled={isLoading}
          />
          
          {/* Plus button */}
          <button 
            type="button"
            onClick={handleFileClick}
            className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full ${isLoading ? 'text-gray-400' : 'text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50'} transition-colors`}
            disabled={isLoading}
            title="Upload a file"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          
          {/* File indicator - moved to top of input */}
          {selectedFile && (
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-indigo-50 px-3 py-1 border-b border-indigo-100 rounded-t-xl">
              <div className="flex items-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-indigo-700">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span className="text-xs font-medium text-indigo-800">
                  {selectedFile.name.length > 25 ? selectedFile.name.substring(0, 22) + '...' : selectedFile.name}
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-indigo-700 hover:text-indigo-900 p-1"
                title="Remove file"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {/* Input field */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              // On Enter key press without Shift key
              if (e.key === 'Enter' && !e.shiftKey && !isSmallScreen) {
                e.preventDefault(); // Prevent new line
                if ((message.trim() || selectedFile) && !isLoading) {
                  selectedFile ? handleSendWithFile() : handleSubmit(e);
                }
              }
            }}
            placeholder={isLoading ? 'Processing...' : `Type your message... ${!isSmallScreen ? '(Press Enter to send)' : ''}`}
            className={`w-full py-3 pl-12 pr-16 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 ${selectedFile ? 'mt-8' : ''}`}
            rows="1"
            disabled={isLoading}
          />

          {/* Send button */}
          <button
            type="submit"
            onClick={selectedFile ? handleSendWithFile : undefined}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${isLoading ? 'text-gray-400' : (message.trim() || selectedFile) ? 'text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50' : 'text-gray-400'} transition-colors`}
            disabled={isLoading || (!message.trim() && !selectedFile)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput; 