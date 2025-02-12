document.addEventListener('DOMContentLoaded', function() {
  // --- Favorites Section Functionality ---

  // Use the HTML class "favourites-list" (this is the container inside your Favourites Section)
  const favoritesList = document.querySelector(".favourites-list");

  // Function to load favorites from localStorage and display them as gallery-style cards
  function loadFavorites() {
    const savedStyles = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Loading favorites:", savedStyles);

    if (!favoritesList) {
      console.error("Error: .favourites-list element not found!");
      return;
    }
    
    // Clear the container
    favoritesList.innerHTML = "";
    
    // For a gallery-like grid, you can either set favoritesList to display: grid in CSS
    // or create each favorite using the same structure as gallery cards.
    savedStyles.forEach(style => {
      console.log("Adding style:", style);
      const favCard = document.createElement("div");
      // Use the same "card" and "card-info" classes as in your gallery
      favCard.classList.add("card");
      favCard.innerHTML = `
        <img src="${style.image}" alt="${style.title}">
        <div class="card-info">
          <h2>${style.title}</h2>
          <p>${style.desc}</p>
          <button class="remove-btn" data-id="${style.id}">Remove</button>
        </div>
      `;
      favoritesList.appendChild(favCard);
    });
  }

  // Listen for clicks on "Save Style" buttons
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("save-style-btn")) {
      console.log("Save button clicked!");
      const button = event.target;
      const card = button.closest(".card");
      if (!card) return;

      const styleId = card.getAttribute("data-style-id");
      const title = card.querySelector("h2").innerText;
      const desc = card.querySelector("p").innerText;
      const image = card.querySelector("img").src;

      console.log(`Style ID: ${styleId}, Title: ${title}`);

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (favorites.some(style => style.id === styleId)) {
        console.log("Style already saved!");
        return;
      }

      favorites.push({ id: styleId, title, desc, image });
      localStorage.setItem("favorites", JSON.stringify(favorites));

      button.classList.add("saved");
      button.innerText = "Saved";

      console.log("Style saved successfully!");
      loadFavorites();
    }
  });

  // Listen for clicks on "Remove" buttons in the favorites section
  favoritesList.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-btn")) {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites = favorites.filter(style => style.id !== e.target.dataset.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      loadFavorites();
    }
  });

  // Load favorites on page load
  loadFavorites();

  // --- Carousel Functionality (Unchanged) ---

  const carousel = {
    items: document.querySelectorAll('.carousel-item') || [],
    dots: document.querySelectorAll('.carousel-dot') || [],
    progressBar: document.querySelector('.progress-bar'),
    container: document.querySelector('.carousel')
  };

  let currentIndex = 0;
  let isAnimating = false;
  const slideInterval = 3000;
  let autoplayInterval = null;
  let progressBarInterval = null;

  function updateProgressBar() {
    if (!carousel.progressBar) return;

    let width = 0;
    carousel.progressBar.style.width = '0%';
    
    if (progressBarInterval) {
      clearInterval(progressBarInterval);
    }

    progressBarInterval = setInterval(() => {
      width += 100 / (slideInterval / 50);
      if (carousel.progressBar) {
        carousel.progressBar.style.width = `${Math.min(width, 100)}%`;
      }

      if (width >= 100) {
        clearInterval(progressBarInterval);
      }
    }, 50);
  }

  function showSlide(index) {
    if (isAnimating || !carousel.items.length) return;
    isAnimating = true;

    updateProgressBar();

    carousel.items.forEach(item => item.classList.remove('active'));
    carousel.dots.forEach(dot => dot.classList.remove('active'));

    if (carousel.items[index]) {
      carousel.items[index].classList.add('active');
    }
    
    if (carousel.dots[index]) {
      carousel.dots[index].classList.add('active');
    }

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % carousel.items.length;
    showSlide(currentIndex);
  }

  function startAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    autoplayInterval = setInterval(nextSlide, slideInterval);
    updateProgressBar();
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    if (progressBarInterval) {
      clearInterval(progressBarInterval);
    }
    if (carousel.progressBar) {
      carousel.progressBar.style.width = '0%';
    }
  }

  carousel.dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (currentIndex !== index) {
        currentIndex = index;
        showSlide(currentIndex);
        startAutoplay();
      }
    });
  });

  if (carousel.container) {
    carousel.container.addEventListener('mouseenter', stopAutoplay);
    carousel.container.addEventListener('mouseleave', startAutoplay);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Initialize the carousel
  showSlide(0);
  startAutoplay();
});
