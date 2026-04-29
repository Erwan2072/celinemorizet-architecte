document.addEventListener("DOMContentLoaded", () => {
  initGalleryPage();
});

function initGalleryPage() {
  const tabsContainer = document.getElementById("galleryTabs");
  const grid = document.getElementById("galleryGrid");

  if (!tabsContainer || !grid || typeof galleryCategories === "undefined") {
    return;
  }

  let activeCategory = galleryCategories[0];

  renderGalleryTabs(tabsContainer, activeCategory);
  renderGalleryProjects(grid, activeCategory);
  initGalleryModal();

  tabsContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-button");

    if (!button) {
      return;
    }

    activeCategory = button.dataset.category;

    renderGalleryTabs(tabsContainer, activeCategory);
    renderGalleryProjects(grid, activeCategory);
  });
}

function renderGalleryTabs(container, activeCategory) {
  container.innerHTML = galleryCategories
    .map((category) => {
      const isActive = category === activeCategory;

      return `
        <button
          class="tab-button ${isActive ? "active" : ""}"
          type="button"
          role="tab"
          aria-selected="${isActive}"
          data-category="${category}"
        >
          ${category}
        </button>
      `;
    })
    .join("");
}

function renderGalleryProjects(grid, activeCategory) {
  const projects = galleryProjects.filter(
    (project) => project.category === activeCategory
  );

  grid.innerHTML = projects
    .map((project, index) => {
      return `
        <article class="gallery-card prestation-card gallery-project-card">
          <div class="gallery-card-image-wrapper">
            <img
              src="${project.cover}"
              alt="${project.alt}"
              class="gallery-card-image"
              loading="lazy"
            >
          </div>

          <div class="gallery-card-content">
            <h2 class="card-title">${project.title}</h2>
            <p class="gallery-card-meta">${project.meta}</p>
            <p class="card-text">${project.shortText}</p>

            <button
              class="gallery-card-button"
              type="button"
              data-project-index="${galleryProjects.indexOf(project)}"
            >
              Voir le projet
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function initGalleryModal() {
  const modal = document.getElementById("galleryModal");
  const image = document.getElementById("galleryModalImage");
  const title = document.getElementById("galleryModalTitle");
  const category = document.getElementById("galleryModalCategory");
  const meta = document.getElementById("galleryModalMeta");
  const text = document.getElementById("galleryModalText");
  const prevButton = document.getElementById("galleryPrev");
  const nextButton = document.getElementById("galleryNext");
  const videoWrapper = document.getElementById("galleryModalVideoWrapper");
  const video = document.getElementById("galleryModalVideo");
  const videoTitle = document.getElementById("galleryModalVideoTitle");

  if (!modal || !image || !title || !category || !meta || !text) {
    return;
  }

  let currentProject = null;
  let currentImageIndex = 0;
  let autoSlideInterval = null;

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest(".gallery-card-button");

    if (!openButton) {
      return;
    }

    const projectIndex = Number(openButton.dataset.projectIndex);
    currentProject = galleryProjects[projectIndex];
    currentImageIndex = 0;

    openGalleryModal();
  });

  document.querySelectorAll("[data-gallery-close]").forEach((button) => {
    button.addEventListener("click", closeGalleryModal);
  });

  prevButton.addEventListener("click", () => {
    changeImage(-1);
  });

  nextButton.addEventListener("click", () => {
    changeImage(1);
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeGalleryModal();
    }

    if (event.key === "ArrowLeft") {
      changeImage(-1);
    }

    if (event.key === "ArrowRight") {
      changeImage(1);
    }
  });

  function openGalleryModal() {
    if (!currentProject) {
      return;
    }

    modal.hidden = false;
    document.body.classList.add("gallery-modal-open");

    category.textContent = currentProject.category;
    title.textContent = currentProject.title;
    meta.textContent = currentProject.meta;
    text.textContent = currentProject.fullText;

    if (currentProject.youtube) {
        videoWrapper.hidden = false;
        video.src = currentProject.youtube;
        videoTitle.textContent = currentProject.videoTitle || "Vidéo du projet";
        } else {
        videoWrapper.hidden = true;
        video.src = "";
        videoTitle.textContent = "";
        }

    updateModalImage();
    startAutoSlide();
  }

  function closeGalleryModal() {
    modal.hidden = true;
    document.body.classList.remove("gallery-modal-open");
    stopAutoSlide();
    video.src = "";
  }

  function changeImage(direction) {
    if (!currentProject || currentProject.images.length <= 1) {
      return;
    }

    currentImageIndex =
      (currentImageIndex + direction + currentProject.images.length) %
      currentProject.images.length;

    updateModalImage();
    startAutoSlide();
  }

  function updateModalImage() {
  const currentImage = currentProject.images[currentImageIndex];

  if (typeof currentImage === "string") {
    image.src = currentImage;
    image.alt = currentProject.alt;
  } else {
    image.src = currentImage.src;
    image.alt = `${currentProject.alt} - ${currentImage.label}`;
  }

  const hasMultipleImages = currentProject.images.length > 1;
  prevButton.style.display = hasMultipleImages ? "flex" : "none";
  nextButton.style.display = hasMultipleImages ? "flex" : "none";
}

  function startAutoSlide() {
    stopAutoSlide();

    if (!currentProject || currentProject.images.length <= 1) {
      return;
    }

    autoSlideInterval = setInterval(() => {
      changeImage(1);
    }, 5000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }
}