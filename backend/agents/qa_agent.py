import groq
from dotenv import load_dotenv
import os
import re

load_dotenv()

class QAAgent:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")

        self.client = groq.Client(api_key=self.groq_api_key)

        self.system_prompt = """You are a QA automation expert. Generate Selenium test scripts.
        Follow these rules:
        1. Use Python with Selenium WebDriver
        2. Include proper waits and error handling
        3. Follow Page Object Model when appropriate
        4. Add clear comments and docstrings
        5. Handle edge cases and errors"""

    def generate_selenium_script(self, request_data: dict) -> dict:
        try:
            requirement = request_data.get('requirement', '')
            test_name = request_data.get('testName', 'test_default').strip()
            if not test_name.endswith('.py'):
                test_name += '.py'

            language = request_data.get('language', 'python').lower()
            if language != 'python':
                return {
                    'status': 'error',
                    'message': 'Currently only Python is supported for Selenium scripts'
                }

            prompt = f"""Generate a Selenium test script in Python for the following requirement:
            {requirement}

            Include:
            1. Proper setup and teardown
            2. WebDriverWait for elements
            3. Try-except blocks for error handling
            4. Clear comments and docstrings
            5. Page Object Model if appropriate"""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                model="mixtral-8x7b-32768",
                temperature=0.7,
                max_tokens=4000,
                top_p=0.95
            )

            if not chat_completion or not chat_completion.choices:
                raise ValueError("No response from Groq API")

            content = chat_completion.choices[0].message.content
            code_match = re.search(r'```python\n(.+?)```', content, re.DOTALL)
            if code_match:
                content = code_match.group(1)
            else:
                content = content.strip()

            os.makedirs('test_scripts', exist_ok=True)
            script_file = os.path.join('test_scripts', test_name)
            with open(script_file, 'w') as f:
                f.write(content)

            return {
                'status': 'success',
                'script_file': script_file,
                'content': content,
                'filename': test_name,
                'message': 'Selenium test script generated successfully'
            }

        except Exception as e:
            return {'status': 'error', 'message': str(e)}
