const bg = document.querySelector(".active-bg");
const navLeft = document.querySelector(".nav-left");
const navRight = document.querySelector(".nav-right");
const leftOpenIcon = document.querySelector("#h-left-menu");
const rightOpenIcon = document.querySelector("#h-right-menu");

const hLeftcloseMenu = document.querySelector("#h-left-close-menu");
const hRightcloseMenu = document.querySelector("#h-right-close-menu");

const mlDot = document.querySelector(".ml-dot");
const resBar = document.querySelector(".res-bar");

const searchBar = document.querySelector(".search-bar");
const searchPage = document.querySelector(".search-page");
const searchPageInput = document.querySelector(".search-page-input");
const xSearchPage = document.querySelector("#search-page-x");

const apiUrl = "https://api.github.com/users/kisisellhesap";

const getApi = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok) {
      console.log(res);
      return data;
    }
    throw new Error("Fetch failed");
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  const data = await getApi(apiUrl);
  displayData(data);
});

const displayData = (data) => {
  let userName = data.name || "";
  let userLogin = data.login || "";
  let userImg = data.avatar_url || "";
  let userFollowers = data.followers || "0";
  let userFollowing = data.following || "0";
  let userPublicRepo = data.public_repos || "";
  let userBio = data.bio || "";

  document.querySelector(".profile-container").innerHTML = "";

  console.log(data);

  const user = userCard(
    userName,
    userLogin,
    userImg,
    userBio,
    userFollowers,
    userFollowing
  );

  document
    .querySelector(".profile-container")
    .insertAdjacentHTML("beforeend", user);

  renderHeader(userLogin, userImg, userPublicRepo, userName);
  renderRightNav(userLogin, userName, userImg);
  renderLeftNav(data.repos_url, userImg);
};

const userCard = (
  userName,
  userLogin,
  userImg,
  userBio,
  userFollowers,
  userFollowing
) => {
  const user = `
  
  <div class="profile-content-info">
  <div class="profile-content-top">
    <div class="img-div-content">
      <img src="${userImg}" alt="${userName}" />
    </div>
    <div class="smile-content">
      <i class="bx bx-smile"></i>
      <p>Set status</p>
    </div>

    <div class="profile-username-content">
      <h2>${userName}</h2>
      <p>${userLogin}</p>
    </div>
  </div>

  <p>${userBio}</p>
  <button>Edit profile</button>
  <div class="profile-follows-content">
    <div class="follows-container">
      <a
        href="https://github.com/kisisellhesap?tab=followers"
        class="followers-content"
      >
        <i class="bx bx-group"></i>
        <p>${userFollowers}</p>
        <span>followers</span>
      </a>
      <i class="bx bxs-circle" style="font-size: 0.2rem"></i>
      <a
        href="https://github.com/kisisellhesap?tab=following"
        class="following-content"
      >
        <p>${userFollowing}</p>
        <span>following</span>
      </a>
    </div>
  </div>
</div>


`;

  return user;
};

const displayOwner = async (data) => {
  try {
    if (data) {
      const userLogin = data.login;
      // console.log(userLogin);

      document.querySelector(".owner-list").innerHTML = "";

      const owner = ownerCard(userLogin);
      document
        .querySelector(".owner-list")
        .insertAdjacentHTML("beforeend", owner);
    }
  } catch (error) {
    console.log(error);
  }
};

const ownerCard = (userLogin) => {
  const owner = `
                      <div class="owner-card">
                      <i class="bx bx-laptop"></i>
                      <p>${userLogin}</p>

                      <span>Jump to</span>
                    </div>
 

`;

  return owner;
};

bg.addEventListener("click", function () {
  if (navLeft.classList.contains("active-nav")) {
    navLeft.classList.remove("active-nav");
    bg.classList.remove("active-bg-active");
    document.querySelector("body").classList.remove("body-scrollbar");
    document.querySelector("main").classList.remove("main-height");
  } else if (navRight.classList.contains("active-nav")) {
    navRight.classList.remove("active-nav");
    bg.classList.remove("active-bg-active");
    document.querySelector("body").classList.remove("body-scrollbar");
    document.querySelector("main").classList.remove("main-height");
  } else {
    searchPage.classList.remove("active-search");

    bg.classList.remove("active-bg-active");
    document.querySelector("body").classList.remove("body-scrollbar");
    document.querySelector("main").classList.remove("main-height");
  }

  searchPageInput.value = "";
  document.querySelector(".owner-list").innerHTML = "";
  xSearchPage.style.display = "none";
});

leftOpenIcon.addEventListener("click", function () {
  navLeft.classList.add("active-nav");
  bg.classList.add("active-bg-active");
  document.querySelector("body").classList.add("body-scrollbar");
  document.querySelector("main").classList.add("main-height");
});

