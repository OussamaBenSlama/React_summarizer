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
response = requests.post(
    "http://localhost:11434/api/chat",
    json={
        "model": "llama3:latest",
        "messages": [ 
            {
                "role": "user",
                "content": f"please summarize this output: {scraped_content}"
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0.3,
            "seed": 101, 
            "num_predict": 100,
        }
    }
)


print(response.json()['message']['content'])