// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
}

const ticker = document.getElementById('ticker');
const items = ticker.querySelectorAll('.scroller-item');

// Your predetermined sequence
const presets = ['Students', 'Teams', 'Makers', 'Thinkers'];
let currentPresetIndex = 0;
let isAnimating = false;
let animationInterval;

// Calculate item width + gap
function getItemWidth() {
    return items[0].offsetWidth + parseFloat(getComputedStyle(ticker).gap);
}

function scrollToWord(word) {
  // Find the first occurrence of the word that's visible
  let targetItem = null;
  let targetIndex = -1;
  
  items.forEach((item, index) => {
    if (item.dataset.word === word && index < items.length / 2) {
      if (targetItem === null) {
        targetItem = item;
        targetIndex = index;
      }
    }
  });

  if (targetItem) {
    const itemWidth = getItemWidth();
    const containerWidth = ticker.parentElement.offsetWidth;
    const targetPosition = -(targetIndex * itemWidth - containerWidth / 2 + targetItem.offsetWidth / 2);
    
    ticker.style.transform = `translateX(${targetPosition}px)`;
    
    // Highlight the word
    items.forEach(item => item.classList.remove('highlighted'));
    items.forEach(item => {
      if (item.dataset.word === word) {
        item.classList.add('highlighted');
      }
    });
  }
}

function smoothScroll() {
  const itemWidth = getItemWidth();
  let currentPosition = 0;
  const totalWidth = itemWidth * (items.length / 2); // Half since we duplicated
  const scrollSpeed = 2; // pixels per frame
  
  function animate() {
    if (!isAnimating) return;
    
    currentPosition -= scrollSpeed;
    
    // Reset position for infinite loop
    if (Math.abs(currentPosition) >= totalWidth) {
      currentPosition = 0;
    }
    
    ticker.style.transition = 'none';
    ticker.style.transform = `translateX(${currentPosition}px)`;
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function startAnimation() {
  if (animationInterval) return;
  
  isAnimating = true;
  smoothScroll();
  
  // Every 4 seconds: scroll for 2 seconds, pause for 2 seconds
  animationInterval = setInterval(() => {
    // Stop scrolling
    isAnimating = false;
    
    // Scroll to preset word
    const targetWord = presets[currentPresetIndex];
    setTimeout(() => {
      scrollToWord(targetWord);
    }, 100);
    
    // Wait 2 seconds, then continue
    setTimeout(() => {
      items.forEach(item => item.classList.remove('highlighted'));
      currentPresetIndex = (currentPresetIndex + 1) % presets.length;
      isAnimating = true;
      smoothScroll();
    }, 2000);
      
  }, 4000);
}

function stopAnimation() {
  isAnimating = false;
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}

// Auto-start
window.addEventListener('load', () => {
  setTimeout(startAnimation, 500);
});

// Get all buttons with popups
const communityBtn = document.querySelector('.community-button');
const exploreBtn = document.querySelector('.explore-button');
const resourcesBtn = document.querySelector('.resources-button');

const communityPopup = document.querySelector('.community-popup');
const explorePopup = document.querySelector('.explore-popup');
const resourcesPopup = document.querySelector('.resources-popup');

// Track if any popup is locked open by click
let lockedPopup = null;

// Track if button has been hovered off after closing
let communityHoveredOff = true;
let exploreHoveredOff = true;
let resourcesHoveredOff = true;

// Community button
communityBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (lockedPopup === communityPopup) {
    // Double click - close it
    communityPopup.classList.remove('active');
    communityPopup.classList.add('locked-closed');
    lockedPopup = null;
    communityHoveredOff = false; // Must hover off before hover works again
  } else {
    // Switch to this popup
    explorePopup.classList.remove('active');
    resourcesPopup.classList.remove('active');
    communityPopup.classList.remove('locked-closed');
    communityPopup.classList.add('active');
    lockedPopup = communityPopup;
    communityHoveredOff = true;
  }
});

communityBtn.addEventListener('mouseenter', () => {
  if (communityHoveredOff && !lockedPopup) {
    communityPopup.classList.remove('locked-closed');
  }
});

communityBtn.addEventListener('mouseleave', () => {
  communityHoveredOff = true;
  if (!lockedPopup) {
    communityPopup.classList.remove('locked-closed');
  }
});

