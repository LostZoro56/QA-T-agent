import React, { useState } from 'react';
import Chat from './Chat';
import ChatInput from './ChatInput';
import TopNav from './TopNav';
import { MessageCircle, PanelLeftClose, PanelLeft, Download } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [sessions] = useState([
    { id: 1, name: 'Session 1', timestamp: '2 hours ago' },
    { id: 2, name: 'Session 2', timestamp: '5 hours ago' },
    { id: 3, name: 'Session 3', timestamp: 'Yesterday' },
  ]);

  const handleNewChat = () => {
    setMessages([]);
    setSelectedFeature(null);
    setSelectedTask(null);
  };

  const handleSelectionChange = (feature, task) => {
    setSelectedFeature(feature);
    setSelectedTask(task);
    setMessages([]);
  };

  const fetchResponse = async (requestData, isFileUpload = false, file = null) => {
    try {
      console.log('Sending request:', requestData);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Determine which endpoint to use based on whether we're uploading a file
      const endpoint = isFileUpload ? 'http://localhost:8000/generate-with-file' : 'http://localhost:8000/generate';
      
      let requestOptions;
      
      if (isFileUpload && file) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Add other request data to FormData
        Object.keys(requestData).forEach(key => {
          if (requestData[key] !== undefined) {
            formData.append(key, requestData[key]);
          }
        });
        
        requestOptions = {
          method: 'POST',
          body: formData,
          signal: controller.signal
        };
      } else {
        // Regular JSON request
        requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
          signal: controller.signal
        };
      }
      
      const response = await fetch(endpoint, requestOptions);

      clearTimeout(timeoutId);
      console.log('Received response status:', response.status);

      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format:\n${text}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Failed to generate response');
      }

      if (data.status === 'error') {
        throw new Error(data.message || 'Unknown error occurred');
      }

      return data;
    } catch (error) {
      console.error('Error fetching response:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds');
      }
      throw error;
    }
  };

    const handleFileUpload = async (file, content = '') => {
    if (!selectedFeature) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'Please select a feature (Test Case Generator or Selenium Script Generator) first.'
      }]);
      return;
    }

    // Determine display content for the message
    const displayContent = content ? content : `File upload: ${file.name}`;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: displayContent,
      hasFile: true,
      fileName: file.name
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Make sure to pass the content with the file upload
      const requestData = {
        requirement: content, // This will be combined with file content in the backend
        agentType: selectedFeature === 'Test Case Generator' ? 'test_generator' : 'selenium_generator',
        featureName: selectedFeature === 'Test Case Generator' ? `feature_${Date.now()}` : undefined,
        testName: selectedFeature === 'Selenium Script Generator' ? `test_${Date.now()}` : undefined,
        language: selectedFeature === 'Selenium Script Generator' ? selectedTask || 'python' : undefined,
        iterations: selectedFeature === 'Test Case Generator' ? 2 : undefined
      };

      console.log('Sending file upload with content:', content);
      const response = await fetchResponse(requestData, true, file);

      let messageContent = '';
      if (response.status === 'success') {
        messageContent = response.content;
      } else {
        messageContent = `Error: ${response.message || 'Failed to generate response'}`;
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: messageContent,
        isCode: selectedFeature === 'Selenium Script Generator' || selectedFeature === 'Test Case Generator',
        filename: response.filename
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error.message || 'Sorry, there was an error processing your file.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

    const handleSendMessage = async (content) => {
    if (!selectedFeature) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'Please select a feature (Test Case Generator or Selenium Script Generator) first.'
      }]);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const requestData = {
        requirement: content,
        agentType: selectedFeature === 'Test Case Generator' ? 'test_generator' : 'selenium_generator',
        featureName: selectedFeature === 'Test Case Generator' ? `feature_${Date.now()}` : undefined,
        testName: selectedFeature === 'Selenium Script Generator' ? `test_${Date.now()}` : undefined,
        language: selectedFeature === 'Selenium Script Generator' ? selectedTask || 'python' : undefined,
        iterations: selectedFeature === 'Test Case Generator' ? 2 : undefined
      };

      const response = await fetchResponse(requestData);

      let messageContent = '';
      if (response.status === 'success') {
        messageContent = response.content;
        // Remove file_path handling as we now use filename
      } else {
        messageContent = `Error: ${response.message || 'Failed to generate response'}`;
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: messageContent,
        isCode: selectedFeature === 'Selenium Script Generator' || selectedFeature === 'Test Case Generator',
        filename: response.filename
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error.message || 'Sorry, there was an error processing your request.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white relative">
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-3 left-3 z-50 p-1.5 rounded-lg bg-white shadow-sm hover:shadow border border-gray-100 hover:border-gray-200 transition-all"
      >
        {isPanelOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      </button>

      <div className={`w-64 border-r bg-[#0f172a] flex flex-col fixed left-0 top-0 bottom-0 transition-transform duration-300 ease-in-out shadow-md ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-blue-900/50 bg-[#0a192f] mt-12 flex items-center space-x-2">
          <MessageCircle className="h-4 w-4 text-blue-300" />
          <h2 className="text-sm font-medium text-blue-100">Sessions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center space-x-3 p-2.5 hover:bg-[#0a192f] rounded-lg cursor-pointer mb-1 transition-colors group">
              <div className="w-1 h-1 rounded-full bg-blue-400 group-hover:bg-blue-300"></div>
              <div>
                <div className="text-sm font-medium text-blue-200 group-hover:text-blue-50">{session.name}</div>
                <div className="text-xs text-blue-400 group-hover:text-blue-300">{session.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isPanelOpen ? 'ml-64' : 'ml-0'}`}>
        <TopNav onSelectionChange={handleSelectionChange} />
        <div className="flex-1 flex flex-col relative">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full px-4">
              <Chat messages={messages} isLoading={isLoading} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
            <div className="max-w-4xl mx-auto w-full px-4 py-4">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                onFileUpload={handleFileUpload}
                isLoading={isLoading} 
                selectedFeature={selectedFeature} 
                selectedTask={selectedTask} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
