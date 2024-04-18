export function initPageController(topic, pageTitles, prevTopic, nextTopic) {
  const nPages = pageTitles.length;
  let iPage,
    main,
    header,
    prev,
    next,
    pages,
    temp,
    pageLinks = [];

  function nextPage() {
    loadPage(iPage + 1);
  }

  function prevPage() {
    loadPage(iPage - 1);
  }

  function loadPage(p) {
    if (p < 1) {
      if (prevTopic) {
        window.location.href = prevTopic;
      } else {
        p = 1;
      }
    }
    if (p > nPages) {
      if (nextTopic) {
        window.location.href = nextTopic;
      } else {
        p = nPages;
      }
    }
    iPage = p;

    header.innerHTML = pageTitles[iPage - 1]; // Set the new title
    fetch(`topic/${topic}/page${iPage}.html`)
      .then((response) => response.text())
      .then((html) => {
        temp.innerHTML = html;
        main.innerHTML = temp.querySelector("main").innerHTML;
        prev.style.visibility = iPage > 1 || prevTopic ? "visible" : "hidden";
        next.style.visibility =
          iPage < nPages || nextTopic ? "visible" : "hidden";

        // Update active page link class
        pageLinks.forEach((link, index) => {
          console.log(link, index);
          if (index + 1 === iPage) {
            link.focus();
          }
        });
      })
      .catch((err) => {
        main.innerHTML = "<p>Error loading the page.</p>";
      });

    window.location.hash = "page" + iPage;
  }

  function handleSpacebar(event) {
    if (event.code === "Space") {
      event.preventDefault();
      event.target.click();
    }
  }

  function checkHashAndLoadPage() {
    const hash = window.location.hash;
    let pageNum = 1; // Default to the first page
    if (hash && hash.startsWith("#page")) {
      const newPage = parseInt(hash.substring(5), 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= nPages) {
        pageNum = newPage;
      }
    }
    loadPage(pageNum);
  }

  window.addEventListener("hashchange", checkHashAndLoadPage, false);

  window.onload = function () {
    header = document.querySelector("header h1");
    main = document.querySelector("main");
    prev = document.getElementById("prevPage");
    next = document.getElementById("nextPage");
    pages = document.getElementById("pages");
    temp = document.createElement("div");

    prev.addEventListener("click", (event) => {
      event.preventDefault();
      prevPage();
    });
    prev.addEventListener("keydown", handleSpacebar);

    next.addEventListener("click", (event) => {
      event.preventDefault();
      nextPage();
    });
    next.addEventListener("keydown", handleSpacebar);

    for (let i = 1; i <= nPages; i++) {
      const pageLink = document.createElement("a");
      pageLink.href = "#page" + i;
      pageLink.textContent = i;
      pageLink.title = pageTitles[i - 1]; // arrays are 0 based
      pageLink.classList.add("page");
      pageLink.addEventListener("click", (event) => {
        event.preventDefault();
        loadPage(i);
      });
      pageLink.addEventListener("keydown", handleSpacebar);
      pages.appendChild(pageLink);
      pageLinks.push(pageLink);
    }

    checkHashAndLoadPage();
    document.body.style.visibility = "visible";
  };
}
