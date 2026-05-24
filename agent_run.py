import os
import requests
import xml.etree.ElementTree as ET
from smolagents import CodeAgent, tool, LiteLLMModel

# ==========================================
# Custom Tools
# ==========================================

@tool
def fetch_google_trends(geo: str = "US") -> str:
    """
    Feaches the top daily trending searches from Google Trends via RSS.
    
    Args:
        geo: The geographic location code (e.g., 'US', 'GB', 'IL', 'Global'). Defaults to 'US'.
    """
    try:
        url = f"https://trends.google.com/trends/trendingsearches/daily/rss?geo={geo}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        root = ET.fromstring(response.content)
        trends = []
        
        for item in root.findall('.//item')[:10]:
            title = item.find('title').text if item.find('title') is not None else "Unknown"
            traffic_node = item.find('{https://ns.google.com/trends/2005/01/rss}ht')
            traffic = traffic_node.text if traffic_node is not None else "Unknown traffic"
            trends.append(f"- {title} (Approx. traffic: {traffic})")
            
        return "Current Google Trends:\n" + "\n".join(trends)
    except Exception as e:
        return f"Failed to fetch trends: {str(e)}"

# ==========================================
# Agent Configuration & Execution
# ==========================================

def main():
    # ודואג שמפתח ה-API קיים במערכת
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing.")

    # הגדרת המודל באמצעות LiteLLM שמובנה בתוך smolagents
    # אנו משתמשים בפורמט הסטנדרטי "gemini/gemini-1.5-flash" (או gemini-2.5/gemini-3.5 לפי הגישה הרצויה)
    model = LiteLLMModel(
        model_id="gemini/gemini-1.5-flash", 
        api_key=api_key
    )

    # אתחול הסוכן עם הגבלות הריצה הרגילות שלנו
    agent = CodeAgent(
        tools=[fetch_google_trends],
        model=model,
        max_steps=10, 
        additional_authorized_imports=["os", "datetime", "json", "re"]
    )

    task_prompt = """
    You are an autonomous web developer, SEO auditor, and journalist managing an existing Jekyll-based GitHub Pages website.
    Your execution MUST follow these exact steps:

    1. REPOSITORY AUDIT & REFACTOR:
       - Scan the current directory for markdown (.md) and HTML files, including '_config.yml' and existing layouts.
       - Improve SEO and Accessibility (A11y): Ensure images have alt text, fix heading hierarchies, and optimize metadata.
       - If basic Jekyll folders ('_posts', '_includes') are missing, create them using Python.

    2. TREND RESEARCH:
       - Call the 'fetch_google_trends' tool to identify a highly popular current trend.

    3. CONTENT GENERATION:
       - Write a comprehensive, SEO-optimized news article about the selected trend.
       - Save it in the '_posts' directory using the strict Jekyll naming format: 'YYYY-MM-DD-title-of-post.md'.
       - Include standard Jekyll YAML front matter at the top of the file (layout, title, tags).

    4. INTERACTIVE TOOL BUILDING:
       - Build a small, relevant interactive JavaScript tool based on the article (e.g., a calculator or data visualizer).
       - Embed the HTML/JS directly into the markdown post or save it in '_includes' and reference it.

    CRITICAL GUARDRAILS:
    - You MUST completely ignore and never modify the following directories: node_modules, .git, venv, __pycache__, env, _site.
    - Write clean, error-free Python code to handle file system operations (like os.makedirs).
    - Once you have successfully updated the files and written the new post, end your execution.
    """

    print("Initiating repository scan and autonomous enhancement with LiteLLM-Gemini...")
    agent.run(task_prompt)
    print("Autonomous enhancement successfully completed.")

if __name__ == "__main__":
    main()
