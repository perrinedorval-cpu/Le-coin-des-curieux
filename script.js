document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. Menu mobile
    // =============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
        // Fermer le menu après clic sur un lien (mobile)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) { // 992px est une meilleure valeur pour mobile/tablette
                    navList.classList.remove('active');
                }
            });
        });
    }

    // =============================================
    // 2. Recherche
    // =============================================
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                showNotification(`Recherche de : "${query}"`, 'info');
                filterContent(query);
            } else {
                showNotification('Veuillez entrer un terme de recherche.', 'warning');
                filterContent(''); // Réinitialise le filtre
            }
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchButton.click();
        });
    }

    // Filtrer les articles
    function filterContent(query) {
        const articles = document.querySelectorAll('.article-card');
        const lowerQuery = query.toLowerCase();
        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const content = article.querySelector('p').textContent.toLowerCase();
            const category = article.getAttribute('data-category') || '';
            if (title.includes(lowerQuery) ||
                content.includes(lowerQuery) ||
                category.includes(lowerQuery)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }

    // =============================================
    // 3. Connexion enseignant (modale) - LOGIQUE CORRIGÉE
    // =============================================
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.modal .close');
    const loginForm = document.getElementById('login-form');

    // Ouvrir la modale
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }

    // Fermer la modale avec le bouton (X)
    if (closeBtn && loginModal) {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            loginForm.reset();
        });
    }

    // Fermer la modale en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            loginForm.reset();
        }
    });

    // Soumission du formulaire
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Les champs email et password sont dans la modale, on les récupère par le formulaire
            const email = loginForm.querySelector('#email').value.trim();
            const password = loginForm.querySelector('#password').value.trim();
            if (email && password) {
                showNotification(`Connexion réussie en tant que ${email} !`, 'success');
                loginModal.style.display = 'none';
                loginForm.reset();
            } else {
                showNotification('Veuillez remplir tous les champs.', 'warning');
            }
        });
    }

    // =============================================
    // 4. Forum d'échange
    // =============================================
    const postButton = document.getElementById('post-message');
    const forumMessages = document.getElementById('forum-messages');
    const forumMessageInput = document.getElementById('forum-message');
    if (postButton && forumMessages && forumMessageInput) {
        postButton.addEventListener('click', () => {
            const message = forumMessageInput.value.trim();
            if (message) {
                const messageElement = document.createElement('div');
                messageElement.className = 'forum-message';
                messageElement.innerHTML = `
                    <p>${message}</p>
                    <small>${new Date().toLocaleString('fr-FR')}</small>
                `;
                forumMessages.appendChild(messageElement);
                forumMessageInput.value = '';
                // Fait défiler jusqu'au dernier message
                forumMessages.scrollTop = forumMessages.scrollHeight;
                showNotification('Votre message a été publié !', 'success');
            } else {
                showNotification('Veuillez écrire un message.', 'warning');
            }
        });
    }

    // =============================================
    // 5. Calendrier des webinaires (FullCalendar)
    // =============================================
    const webinaires = [
        {
            id: 1,
            title: 'Stratégies pour les élèves dyslexiques',
            start: '2025-11-15T14:00:00',
            end: '2025-11-15T15:30:00',
            extendedProps: { description: 'Méthodes adaptées.', organisateur: 'Marie Dupont' }
        },
        {
            id: 2,
            title: 'Gestion de classe et TDAH',
            start: '2025-11-18T16:30:00',
            end: '2025-11-18T18:00:00',
            extendedProps: { description: 'Outils pour gérer l’attention.', organisateur: 'Jean Martin' }
        },
        {
            id: 3,
            title: 'Outils numériques en classe',
            start: '2025-11-22T10:00:00',
            end: '2025-11-22T11:30:00',
            extendedProps: { description: 'Présentation d’applications.', organisateur: 'Sophie Lambert' }
        }
    ];

    // Initialisation du calendrier
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            events: webinaires,
            eventClick: function(info) {
                const event = info.event;
                // Pré-remplir l'ID du webinaire
                document.getElementById('webinaire-id').value = event.id;
                showNotification(`Webinaire sélectionné : ${event.title}`, 'info');
            },
            locale: 'fr',
            buttonText: {
                today: 'Aujourd\'hui',
                month: 'Mois',
                week: 'Semaine',
                list: 'Liste'
            }
        });
        calendar.render();
    }

    // Inscription aux webinaires
    const webinaireForm = document.getElementById('webinaire-inscription');
    if (webinaireForm) {
        webinaireForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const webinaireId = document.getElementById('webinaire-id').value.trim();
            const email = document.getElementById('webinaire-email').value.trim();
            if (!webinaireId || !email) {
                showNotification('Veuillez remplir tous les champs.', 'warning');
                return;
            }
            const webinaireExiste = webinaires.some(w => w.id.toString() === webinaireId);
            if (!webinaireExiste) {
                showNotification('ID de webinaire invalide.', 'warning');
                return;
            }
            showNotification(`Inscription réussie au webinaire ${webinaireId} avec l'email ${email} !`, 'success');
            webinaireForm.reset();
        });
    }

    // =============================================
    // 6. Notifications - CSS déplacé dans styles.css
    // =============================================
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            // On utilise une classe CSS pour l'effet de disparition
            notification.classList.add('hide');
            // On attend que l'animation de disparition soit finie
            setTimeout(() => notification.remove(), 500); // 500ms doit correspondre à la durée de l'animation CSS
        }, 2700);
    }

    // =============================================
    // 7. Mise en évidence de la section active
    // =============================================
    const sections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('.nav-list .nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        // Trouver la section qui est visible (avec un décalage de 100px)
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Vérifie si le haut de la section est au-dessus de 100px du haut de l'écran
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        // Mettre à jour la classe 'active'
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // =============================================
    // 8. Ouvrir une nouvelle fenêtre pour l'article sur la dyslexie
    // =============================================
    function openNewWindow(title) {
        // Crée une nouvelle fenêtre
        const newWindow = window.open('', '_blank');

        // Ajoute du contenu à la nouvelle fenêtre
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <link rel="stylesheet" href="styles.css">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Open+Sans:wght=300;400;600&family=Montserrat:wght=400;500;700&display=swap" rel="stylesheet">
            </head>
            <body>
                <header>
                    <div class="header-container">
                        <div class="logo">
                            <img src="image/logo-le-coin-des-curieux.png" alt="Le Coin Des Curieux - Site pédagogique pour enseignants" loading="lazy">
                        </div>
                        <div class="site-title">
                            <h1>${title}</h1>
                        </div>
                    </div>
                </header>
                <main>
                    <section class="article-detail">
                        <h2>${title}</h2>
                        <p>Contenu détaillé sur les stratégies pour adapter votre enseignement aux élèves dyslexiques et faciliter leur apprentissage.</p>
                    </section>
                </main>
                <footer>
                    <p>© 2025 Le Coin Des Curieux - Site pédagogique pour enseignants</p>
                </footer>
            </body>
            </html>
        `);

        // Ferme l'écriture du document
        newWindow.document.close();
    }
});
