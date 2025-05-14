import React from 'react';
import { FileText, FileCode, Download, User, File, FileType } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  const handleDownload = () => {
    if (!message.filename) return;
    
    const downloadUrl = `http://localhost:8000/download/${message.filename}`;
    window.open(downloadUrl, '_blank');
  };

  const renderFileIcon = () => {
    if (!message.fileName) return null;
    
    const extension = message.fileName.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText size={16} className="mr-1 text-red-500" />;
    } else if (['py', 'js', 'jsx', 'ts', 'tsx', 'html', 'css'].includes(extension)) {
      return <FileCode size={16} className="mr-1 text-blue-500" />;
    } else if (['docx', 'doc'].includes(extension)) {
      return <FileText size={16} className="mr-1 text-blue-500" />;
    } else if (extension === 'feature') {
      return <FileType size={16} className="mr-1 text-green-500" />;
    } else if (extension === 'txt') {
      return <FileText size={16} className="mr-1 text-gray-500" />;
    }
    
    return <File size={16} className="mr-1 text-gray-500" />;
  };

  return (
    <div className="mb-3 px-4">
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            {isUser ? (
              <User size={20} className="text-gray-500" />
            ) : (
              <img 
                src="/images/agent-avatar.png" 
                alt="QA-T agent"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className={`mx-2 flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}>
            <div className="text-xs text-gray-600 mb-0.5">
              {isUser ? 'You' : 'QA-T agent'}
            </div>
            
            {/* User message */}
            {isUser ? (
              <div className="px-3 py-2 rounded-xl bg-qa-gray text-gray-800 max-w-full break-words">
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                {message.hasFile && message.fileName && (
                  <div className="mt-2 flex items-center p-2 bg-gray-100 rounded-md">
                    {renderFileIcon()}
                    <span className="text-xs font-medium text-gray-700 truncate">{message.fileName}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Agent message */
              <div className="px-3 py-2 rounded-xl bg-white border text-gray-800 w-full">
                <div className="space-y-4 w-full">
                  {/* Code block with horizontal scroll */}
                  <div 
                    className="overflow-x-auto rounded-md" 
                    style={{ maxWidth: '100%' }}
                  >
                    <SyntaxHighlighter
                      language="python"
                      style={oneLight}
                      customStyle={{
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        margin: 0,
                        width: 'max-content',
                        minWidth: '100%'
                      }}
                      wrapLongLines={false}
                      showLineNumbers={true}
                    >
                      {message.content}
                    </SyntaxHighlighter>
                  </div>
                  
                  {/* Download section - not scrollable */}
                  {message.filename && (
                    <div className="flex flex-wrap items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg gap-2 w-full">
                      <div className="flex items-center space-x-2 overflow-hidden max-w-[calc(100%-130px)]">
                        <FileCode size={18} className="text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-blue-700 truncate">{message.filename}</span>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 