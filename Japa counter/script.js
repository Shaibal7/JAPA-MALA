// DOM Elements
const countDisplay = document.getElementById('count');
const roundDisplay = document.getElementById('round');
const progressDisplay = document.getElementById('progress');
const targetDisplay = document.getElementById('targetDisplay');
const malaBeads = document.querySelectorAll('.mala-bead');
const mantrasContainer = document.querySelector('.mantras');

// Initialize variables
let count = localStorage.getItem('count') ? parseInt(localStorage.getItem('count')) : 0;
let roundCount = localStorage.getItem('roundCount') ? parseInt(localStorage.getItem('roundCount')) : 0;
let dailyTarget = localStorage.getItem('dailyTarget') ? parseInt(localStorage.getItem('dailyTarget')) : 16;
const clickSound = document.getElementById('clickSound');

// Mantras array for animation
const mantras = [
    "Hare Krishna", "Hare Krishna",
    "Krishna Krishna", "Hare Hare",
    "Hare Rama", "Hare Rama",
    "Rama Rama", "Hare Hare"
];

// Initialize displays and animations
function initializeApp() {
    updateDisplays();
    updateMalaBeads();
    createMantrasAnimation();
}

// Create floating mantras animation
function createMantrasAnimation() {
    mantrasContainer.innerHTML = '';
    mantras.forEach((mantra) => {
        const span = document.createElement('span');
        span.className = 'floating-mantra';
        span.textContent = mantra;
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (Math.random() * 5 + 10) + 's';
        span.style.opacity = Math.random() * 0.5 + 0.3;
        mantrasContainer.appendChild(span);
    });
}

// Update mala beads visualization
function updateMalaBeads() {
    malaBeads.forEach((bead, index) => {
        if (index < count) {
            bead.classList.add('active');
        } else {
            bead.classList.remove('active');
        }
    });
}

// Handle daily target changes
document.getElementById('dailyTarget').addEventListener('change', function() {
    dailyTarget = parseInt(this.value) || 16;
    localStorage.setItem('dailyTarget', dailyTarget);
    targetDisplay.textContent = dailyTarget;
    updateProgressRing();
});

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        incrementCount();
    }
});

// Increment count function with animations
function incrementCount() {
    count++;
    playFeedback();
    
    // Animate current bead
    const currentBead = malaBeads[count - 1];
    if (currentBead) {
        currentBead.classList.add('active', 'pulse');
        setTimeout(() => currentBead.classList.remove('pulse'), 500);
    }
    
    // Check if we completed a round
    if (count >= 108) {
        roundCount++;
        count = 0;
        celebrateRoundCompletion();
        malaBeads.forEach(bead => bead.classList.remove('active'));
    }
    
    updateDisplays();
    saveState();
    updateProgressRing();
}

// Celebrate round completion
function celebrateRoundCompletion() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--rotation', Math.random() * 360 + 'deg');
        particle.style.setProperty('--distance', Math.random() * 100 + 50 + 'px');
        celebration.appendChild(particle);
    }
    
    // Remove celebration after animation
    setTimeout(() => celebration.remove(), 2000);
}

// Reset count function with confirmation
function confirmReset() {
    if (confirm('Are you sure you want to reset your progress?')) {
        count = 0;
        roundCount = 0;
        
        // Reset all beads
        malaBeads.forEach(bead => {
            bead.classList.remove('active');
            // Remove any animation classes
            bead.classList.remove('pulse');
            // Force a reflow to restart animations
            void bead.offsetWidth;
        });
        
        // Reset the mala container animation
        const malaContainer = document.querySelector('.mala-beads');
        malaContainer.style.animation = 'none';
        void malaContainer.offsetWidth; // Force reflow
        malaContainer.style.animation = 'gentleSway 3s ease-in-out infinite';
        
        updateDisplays();
        saveState();
        updateProgressRing();
    }
}

// Play feedback function
function playFeedback() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {}); // Ignore autoplay restrictions
    
    // Vibrate on mobile devices if supported
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

// Update progress ring
function updateProgressRing() {
    const progress = (roundCount / dailyTarget) * 100;
    const ring = document.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 60; // radius = 60
    ring.style.strokeDashoffset = circumference - (progress / 100) * circumference;
}

// Update all displays
function updateDisplays() {
    countDisplay.textContent = count;
    roundDisplay.textContent = roundCount;
    progressDisplay.textContent = roundCount;
    targetDisplay.textContent = dailyTarget;
    updateProgressRing();
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('count', count);
    localStorage.setItem('roundCount', roundCount);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initializeApp); 