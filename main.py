import requests
from bs4 import BeautifulSoup

url = "http://react.org.tn/mahfel-allegua-ethnobotanique-de-la-tradition-de-la-allegua-du-sud-tunisien/"

def scrapping(url):
    response = requests.get(url)
    if response.status_code == 200:  
        soup = BeautifulSoup(response.text, "html.parser")
        content_div = soup.find("div", class_="entry-content")

        if content_div:
            article_text = "\n".join([p.get_text() for p in content_div.find_all("p")])
            return article_text  # Return instead of print
        else:
            return "No content found with class='entry-content'"
    else:
        return f"Failed to retrieve the webpage. Status code: {response.status_code}"

# Get the scraped content
scraped_content = scrapping(url)

# Make the API call
def summarize_text(url) : 
    scraped_content = scrapping(url)
    response = requests.post(
    "http://localhost:11434/api/chat",
    json={
        "model": "llama3:latest",
        "messages": [ 
            {
                "role": "user",
                "content": f"Summarize the following content by providing a title that captures the essence, a concise summary of the key points, and a conclusion. The output should only include the summarized content: {scraped_content} and ensure that the summarized content doesn't exceed 150 tokens"
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0.3,
            "seed": 101, 
            "num_predict": 150,
        }
    }
)

    result = response.json()['message']['content']
    return result