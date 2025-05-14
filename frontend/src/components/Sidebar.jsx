import React, { useState } from 'react';
import { Plus, TestTube, Settings, Bug, ChevronDown, MessageSquare } from 'lucide-react';

const Sidebar = ({ onNewChat, onSelectionChange }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = {
    'Test Planning': {
      icon: TestTube,
      tasks: [
        'Strategy Generator',
        'Case Generator',
        'Shift-Left Splitter',
        'Edge Case Helper',
        'Test Data Helper'
      ]
    },
    'Automation': {
      icon: Settings,
      tasks: [
        { category: 'Script Generator', items: ['Selenium Script', 'Cypress Script', 'Playwright Script'] },
        { category: 'FlowPilot', items: ['Browser Flow Executor'] }
      ]
    },
    'Bug Reporting': {
      icon: Bug,
      tasks: ['Bug Enhancer']
    }
  };

  const handleFeatureSelect = (feature) => {
    if (selectedFeature !== feature) {
      setSelectedTask(null);
      onSelectionChange(feature, null);
    }
    setSelectedFeature(selectedFeature === feature ? null : feature);
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    onSelectionChange(selectedFeature, task);
  };

  const sessions = [
    {
      id: 1,
      title: "Selenium vs Browserbase",
      date: "Yesterday"
    },
    {
      id: 2,
      title: "Agent Router API Setup",
      date: "Yesterday"
    },
    {
      id: 3,
      title: "Docker dependency issue",
      date: "Previous 7 Days"
    },
    {
      id: 4,
      title: "Flask to FastAPI Migration",
      date: "Previous 7 Days"
    },
    {
      id: 5,
      title: "Violence Content Request Denied",
      date: "Previous 7 Days"
    },
    {
      id: 6,
      title: "Screenshot Embedding in Docs",
      date: "Previous 7 Days"
    },
    {
      id: 7,
      title: "Regression Impact Analysis QA",
      date: "Previous 7 Days"
    }
  ];

  const groupedSessions = {
    "Yesterday": sessions.filter(s => s.date === "Yesterday"),
    "Previous 7 Days": sessions.filter(s => s.date === "Previous 7 Days"),
    "Previous 30 Days": sessions.filter(s => s.date === "Previous 30 Days")
  };

  const renderTasks = (tasks, feature) => {
    // Check if tasks is a simple array of strings
    if (tasks.every(task => typeof task === 'string')) {
      return (
        <div className="mt-1 ml-7 space-y-0.5">
          {tasks.map(task => (
            <button
              key={task}
              onClick={() => handleTaskSelect(task)}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors group
                ${selectedTask === task 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'} 
                rounded-md`}
            >
              <span className={`${selectedTask === task ? 'text-indigo-400' : 'group-hover:text-indigo-400'} transition-colors`}>
                {task}
              </span>
            </button>
          ))}
        </div>
      );
    }

    // Handle categorized tasks (like in Automation)
    return (
      <div className="mt-1 ml-7">
        {tasks.map(({ category, items }) => (
          <div key={category} className="mb-3">
            <div className="text-xs font-medium text-gray-500 px-3 mb-1">
              {category}
            </div>
            <div className="space-y-0.5">
              {items.map(item => (
                <button
                  key={item}
                  onClick={() => handleTaskSelect(item)}
                  className={`w-full text-left px-3 py-1.5 text-sm transition-colors group
                    ${selectedTask === item 
                      ? 'text-white bg-gray-700' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'} 
                    rounded-md`}
                >
                  <span className={`${selectedTask === item ? 'text-indigo-400' : 'group-hover:text-indigo-400'} transition-colors`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
        <h2 className="font-semibold flex items-center">
          <MessageSquare size={20} className="mr-2 text-indigo-400" />
          QA-T Chat
        </h2>
        <button 
          onClick={onNewChat}
          className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600 hover:text-indigo-400 transition-all duration-200"
          title="New Chat"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Features Section */}
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-400 mb-2 px-1">Select Feature</h3>
        <div className="space-y-1">
          {Object.entries(features).map(([feature, { icon: Icon }]) => (
            <div key={feature} className="space-y-1">
              <button
                onMouseEnter={() => setHoveredFeature(feature)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => handleFeatureSelect(feature)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedFeature === feature 
                    ? 'bg-gray-700 text-white shadow-lg shadow-black/20' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center">
                  <Icon 
                    size={18} 
                    className={`mr-2 transition-colors duration-200 ${
                      selectedFeature === feature || hoveredFeature === feature 
                        ? 'text-indigo-400' 
                        : ''
                    }`} 
                  />
                  {feature}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform duration-200 ${
                    selectedFeature === feature ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {selectedFeature === feature && renderTasks(features[feature].tasks, feature)}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="px-3 py-2">
        <div className="border-t border-gray-700/50"></div>
      </div>

      {/* Sessions Section - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedSessions).map(([date, sessions]) => (
          sessions.length > 0 && (
            <div key={date} className="mb-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500">
                {date}
              </div>
              {sessions.map(session => (
                <button
                  key={session.id}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800 text-sm text-gray-300 transition-colors group"
                >
                  <span className="group-hover:text-indigo-400 transition-colors">{session.title}</span>
                </button>
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 