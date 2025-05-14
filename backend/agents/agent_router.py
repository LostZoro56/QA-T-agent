import re
from .qa_agent import QAAgent
from .test_generator_agent import TestGeneratorAgent
from .selenium_generator_agent import SeleniumGeneratorAgent

class AgentRouter:
    def __init__(self):
        self.qa_agent = QAAgent()
        self.test_generator = TestGeneratorAgent()
        self.selenium_generator = SeleniumGeneratorAgent()

    def is_valid_request(self, text):
        """Validates if the request text is meaningful enough to process."""
        if not text or not isinstance(text, str):
            return False
            
        # Check if text is too short
        if len(text.strip()) < 5:
            return False
            
        # Check if text is just random characters
        # Count meaningful words (at least 3 letters)
        words = text.split()
        meaningful_words = [w for w in words if len(w) >= 3 and re.match(r'^[a-zA-Z]+$', w)]
        
        # If less than 30% of words are meaningful, reject
        if len(words) >= 3 and len(meaningful_words) / len(words) < 0.3:
            return False
            
        # Check for common test-related keywords
        test_keywords = [
            'test', 'login', 'page', 'user', 'password', 'click', 'button', 
            'input', 'field', 'verify', 'check', 'validate', 'scenario', 
            'feature', 'given', 'when', 'then', 'selenium', 'script', 'generate'
        ]
        
        # If text contains at least one test-related keyword, it's more likely to be valid
        for keyword in test_keywords:
            if keyword.lower() in text.lower():
                return True
                
        # If we get here, do a final length check - longer texts are more likely to be valid
        return len(text.strip()) > 15
    
    def route_request(self, request_data: dict) -> dict:
        try:
            print(f"Received request data: {request_data}")

            if not isinstance(request_data, dict):
                return {'status': 'error', 'message': 'Invalid request format'}

            agent_type = request_data.get('agentType', '').lower()
            print(f"Agent type: {agent_type}")

            requirement = request_data.get('requirement', '')
            text = request_data.get('text', '')
            
            if not requirement and not text:
                return {'status': 'error', 'message': 'No requirement or text provided'}
                
            # Validate the input text
            input_text = requirement or text
            if not self.is_valid_request(input_text):
                return {
                    'status': 'error',
                    'message': 'Please provide a meaningful request related to testing. Your input appears to be random text or too short.'
                }

            if agent_type == 'test_generator':
                print("Routing to test generator agent")
                return self.test_generator.generate_gherkin(request_data)

            elif agent_type == 'selenium_generator':
                print("Routing to selenium generator agent")
                try:
                    result = self.selenium_generator.generate_selenium_script(request_data)
                    print(f"Selenium generator result: {result['status']}")
                    return result
                except Exception as e:
                    print(f"Error in selenium generator: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    return {'status': 'error', 'message': f'Error in selenium generator: {str(e)}'}

            else:
                return {
                    'status': 'error',
                    'message': f'Unknown agent type: {agent_type}. Use "test_generator" or "selenium_generator".'
                }

        except Exception as e:
            print(f"Error in router: {str(e)}")
            return {'status': 'error', 'message': f'Internal error: {str(e)}'}
