document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // GLOBAL DOM REFERENCES
  // ==============================
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav__link");
  const contactBtn = document.getElementById("contact-btn");
  const footerContactBtn = document.getElementById("footer-contact-btn");

  const filterSelect = document.getElementById("filter__movies");
  const movieList = document.querySelector(".movie-list");
  const loading = document.getElementById("loading");

  const modal = document.getElementById("contact-modal");
  const closeBtn = modal?.querySelector(".modal__close");
  const overlay = modal?.querySelector(".modal__overlay");

  const footerLinks = document.querySelectorAll('.footer__link[href^="#"]');

  // ==============================
  // HEADER NAV INTERACTION
  // ==============================
  if (nav && navLinks.length) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 50);
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  // ==============================
  // CONTACT MODAL
  // ==============================
  if (modal) {
    function openModal() {
      modal.classList.remove("hidden");
      document.body.classList.add("modal-open");
    }

    function closeModal() {
      modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }

    contactBtn?.addEventListener("click", e => {
      e.preventDefault();
      openModal();
    });

    footerContactBtn?.addEventListener("click", e => {
      e.preventDefault();
      openModal();
    });

    closeBtn?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ==============================
  // MOVIE FETCH + FILTER + LOADING
  // ==============================
  if (filterSelect && movieList && loading) {

    const API_KEY = "407e7c25";
    let moviesData = [];

    function showLoading() {
      loading.classList.remove("hidden");
      movieList.classList.add("hidden");
      filterSelect.disabled = true;
    }

    function hideLoading() {
      loading.classList.add("hidden");
      movieList.classList.remove("hidden");
      filterSelect.disabled = false;
    }

    async function fetchMovies(query = "Fast") {
      showLoading();
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&S=${query}`
        );

        const data = await res.json();

        if (data.Response === "True") {
          moviesData = data.Search;
          displayMovies(moviesData);
        } else {
          movieList.innerHTML = "<p>No movies found.</p>";
        }

      } catch (err) {
        console.error("Fetch error:", err);
        movieList.innerHTML = "<p>Error loading movies.</p>";
      }

      setTimeout(hideLoading, 500);
    }

    function displayMovies(movies) {
      movieList.innerHTML = "";

      movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie";

        card.innerHTML = `
          <div class="movie-card">
            <div class="movie-card__container">
              <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" alt="${movie.Title}">
              <p><b>Title:</b> ${movie.Title}</p>
              <p><b>Year:</b> ${movie.Year}</p>
              <p><b>imdbID:</b> ${movie.imdbID}</p>
            </div>
          </div>
        `;

        movieList.appendChild(card);
      });
    }

    function sortMovies(type) {
      let sorted = [...moviesData];

      switch (type) {
        case "TITLE":
          sorted.sort((a, b) => a.Title.localeCompare(b.Title));
          break;

        case "Year":
          sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
          break;

        case "imdbID":
          sorted.sort((a, b) => a.imdbID.localeCompare(b.imdbID));
          break;
      }

      displayMovies(sorted);
    }

    // Load movies automatically on page load
    fetchMovies("Fast");

    // Sorting dropdown
    filterSelect.addEventListener("change", e => {
      showLoading();
      setTimeout(() => {
        sortMovies(e.target.value);
        hideLoading();
      }, 400);
    });
  }

});
