/* ==========================================================================
   ANAND LIBRARY · PATNA, BIHAR
   APPLICATION LOGIC, INTERACTIVE GALLERY, LIGHTBOX & ROUTER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. DATA CONFIGURATION & GALLERY ITEMS
  // ------------------------------------------------------------------------
  // ================================
// DARK / LIGHT MODE
// ================================

const darkModeBtn = document.getElementById('darkModeBtn');

if (darkModeBtn) {

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Toggle theme when button is clicked
    darkModeBtn.addEventListener('click', () => {

        document.body.classList.toggle('dark-mode');

        // Save user's choice
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }

    });
}
  const galleryItems = [
    {
      id: 1,
      src: 'assets/images/exterior_building.jpg',
      title: 'Full Exterior Building View',
      category: 'exterior',
      categoryLabel: 'Building Exterior',
      desc: 'Real exterior view of Anand Library building in Ramkrishna Nagar, Patna.'
    },
    {
      id: 2,
      src: 'assets/images/interior_study_hall.jpg',
      title: 'Main Study Hall & Numbered Desks',
      category: 'study',
      categoryLabel: 'Study Hall',
      desc: 'Clean, spacious study hall with individual numbered desks and comfortable ergonomic chairs.'
    },
    {
      id: 3,
      src: 'assets/images/interior_desks_lockers.jpg',
      title: 'Study Cubicles & Locker Facilities',
      category: 'study',
      categoryLabel: 'Study Hall',
      desc: 'Close-up of study desks (numbered up to 102) with individual LED lights, power sockets and upper lockers.'
    },
    {
      id: 4,
      src: 'assets/images/interior_cubicles.jpg',
      title: 'Air Conditioned Study Environment',
      category: 'study',
      categoryLabel: 'Study Hall',
      desc: 'Quiet, air-conditioned study area equipped with privacy partitions and curtains.'
    },
    {
      id: 5,
      src: 'assets/images/entrance_facade.jpg',
      title: 'Main Entrance & Facility Boards',
      category: 'entrance',
      categoryLabel: 'Entrance & Facilities',
      desc: 'Front entrance showing Anand Library branding and full facilities board.'
    },
    {
      id: 6,
      src: 'assets/images/signboard_facilities.jpg',
      title: 'Official Facilities & Registration Board',
      category: 'entrance',
      categoryLabel: 'Entrance & Facilities',
      desc: 'Detail shot of Anand Library registration fee free & shift timings board.'
    },
    {
      id: 7,
      src: 'assets/images/building_perspective.jpg',
      title: 'Building Angle & Elevation',
      category: 'exterior',
      categoryLabel: 'Building Exterior',
      desc: 'Multi-level study centre building view with balconies and study floors.'
    }
  ];

  let currentLightboxIndex = 0;
  let activeFilteredItems = [...galleryItems];

  // ------------------------------------------------------------------------
  // 2. NAVBAR SCROLL EFFECT & MOBILE MENU TOGGLE
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  function toggleMobileMenu(show) {
    if (show) {
      mobileOverlay.classList.add('active');
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileOverlay.classList.remove('active');
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isActive = mobileDrawer.classList.contains('active');
      toggleMobileMenu(!isActive);
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // ------------------------------------------------------------------------
  // 3. SPA ROUTER (Home vs Dedicated /gallery Page View)
  // ------------------------------------------------------------------------
  const homeView = document.getElementById('homeView');
  const galleryView = document.getElementById('galleryView');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function handleRoute() {
    const hash = window.location.hash || '#home';
    
    if (hash === '#gallery' || hash === '#/gallery') {
      homeView.classList.add('hidden');
      galleryView.classList.remove('hidden');
      window.scrollTo(0, 0);
      updateActiveNav('gallery');
      renderDedicatedGallery('all');
    } else {
      galleryView.classList.add('hidden');
      homeView.classList.remove('hidden');
      updateActiveNav('home');
      
      if (hash.startsWith('#') && hash !== '#home') {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }

  function updateActiveNav(activeKey) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (
        (activeKey === 'gallery' && (href === '#gallery' || href === '#/gallery')) ||
        (activeKey === 'home' && href === '#home')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  // ------------------------------------------------------------------------
  // 4. DEDICATED GALLERY RENDER & FILTERING
  // ------------------------------------------------------------------------
  const masonryContainer = document.getElementById('galleryMasonry');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderDedicatedGallery(categoryFilter = 'all') {
    if (!masonryContainer) return;

    if (categoryFilter === 'all') {
      activeFilteredItems = [...galleryItems];
    } else {
      activeFilteredItems = galleryItems.filter(item => item.category === categoryFilter);
    }

    masonryContainer.innerHTML = '';
    activeFilteredItems.forEach((item, index) => {
      const masonryCard = document.createElement('div');
      masonryCard.className = 'masonry-item';
      masonryCard.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <div class="gallery-item-overlay">
          <div>
            <div class="gallery-item-title">${item.title}</div>
            <div class="gallery-item-category">${item.categoryLabel}</div>
          </div>
        </div>
      `;
      masonryCard.addEventListener('click', () => openLightbox(index));
      masonryContainer.appendChild(masonryCard);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderDedicatedGallery(cat);
    });
  });

  // Homepage Gallery Trigger Links
  const openGalleryTriggers = document.querySelectorAll('.trigger-open-lightbox');
  openGalleryTriggers.forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index') || '0', 10);
      activeFilteredItems = [...galleryItems];
      openLightbox(idx);
    });
  });

  // ------------------------------------------------------------------------
  // 5. LIGHTBOX MODAL FUNCTIONALITY
  // ------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  function openLightbox(index) {
    if (!lightboxModal) return;
    currentLightboxIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    if (activeFilteredItems.length === 0) return;
    const item = activeFilteredItems[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title + " — " + item.desc;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${activeFilteredItems.length}`;
  }

  function nextLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % activeFilteredItems.length;
    updateLightboxContent();
  }

  function prevLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + activeFilteredItems.length) % activeFilteredItems.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
  });

  // ------------------------------------------------------------------------
  // 6. WHATSAPP LINK ENQUIRY GENERATOR (Updated number: 7382965054)
  // ------------------------------------------------------------------------
  const whatsappBtns = document.querySelectorAll('[data-whatsapp-plan]');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-whatsapp-plan') || 'General Membership';
      const text = encodeURIComponent(`Hello Anand Library, I would like to inquire about the ${plan} plan at your Patna self-study centre.`);
      window.open(`https://wa.me/917382965054?text=${text}`, '_blank');
    });
  });
});
