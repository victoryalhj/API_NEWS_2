let category = "";
let keyword = "";
let newsList = [];
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=20`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const categories = ['Entertainment','General','Health','Science','Sports','Technology'];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event)=> getNewsCategory(event)));

const getNews = async() => {
  try{
    url.searchParams.set("page",page);
    url.searchParams.set("pageSize",pageSize);

    const response = await fetch(url);

    const data = await response.json();
    if(response.status === 200){
      if(data.articles.length === 0){
        throw new Error("No matches for your search.");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    }else {
      throw new Error(data.message)
    }
  } catch(error) {
    errorRender(error.message);
  }
};

//API
const getLatestNews = async () => {
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&pageSize=20`); 
    url.searchParams.set("country", "kr");
  await getNews();
}

//Menu
const getNewsCategory = async (event) => {
  const selectedCategory = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&pageSize=20`
  );
  url.searchParams.set("country", "kr");
  url.searchParams.set("category", selectedCategory);
  page = 1;
  await getNews();
};

//keyword
const getNewsByKeyword = async() => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}&pageSize=20`)
  await getNews();
};

//Search
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  let searchIcon = document.querySelector(".search-icon");

  if (inputArea.style.display === "none" || inputArea.style.display === "" ) {
    inputArea.style.display ="flex";
    searchIcon.style.display ="none"; //검색아이콘 숨기기
  }else {
    inputArea.style.display = "none";
    searchIcon.style.display = "inline-block"; //검색아이콘 보이기
  }
}

//SideMenu
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
}


//Render
const render = () => {
  const newsHTML = newsList.map(
    (news) => `<div class="row news">
                <div class="col-lg-4">
                  <img class="news-img-size" src="${news.urlToImage || 'img/noimage.png'}" onerror="this.onerror=null; this.src='img/noimage.png';" />
                </div>
                <div class="col-lg-8">
                  <h2>${news.title}</h2>
                  <p>${news.description == null || news.description == "" ? "내용없음": news.description.length > 200 ? news.description.substring(0, 200) + "..." : news.description}</p>
                  <div>${news.source.name || "no source"} * ${moment(news.publishedAt, "YYYYMMDD").fromNow()}</div>
                </div>
              </div>`
    ).join('');
    console.log("html", newsHTML);

  document.getElementById('news-board').innerHTML = newsHTML
}

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML
};

//Page
const paginationRender = () => {
  let paginationHTML=``;
  const totalPages = Math.ceil(totalResults/pageSize)
  let pageGroup = Math.ceil(page/groupSize);
  let lastPage = pageGroup * groupSize;
  if(lastPage > totalPages){
    lastPage = totalPages
  }
  const firstPage = lastPage - (groupSize-1)<=0? 1: lastPage - (groupSize - 1);
  let last = pageGroup * 5;
    if(last > totalPages) {
      last = totalPages;
    }
  let first = last -4 <= 0 ? 1 : last -4;

  if(page > 1) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
                          <a class="page-link" href="#">&lt;&lt;</a>
                        </li>
                        <li class="page-item" onclick="moveToPage(${page-1})">
                          <a class="page-link" href="#">&lt;</a>
                        </li>`;
  }
  for(let i=firstPage; i<=lastPage; i++){
    paginationHTML+=` <li class="page-item ${i === page? "active" : ""}" onclick="moveToPage(${i})">
                        <a class="page-link">${i}</a> 
                      </li>`;
  }
  if(page < totalPages) {
  paginationHTML+=`<li class="page-item" onclick="moveToPage(${page+1})">
                    <a class="page-link" href="#">&gt;</a>
                  </li>
                  <li class="page-item" onclick="moveToPage(${totalPages})">
                    <a class="page-link" href="#">&gt;&gt;</a>
                  </li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML


}

const moveToPage = (pageNum) => {
  console.log("move",pageNum);
  page = pageNum;
  getNews()
}

getLatestNews();



