import os
from agno.agent import Agent
from agno.models.groq import Groq
from dotenv import load_dotenv

load_dotenv()

def evaluate_and_improve(content: str, agent: Agent) -> str:
    """Evaluate and improve the generated test cases"""
    eval_prompt = f"""Evaluate this Gherkin feature file and suggest improvements:

{content}

Focus on:
1. Missing scenarios or edge cases
2. Unclear steps that need more detail
3. Additional validation steps needed
4. Error scenarios that should be covered

Provide the complete improved feature file with all suggested changes incorporated."""

    response = agent.run(eval_prompt)
    improved_content = response.content
    
    # Clean up the response
    improved_content = improved_content.replace('<think>', '').replace('</think>', '')
    improved_content = improved_content.replace('```gherkin', '').replace('```', '').strip()
    
    return improved_content

def generate_gherkin(prompt: str, feature_name: str, iterations: int = 2):
    """Generate and iteratively improve Gherkin feature file"""
    # Initialize Agno agent
    agent = Agent(
        model=Groq(
            id="deepseek-r1-distill-llama-70b",
            temperature=0.6,
            max_tokens=1024,
            top_p=0.95
        ),
        instructions="""You are a BDD test expert. Generate and improve Gherkin feature files.
        Follow these rules:
        1. Use Feature, Background (if needed), Scenario format
        2. Each scenario must have Given, When, Then steps
        3. Include edge cases and error scenarios
        4. Make steps clear and specific for automation""",
        markdown=False
    )
    
    # Initial generation
    print("\nGenerating initial test cases...")
    response = agent.run(f"Generate Gherkin feature file for: {prompt}")
    content = response.content.replace('<think>', '').replace('</think>', '')
    content = content.replace('```gherkin', '').replace('```', '').strip()
    
    # Iteratively improve
    for i in range(iterations):
        print(f"\nIteration {i+1}: Evaluating and improving test cases...")
        content = evaluate_and_improve(content, agent)
    
    # Save final version
    os.makedirs('features', exist_ok=True)
    feature_file = os.path.join('features', f"{feature_name}.feature")
    with open(feature_file, 'w') as f:
        f.write(content)
    
    print(f"\nGenerated and improved: {feature_file}")
    print("\nFinal test cases:")
    print("=" * 50)
    print(content)

def main():
    try:
        prompt = input("Enter your requirement: ")
        name = input("Enter feature name (without .feature): ")
        iterations = int(input("Number of improvement iterations (1-3, default 2): ") or "2")
        iterations = max(1, min(3, iterations))  # Ensure between 1-3
        generate_gherkin(prompt, name, iterations)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()