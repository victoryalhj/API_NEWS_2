const API_KEY = `d787306ca4424a128d6c0ff4f0061698`;
let newsList = [];
const menus = document.querySelectorAll('.menus button')
menus.forEach((menu) =>
  menu.addEventListener("click",(event)=>getNewsByCategory(event)))

const categoryButtons = document.querySelectorAll('menus button, .sidenav button');

categoryButtons.forEach((button) =>
  button.addEventListener("click", (event) => getNewsByCategory(event)));


const getLatestNews = async() => {
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=20`);

  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles
  render();
  console.log("ddd",newsList);
};


const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
  console.log("category",category);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&pageSize=20`);
  const response = await fetch(url);
  const data = await response.json();
  console.log("ddd",data);
  newsList = data.articles;
  render();
}


const render = () => {
  const newsHTML = newsList.map(
    (news) => {
    //내용없음
    const description = news.description ? truncateText(news.description,200) :"내용없음";
    //no image
    const  imageUrl = news.urlToImage ? news.urlToImage : ".images/no_image.png";
    // no source
    const sourceName = news.source?.name? news.source.name : "no source";
    const formattedDate = timeAgo(news.publishedAt);
    
    return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-image-size" src=${news.urlToImage} alt="News Image" onerror="this.onerror=null; this.src='./images/no_image.png';">
    </div>
    <div class="col-lg-8">
      <h2>${news.title}</h2>
      <p>${news.description}</p>
      <div>${sourceName} * ${formattedDate}</div>
    </div>
  </div>`
}).join('');

  document.getElementById('news-board').innerHTML=newsHTML;
}

//200자 축약
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

//날짜축약
const timeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInYears > 0) return `${diffInYears} years ago`;
  if (diffInMonths > 0) return `${diffInMonths} months ago`;
  if (diffInDays > 0) return `${diffInDays} days ago`;
  if (diffInHours > 0) return `${diffInHours} hours ago`;
  if (diffInMinutes > 0) return `${diffInMinutes} minutes ago`;
  return "just now";
};



//Nav메뉴 오픈
function toggleNav () {
  document.getElementById("side-menu").style.width = "250px";
}
//Nav메뉴 클로즈즈
function closeNav () {
  document.getElementById("side-menu").style.width = "0";
}
//검색창
document.getElementById("search-icon").addEventListener("click", function () {
  const searchBox = document.getElementById("search-box");

  if (searchBox.style.display === "none" || searchBox.style.display === "") {
    searchBox.style.display = "block";
  } else {
    searchBox.style.display = "none";
  }
});

//검색버튼
const getNewsByKeyword = async() => {
  const keyword = document.getElementById("search-input").value;
  console.log("keyword",keyword)
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}&pageSize=20`);
  const response = await fetch(url);
  const data = await response.json();
  console.log("keyword data",data)
  newsList = data.articles; 
  render();
}




getLatestNews();

//카테고리 연결
//1.버튼들에 클릭이벤트
//2.카테고리별 뉴스 가져오기
//3. 그 뉴스 보여주기기

