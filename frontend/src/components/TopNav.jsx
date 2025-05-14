import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TopNav = ({ onSelectionChange }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleFeatureSelect = (feature) => {
    if (feature === 'Selenium Script Generator') {
      setShowLanguageDropdown(true);
    } else {
      setShowLanguageDropdown(false);
      setSelectedLanguage(null);
      setSelectedFeature(feature);
      onSelectionChange(feature, null);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    setSelectedFeature('Selenium Script Generator');
    onSelectionChange('Selenium Script Generator', language);
  };

  return (
    <div className="w-full border-b bg-gradient-to-r from-gray-50 to-white shadow-sm">
      <div className="w-full pl-16 pr-6 py-3 flex items-center">
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">QA-T</h1>
        <div className="flex items-center space-x-6 ml-10">
          <button
            onClick={() => handleFeatureSelect('Test Case Generator')}
            className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${selectedFeature === 'Test Case Generator' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Test Case Generator
          </button>
          <div className="relative">
            <button
              onClick={() => handleFeatureSelect('Selenium Script Generator')}
              className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium flex items-center ${selectedFeature === 'Selenium Script Generator' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Selenium Script Generator
              <ChevronDown className="ml-1 h-4 w-4 text-current" />
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1">
                <button
                  onClick={() => handleLanguageSelect('python')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Python + Selenium
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default TopNav;
