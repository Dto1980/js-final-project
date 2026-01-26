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
  const movies = Array.from(document.querySelectorAll(".movie"));
  const loading = document.getElementById("loading");

  const modal = document.getElementById("contact-modal");
  const closeBtn = modal?.querySelector(".modal__close");
  const overlay = modal?.querySelector(".modal__overlay");

  const footerLinks = document.querySelectorAll('.footer__link[href^="#"]');

  // ==============================
  // HEADER NAV INTERACTION
  // ==============================
  if (nav && navLinks.length) {
    // Change nav style on scroll
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Set active nav link
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

    // Open modal from header
    if (contactBtn) {
      contactBtn.addEventListener("click", e => {
        e.preventDefault();
        openModal();
      });
    }

    // Open modal from footer
    if (footerContactBtn) {
      footerContactBtn.addEventListener("click", e => {
        e.preventDefault();
        openModal();
      });
    }

    // Close modal
    closeBtn?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);

    // Close modal on Escape key
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
  }

  // ==============================
  // FOOTER SMOOTH SCROLL
  // ==============================
  if (footerLinks.length) {
    footerLinks.forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElem = document.getElementById(targetId);

        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth' });

          // Optional: highlight active footer link
          footerLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });
  }

  // ==============================
  // MOVIE FILTER + LOADING
  // ==============================
  if (filterSelect && movieList && loading && movies.length) {
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

    function getMovieInfo(movie) {
      const text = movie.innerText;
      return {
        movie,
        title: text.match(/Title:\s*(.*)/)?.[1] || "",
        year: parseInt(text.match(/Year:\s*(\d+)/)?.[1]) || 0,
        imdbID: text.match(/imdbID:\s*(tt\d+)/)?.[1] || ""
      };
    }

    const movieData = movies.map(getMovieInfo);

    // Initial loading animation
    showLoading();
    setTimeout(() => hideLoading(), 800);

    // Filter sorting
    filterSelect.addEventListener("change", e => {
      showLoading();
      setTimeout(() => {
        let sorted = [...movieData];

        switch (e.target.value) {
          case "TITLE":
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "Year":
            sorted.sort((a, b) => a.year - b.year);
            break;
          case "imdbID":
            sorted.sort((a, b) => a.imdbID.localeCompare(b.imdbID));
            break;
        }

        movieList.innerHTML = "";
        sorted.forEach(item => movieList.appendChild(item.movie));

        hideLoading();
      }, 400);
    });
  }

});
