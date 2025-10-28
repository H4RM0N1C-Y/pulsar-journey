// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
}

// Get all ticker layers
const layer1 = document.querySelector('.layer1');
const layer2 = document.querySelector('.layer2');
const layer3 = document.querySelector('.layer3');
const layer4 = document.querySelector('.layer4');

// Preset combinations: [layer1, layer2, layer3, layer4]
const presets = [
  ['Students', 'who', 'organize', 'projects'],
  ['Students', 'who', 'share', 'ideas'],
  ['Students', 'to', 'plan', 'goals'],
  ['Teams', 'who', 'track', 'tasks'],
  ['Teams', 'to', 'connect', 'ideas'],
  ['Teams', 'who', 'create', 'solutions'],
  ['Makers', 'who', 'organize', 'ideas'],
  ['Makers', 'to', 'share', 'creations'],
  ['Makers', 'who', 'learn', 'projects'],
  ['Thinkers', 'who', 'plan', 'goals'],
  ['Thinkers', 'who', 'create', 'solutions'],
  ['Thinkers', 'to', 'organize', 'notes']
];

let currentPresetIndex = 0;
let scrollPositions = [0, 0, 0, 0];
let layersFrozen = [false, false, false, false];
let centerItems = [null, null, null, null];
let allFrozen = false;
let animationFrameId = null;

const layers = [layer1, layer2, layer3, layer4];
const scrollSpeeds = [50, 50, 50, 50]; // Slowed down speeds, especially layer 4

// Function to find target word items in center region
function findTargetInCenter(layer, targetWord) {
  const items = layer.querySelectorAll('.scroller-item');
  const container = layer.parentElement;
  const containerRect = container.getBoundingClientRect();
  const centerX = containerRect.left + containerRect.width / 2;
  
  // Look for any item with target word in center region (wider threshold)
  for (let item of items) {
    if (item.dataset.word === targetWord) {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(itemCenterX - centerX);
      
      // Much wider threshold - 100px
      if (distance < 100) {
        console.log(`Found ${targetWord} at distance ${distance}px`);
        return { found: true, item: item, distance: distance };
      }
    }
  }
  
  return { found: false, item: null, distance: Infinity };
}

// Main animation loop
function animate() {
  if (allFrozen) return;
  
  const preset = presets[currentPresetIndex];
  
  layers.forEach((layer, index) => {
    // Skip if this layer is already frozen
    if (layersFrozen[index]) return;
    
    const items = layer.querySelectorAll('.scroller-item');
    const itemWidth = items[0].offsetWidth + parseFloat(getComputedStyle(layer).gap);
    const totalWidth = itemWidth * (items.length / 2);
    
    // Continue scrolling this layer
    scrollPositions[index] -= scrollSpeeds[index];
    
    // Reset position for infinite loop
    if (Math.abs(scrollPositions[index]) >= totalWidth) {
      scrollPositions[index] = 0;
    }
    
    layer.style.transition = 'none';
    layer.style.transform = `translateX(${scrollPositions[index]}px)`;
    
    // Check if target word is in center AND if we're allowed to freeze
    const canFreeze = !window.canFreezeAfter || Date.now() >= window.canFreezeAfter;
    const centerCheck = findTargetInCenter(layer, preset[index]);
    if (centerCheck.found && canFreeze) {
      // Freeze this layer at its current position
      layersFrozen[index] = true;
      centerItems[index] = centerCheck.item;
      console.log(`✓ Layer ${index + 1} FROZEN with word: "${preset[index]}" (distance: ${centerCheck.distance.toFixed(1)}px)`);
    }
  });
  
  // Check if all layers are frozen
  if (layersFrozen.every(frozen => frozen === true)) {
    allFrozen = true;
    console.log('🎯 ALL LAYERS FROZEN! Highlighting...');
    highlightAndPause();
    return;
  }
  
  animationFrameId = requestAnimationFrame(animate);
}

// Highlight all words and pause for 3 seconds
function highlightAndPause() {
  // Highlight all center items
  centerItems.forEach((item, index) => {
    if (item) {
      item.classList.add('highlighted');
      console.log(`Highlighted layer ${index + 1}: ${item.dataset.word}`);
    }
  });
  
  // Wait 3 seconds then smoothly unhighlight and unfreeze
  setTimeout(() => {
    console.log('⏭️ Starting smooth transition...');
    
    // Gradually fade out highlights over 0.3 seconds
    centerItems.forEach((item) => {
      if (item) {
        item.style.transition = 'all 0.3s ease';
        item.classList.remove('highlighted');
      }
    });
    
    // Move to next preset
    currentPresetIndex = (currentPresetIndex + 1) % presets.length;
    console.log(`📋 Next preset will be: ${presets[currentPresetIndex].join(' ')}`);
    
    // Gradually unfreeze layers one by one with slight delays for smooth effect
    setTimeout(() => { layersFrozen[0] = false; }, 0);
    setTimeout(() => { layersFrozen[1] = false; }, 250);
    setTimeout(() => { layersFrozen[2] = false; }, 500);
    setTimeout(() => { layersFrozen[3] = false; }, 750);
    
    // Reset state
    centerItems = [null, null, null, null];
    allFrozen = false;
    
    // Wait 3 seconds before allowing next preset to lock (starting from first layer unfreeze)
    const waitUntil = Date.now() + 2000;
    window.canFreezeAfter = waitUntil;
    
    // Resume animation after last layer unfreezes
    setTimeout(() => {
      animate();
    }, 250);
    
  }, 2000);
}

// Start the animation
function startAnimation() {
  console.log(`🚀 Starting with preset 1: ${presets[0].join(' ')}`);
  animate();
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