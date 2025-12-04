function toggleMenu() {
    const nav = document.querySelector('.nav-menu');
    const toggleIcon = document.querySelector('.mobile-toggle i');
    
    nav.classList.toggle('active');
    
    // Optional: Switch icon from List to X
    if (nav.classList.contains('active')) {
        toggleIcon.classList.replace('ph-list', 'ph-x');
    } else {
        toggleIcon.classList.replace('ph-x', 'ph-list');
    }
}