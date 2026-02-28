document.addEventListener("DOMContentLoaded", function () {

  
  // GET ELEMENTS
  

  const nav = document.querySelector("nav");
  const contactBtn = document.getElementById("contact-btn");
  const footerContactBtn = document.getElementById("footer-contact-btn");

  const modal = document.getElementById("contact-modal");
  const closeBtn = document.querySelector(".modal__close");
  const overlay = document.querySelector(".modal__overlay");

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const filterSelect = document.getElementById("filter__movies");
  const movieList = document.querySelector(".movie-list");
  const loading = document.getElementById("loading");

  const API_KEY = "f20aea4a";
  let moviesData = [];

  
  // NAV SCROLL EFFECT
  

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  
  // MODAL
  

  function openModal() {
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  contactBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });

  footerContactBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  
  // FETCH MOVIES
  

  async function fetchMovies(searchTerm) {
    loading.classList.remove("hidden");
    movieList.innerHTML = "";

    try {
      const response = await fetch(
        "https://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + searchTerm
      );

      const data = await response.json();

      if (data.Response === "True") {
        moviesData = data.Search;
        displayMovies(moviesData);
      } else {
        movieList.innerHTML = "<p>No movies found.</p>";
      }

    } catch (error) {
      movieList.innerHTML = "<p>Error loading movies.</p>";
      console.log(error);
    }

    loading.classList.add("hidden");
  }

  
  // DISPLAY MOVIES
  

  function displayMovies(movies) {
  
  const html = movies.map(movie => {
    const poster = movie.Poster !== "N/A" 
      ? movie.Poster 
      : "https://via.placeholder.com";

    
    return `
      <div class="movie-card">
        <img class="movie-card__img" src="${poster}" alt="${movie.Title} poster" />
        <div class="movie-card__info">
          <h3 class="movie-card__title">${movie.Title}</h3>
          <p class="movie-card__year">${movie.Year}</p>
        </div>
      </div>
    `;
  }).join(''); 

  movieList.innerHTML = html;
}

  
  // SEARCH
  

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm !== "") {
      fetchMovies(searchTerm);
    }
  });

  
  // SORT
  

  filterSelect.addEventListener("change", function (e) {

    let sortedMovies = moviesData.slice();

    if (e.target.value === "A-Z") {
      sortedMovies.sort(function (a, b) {
        return a.Title.localeCompare(b.Title);
      });
    }

    if (e.target.value === "Z-A") {
      sortedMovies.sort(function (a, b) {
        return b.Title.localeCompare(a.Title);
      });
    }

    if (e.target.value === "newest") {
      sortedMovies.sort(function (a, b) {
        return Number(b.Year) - Number(a.Year);
      });
    }

    if (e.target.value === "oldest") {
      sortedMovies.sort(function (a, b) {
        return Number(a.Year) - Number(b.Year);
      });
    }

    displayMovies(sortedMovies);
  });

 
  // LOAD DEFAULT MOVIES
 

  fetchMovies("Fast");

});