// Explore button
exploreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (lockedPopup === explorePopup) {
    explorePopup.classList.remove('active');
    explorePopup.classList.add('locked-closed');
    lockedPopup = null;
    exploreHoveredOff = false;
  } else {
    communityPopup.classList.remove('active');
    resourcesPopup.classList.remove('active');
    explorePopup.classList.remove('locked-closed');
    explorePopup.classList.add('active');
    lockedPopup = explorePopup;
    exploreHoveredOff = true;
  }
});

exploreBtn.addEventListener('mouseenter', () => {
  if (exploreHoveredOff && !lockedPopup) {
    explorePopup.classList.remove('locked-closed');
  }
});

exploreBtn.addEventListener('mouseleave', () => {
  exploreHoveredOff = true;
  if (!lockedPopup) {
    explorePopup.classList.remove('locked-closed');
  }
});

// Resources button
resourcesBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (lockedPopup === resourcesPopup) {
    resourcesPopup.classList.remove('active');
    resourcesPopup.classList.add('locked-closed');
    lockedPopup = null;
    resourcesHoveredOff = false;
  } else {
    communityPopup.classList.remove('active');
    explorePopup.classList.remove('active');
    resourcesPopup.classList.remove('locked-closed');
    resourcesPopup.classList.add('active');
    lockedPopup = resourcesPopup;
    resourcesHoveredOff = true;
  }
});

resourcesBtn.addEventListener('mouseenter', () => {
  if (resourcesHoveredOff && !lockedPopup) {
    resourcesPopup.classList.remove('locked-closed');
  }
});

resourcesBtn.addEventListener('mouseleave', () => {
  resourcesHoveredOff = true;
  if (!lockedPopup) {
    resourcesPopup.classList.remove('locked-closed');
  }
});

// Close popups when clicking outside
document.addEventListener('click', () => {
  communityPopup.classList.remove('active');
  explorePopup.classList.remove('active');
  resourcesPopup.classList.remove('active');
  lockedPopup = null;
});

// Prevent popup clicks from closing
[communityPopup, explorePopup, resourcesPopup].forEach(popup => {
  popup.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

// Pillars Scroll Logic
const pillarsSection = document.querySelector('#pillars');
const pillarCards = document.querySelectorAll('.pillar-content-card');
const pillarSpacer = document.querySelector('.pillar-spacer');
const timelineIndicator = document.querySelector('.pillars-timeline-indicator');
let currentActivePillar = 0;

function updatePillars() {
  if (!pillarsSection || !pillarSpacer) return;
  
  const sectionTop = pillarsSection.getBoundingClientRect().top + window.scrollY;
  const spacerHeight = pillarSpacer.offsetHeight;
  const scrollY = window.scrollY;
  
  // Calculate which pillar should be active
  const relativeScroll = scrollY - sectionTop;
  const pillarIndex = Math.min(Math.max(Math.floor(relativeScroll / spacerHeight), 0), pillarCards.length - 1);
  
  // Only update if changed
  if (pillarIndex !== currentActivePillar && pillarIndex >= 0) {
    currentActivePillar = pillarIndex;
    
    pillarCards.forEach((card, index) => {
      if (index === pillarIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    // Move indicator based on pillar index
    if (timelineIndicator) {
      const lineHeight = 20; // rem
      const totalPillars = pillarCards.length;
      const segmentHeight = lineHeight / (totalPillars - 1);
      const offset = (pillarIndex * segmentHeight) - (lineHeight / 2);
      timelineIndicator.style.top = `calc(50% + ${offset}rem)`;
      
      // Update indicator color based on pillar
      const colors = [
        'rgba(102, 126, 234, 1)',
        'rgba(240, 147, 251, 1)',
        'rgba(79, 172, 254, 1)',
        'rgba(67, 233, 123, 1)',
        'rgba(250, 112, 154, 1)',
        'rgba(255, 154, 86, 1)',
        'rgba(161, 140, 209, 1)'
      ];
      timelineIndicator.style.background = colors[pillarIndex];
    }
  }
}

window.addEventListener('scroll', updatePillars);
window.addEventListener('load', updatePillars);
updatePillars();