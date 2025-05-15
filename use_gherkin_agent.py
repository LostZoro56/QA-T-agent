import os
from pathlib import Path
from gherkin_qa_agent import GherkinQAAgent

def read_feature(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Parse feature content
    feature_data = {
        'name': Path(file_path).stem,  # Use filename as default name
        'scenarios': []
    }
    
    lines = content.split('\n')
    current_scenario = None
    
    for line in lines:
        line = line.strip()
        if line.startswith('Feature:'):
            feature_data['name'] = line.replace('Feature:', '').strip()
        elif line.startswith('Scenario:'):
            if current_scenario:
                feature_data['scenarios'].append(current_scenario)
            current_scenario = {
                'name': line.replace('Scenario:', '').strip(),
                'steps': []
            }
        elif current_scenario and line and line.startswith(('Given', 'When', 'Then', 'And')):
            current_scenario['steps'].append(line)
    
    if current_scenario:
        feature_data['scenarios'].append(current_scenario)
    
    return feature_data

def process_features(framework):
    print(f"\nGenerating {framework.title()} tests...")
    print("-" * 50)
    
    agent = GherkinQAAgent(framework=framework)
    base_dir = Path(os.path.dirname(os.path.abspath(__file__)))
    feature_dir = base_dir / 'features'
    
    # Process each feature file
    for feature_file in feature_dir.glob('*.feature'):
        try:
            print(f"\nProcessing: {feature_file}")
            feature_data = read_feature(feature_file)
            print(f"Feature name: {feature_data['name']}")
            print(f"Found {len(feature_data['scenarios'])} scenarios")
            
            # Generate test file
            test_file = agent.generate_test_file(feature_data)
            print(f"Generated test file: {test_file}")
            
        except Exception as e:
            print(f"Error processing {feature_file}: {str(e)}")

def main():
    # Generate tests for both frameworks
    process_features("selenium")
    process_features("playwright")
    
    print("\nTest generation complete!")
    print("-" * 50)
    print("You can find the generated tests in:")
    print("- generated_tests/selenium/")
    print("- generated_tests/playwright/")

if __name__ == "__main__":
    main()
