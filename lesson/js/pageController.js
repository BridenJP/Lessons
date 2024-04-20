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
        window.location.href = prevTopic + "#last";
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

    window.location.hash = `page${iPage}`;

    updatePageContent();
  }

  function updatePageContent() {
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
          if (index + 1 === iPage) {
            link.classList.add("active"); // Add 'active' class to the current page link
          } else {
            link.classList.remove("active"); // Remove 'active' class from other links
          }
        });
      })
      .catch((err) => {
        main.innerHTML = "<p>Error loading the page.</p>";
      });
  }

  function handleSpacebar(event) {
    if (event.code === "Space") {
      event.preventDefault();
      event.target.click();
    }
  }

  function pageFromHash() {
    const hash = window.location.hash;
    if (hash === "#last") {
      return nPages;
    }
    const pageNum = parseInt(hash.substring(5), 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= nPages) {
      return pageNum;
    }
    return 1;
  }

  window.addEventListener("hashchange", function () {
    loadPage(pageFromHash());
  });

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

    // Attempt to load the initial page based on the current hash, or default to the first page
    loadPage(pageFromHash());

    document.body.style.visibility = "visible";
  };
}
