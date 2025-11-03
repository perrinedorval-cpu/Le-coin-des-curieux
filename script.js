document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la modale de connexion
    const loginBtn = document.getElementById('login-btn');
    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close');

    loginBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.main-nav ul');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Animation sur les cartes
    const cards = document.querySelectorAll('article, .resource-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Gestion de la recherche
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            alert('Recherche de : ' + query);
            // Redirection vers une page de résultats (à implémenter)
            // window.location.href = `recherche.html?q=${encodeURIComponent(query)}`;
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});
