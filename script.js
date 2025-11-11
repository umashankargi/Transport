/* ============================================
   Engagement Gallery Script - Modern Version
   For: Harshini & Raj Shekar
============================================ */

const TOTAL_PHOTOS = 144;
const IMAGE_FOLDER = 'M/';
const IMAGE_BASE_NAME = 'A (';
const IMAGE_EXTENSION = '.JPG';

// DOM Elements
const gallery = document.getElementById('photoGallery');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImageIndex = 0;
let filteredPhotos = [];
let allPhotos = [];

/* ============================================
   INITIALIZE GALLERY
============================================ */
document.addEventListener('DOMContentLoaded', () => {
  generatePhotoData();
  filteredPhotos = [...allPhotos];
  displayPhotos(allPhotos);
  setupEventListeners();
  createFloatingHearts();
});

/* ============================================
   GENERATE PHOTO DATA
============================================ */
function generatePhotoData() {
  allPhotos = [];
  const categories = ["-", "-", "-", "-"];

  for (let i = 1; i <= TOTAL_PHOTOS; i++) {
    const filename = `${IMAGE_BASE_NAME}${i})${IMAGE_EXTENSION}`;
    const category = categories[(i - 1) % categories.length];
    allPhotos.push({
      id: i,
      category,
      src: IMAGE_FOLDER + filename,
    });
  }
}

/* ============================================
   DISPLAY PHOTOS
============================================ */
function displayPhotos(photosToDisplay) {
  gallery.innerHTML = '';

  if (photosToDisplay.length === 0) {
    gallery.innerHTML = '<div class="loading">No photos found</div>';
    return;
  }

  photosToDisplay.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = `gallery-item ${photo.category}`;
    item.setAttribute('data-index', index);

    const img = new Image();
    img.src = photo.src;
    img.alt = `Photo ${photo.id}`;
    img.loading = 'lazy';
    img.onerror = () => handleImageError(img, photo.id);

    img.onload = () => {
      item.classList.add('loaded');
      item.style.animation = `fadeIn 0.6s ease ${index * 0.03}s both`;
    };

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    item.appendChild(img);
    item.appendChild(overlay);
    gallery.appendChild(item);
  });
}

/* ============================================
   HANDLE IMAGE ERRORS
============================================ */
function handleImageError(imgElement, id) {
  const placeholderUrl = `https://placehold.co/400x500/e8e6e4/8b7355?text=Photo+${id}`;
  imgElement.src = placeholderUrl;
}

/* ============================================
   FILTER PHOTOS
============================================ */
function filterPhotos(category) {
  if (category === 'all') filteredPhotos = [...allPhotos];
  else filteredPhotos = allPhotos.filter(p => p.category === category);

  displayPhotos(filteredPhotos);
}

/* ============================================
   LIGHTBOX FUNCTIONS
============================================ */
function openLightbox(index) {
  currentImageIndex = index;
  updateLightbox();
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function updateLightbox() {
  const photo = filteredPhotos[currentImageIndex];
  lightboxImg.src = photo.src;
}

/* Navigation */
function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
  updateLightbox();
}
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % filteredPhotos.length;
  updateLightbox();
}

/* Swipe Support for Mobile */
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
lightbox.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].clientX;
  if (touchEndX - touchStartX > 50) prevImage();
  if (touchStartX - touchEndX > 50) nextImage();
});

/* ============================================
   EVENT LISTENERS
============================================ */
function setupEventListeners() {
  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPhotos(btn.dataset.filter);
    });
  });

  // Gallery click
  gallery.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      const index = parseInt(item.dataset.index);
      openLightbox(index);
    }
  });

  // Lightbox controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    }
  });

  // Click outside image to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}

/* ============================================
   FLOATING SYMBOLS
============================================ */
function createFloatingHearts() {
  const heartContainer = document.getElementById('floatingHearts');
  const numberOfHearts = 25;
  const symbols = ['♥', '❀', '⚜', '✧'];

  for (let i = 0; i < numberOfHearts; i++) {
    const el = document.createElement('span');
    el.className = 'heart';
    el.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${Math.random() * 10 + 15}s`;
    el.style.animationDelay = `-${Math.random() * 25}s`;
    heartContainer.appendChild(el);
  }
}

/* ============================================
   OPTIONAL: SHARE TO WHATSAPP
============================================ */
function shareToWhatsApp(photoUrl) {
  const text = `Check out this engagement photo 💍✨: ${photoUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}

/* ============================================
   SMALL ANIMATION KEYFRAME
============================================ */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
