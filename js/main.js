/* ================================================== */
/* INIT */
/* Recherche rapide : INIT */
/* ================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initIndexTabs();
  initActiveCards();
});


/* ================================================== */
/* INDEX TAB */
/* Recherche rapide : INDEX TAB */
/* ================================================== */
function initIndexTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (!tabButtons.length || !tabPanels.length) {
    return;
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetPanel = button.getAttribute('data-tab-target');

      if (!targetPanel) {
        return;
      }

      resetTabs(tabButtons, tabPanels);
      activateTab(button, targetPanel, tabPanels);
      resetActiveCards();
    });
  });
}


/* ================================================== */
/* TAB RESET */
/* Recherche rapide : TAB RESET */
/* ================================================== */
function resetTabs(tabButtons, tabPanels) {
  tabButtons.forEach((button) => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });

  tabPanels.forEach((panel) => {
    panel.classList.remove('active');
    panel.hidden = true;
  });
}


/* ================================================== */
/* TAB ACTIVATE */
/* Recherche rapide : TAB ACTIVATE */
/* ================================================== */
function activateTab(button, targetPanel, tabPanels) {
  button.classList.add('active');
  button.setAttribute('aria-selected', 'true');

  tabPanels.forEach((panel) => {
    if (panel.id === targetPanel) {
      panel.classList.add('active');
      panel.hidden = false;
    }
  });
}


/* ================================================== */
/* ACTIVE CARD */
/* Recherche rapide : ACTIVE CARD */
/* ================================================== */
function initActiveCards() {
  const cards = document.querySelectorAll('.prestation-card');
  const closeButtons = document.querySelectorAll('.card-close');

  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('click', (event) => {
      const clickedCloseButton = event.target.closest('.card-close');
      if (clickedCloseButton) return;

      const isActive = card.classList.contains('is-active');

      resetActiveCards();
      document.body.classList.remove('card-focus-active');

      if (!isActive) {
        card.classList.add('is-active');
        document.body.classList.add('card-focus-active');
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      resetActiveCards();
      document.body.classList.remove('card-focus-active');
    });
  });

  document.addEventListener('click', (event) => {
    const activeCard = document.querySelector('.prestation-card.is-active');

    if (!activeCard) return;

    if (!event.target.closest('.prestation-card')) {
      resetActiveCards();
      document.body.classList.remove('card-focus-active');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      resetActiveCards();
      document.body.classList.remove('card-focus-active');
    }
  });
}



/* ================================================== */
/* ACTIVE CARD RESET GRID */
/* Recherche rapide : ACTIVE CARD RESET GRID */
/* ================================================== */
function resetCardsInGrid(parentGrid) {
  const cardsInGrid = parentGrid.querySelectorAll('.prestation-card');

  parentGrid.classList.remove('has-active-card');

  cardsInGrid.forEach((card) => {
    card.classList.remove('is-active');
  });
}


/* ================================================== */
/* ACTIVE CARD RESET ALL */
/* Recherche rapide : ACTIVE CARD RESET ALL */
/* ================================================== */
function resetActiveCards() {
  const grids = document.querySelectorAll('.cards-grid, .gallery-grid');

  grids.forEach((grid) => {
    grid.classList.remove('has-active-card');

    const cards = grid.querySelectorAll('.prestation-card');
    cards.forEach((card) => {
      card.classList.remove('is-active');
    });
  });
}