hLeftcloseMenu.addEventListener("click", function () {
  navLeft.classList.remove("active-nav");
  bg.classList.remove("active-bg-active");
  document.querySelector("body").classList.remove("body-scrollbar");
  document.querySelector("main").classList.remove("main-height");
});

rightOpenIcon.addEventListener("click", function () {
  navRight.classList.add("active-nav");
  bg.classList.add("active-bg-active");
  document.querySelector("body").classList.add("body-scrollbar");
  document.querySelector("main").classList.add("main-height");
});

searchBar.addEventListener("click", function (e) {
  searchPage.classList.add("active-search");

  bg.classList.add("active-bg-active");
  document.querySelector("body").classList.add("body-scrollbar");
  document.querySelector("main").classList.add("main-height");

  searchPageInput.focus();
});

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

searchPageInput.addEventListener(
  "keyup",
  debounce(async function (e) {
    const value = e.target.value.trim().toLowerCase();
    const searchUrl = `https://api.github.com/users/${value}`;

    if (e.key === "Enter") {
      if (value) {
        const data = await getApi(searchUrl);

        if (data === undefined) {
          // console.log("User not found");
          document.querySelector(".profile-container").innerHTML = "";

          const notFoundImg = `
          <img src="./404img.png" class="img-404"> </img>
          `;
          document
            .querySelector(".profile-container")
            .insertAdjacentHTML("beforeend", notFoundImg);
          return;
        }
        // console.log(data);
        displayData(data);
      }
    }

    if (value) {
      xSearchPage.style.display = "block";
    } else {
      xSearchPage.style.display = "none";
    }

    const data = await getApi(searchUrl);
    if (value.length > 0) {
      // console.log("User not found");
      document.querySelector(".owner-list").innerHTML = "";
      document
        .querySelector(".owner-list")
        .insertAdjacentHTML(
          "beforeend",
          `<p class="not-found-owner">User not found</p>`
        );
      // console.log("user not found");
    } else if (value.length === 0) {
      // console.log("empty");
      document.querySelector(".owner-list").innerHTML = "";
    }
    // console.log(value.length);
    // console.log(data, "data");
    displayOwner(data);

    if (document.querySelector(".owner-card")) {
      document
        .querySelector(".owner-card")
        .addEventListener("click", function () {
          displayData(data);
        });
    }
  }, 1000)
);

xSearchPage.addEventListener("click", function () {
  searchPageInput.value = "";
  xSearchPage.style.display = "none";
  document.querySelector(".owner-list").innerHTML = "";
  searchPageInput.focus();
});
hRightcloseMenu.addEventListener("click", function () {
  navRight.classList.remove("active-nav");
  bg.classList.remove("active-bg-active");
  document.querySelector("body").classList.remove("body-scrollbar");
  document.querySelector("main").classList.remove("main-height");
});

mlDot.addEventListener("click", function () {
  resBar.classList.toggle("active-res-bar");
});

function renderHeader(userLogin, userImg, userPublicRepo, userName) {
  const repoCount = (document.querySelector(".repo-count").textContent =
    userPublicRepo);
  const userNameGithub = (document.querySelector(".username").textContent =
    userLogin);
  const repoUrl = document
    .querySelector(".special-repo")
    .setAttribute("href", `https://github.com/${userLogin}`);
  rightOpenIcon.setAttribute("src", userImg);

  // html title change
  let title = `${userLogin} (${userName})`;
  if (userName == "") {
    title = `${userLogin}`;
  }
  document.title = title;
  // console.log(document.title);
}

function renderRightNav(userLogin, userName, userImg) {
  document.querySelector(".profile-right-username").textContent = userLogin;
  document.querySelector(".profile-right-name").textContent = userName;

  const profileRightUserImg = document
    .querySelector(".profile-right-img")
    .setAttribute("src", userImg);
}

async function renderLeftNav(repos, userImg) {
  const res = await fetch(repos);
  const data = await res.json();

  document.querySelector(".nav-items-repo").innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const element = data[i];

    const urlItem = createUrlItem(userImg, element.html_url, element.full_name);

    document
      .querySelector(".nav-items-repo")
      .insertAdjacentHTML("beforeend", urlItem);

    // console.log(element.html_url);
  }
}

const createUrlItem = (userImg, userRepoHtmlUrl, userRepoFullName) => {
  let urlItem = `
  

   <div class="nav-item">
              <img src="${userImg}" alt="profile-image" />
              <a href="${userRepoHtmlUrl}" target="_blank" class="repo-left-name">${userRepoFullName}</a>
            </div>
  
  `;

  return urlItem;
};
