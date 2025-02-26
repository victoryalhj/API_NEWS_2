const API_KEY = `d787306ca4424a128d6c0ff4f0061698`;
let news = [];

const getLatestNews = async() => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles
  console.log("ddd",news);
};

getLatestNews();