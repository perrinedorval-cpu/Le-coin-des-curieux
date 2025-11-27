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
                if (window.innerWidth <= 992) {
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

    // Normalisation des chaînes (pour la recherche)
    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Filtrer les articles et ressources
    function filterContent(query) {
        const lowerQuery = normalizeString(query);
        // Filtrer les articles
        document.querySelectorAll('.article-card').forEach(article => {
            const title = normalizeString(article.querySelector('h3').textContent);
            const content = normalizeString(article.querySelector('p').textContent);
            const category = normalizeString(article.getAttribute('data-category') || '');
            article.style.display = (title.includes(lowerQuery) || content.includes(lowerQuery) || category.includes(lowerQuery)) ? 'block' : 'none';
        });
        // Filtrer les ressources
        document.querySelectorAll('.resource-card h3').forEach(title => {
            const resourceTitle = normalizeString(title.textContent);
            const card = title.closest('.resource-card');
            card.style.display = resourceTitle.includes(lowerQuery) ? 'block' : 'none';
        });
    }

    // =============================================
    // 3. Navigation vers les articles
    // =============================================
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Vérifier si le clic provient du bouton "Lire la suite" ou de la carte
            if (e.target.classList.contains('btn-read') || e.target.closest('.btn-read') || e.target.closest('.article-card')) {
                const url = card.getAttribute('data-url');
                if (url) {
                    window.location.href = url + '?id=' + card.getAttribute('data-category');
                }
            }
        });
    });

    // =============================================
    // 4. Connexion enseignant (modale)
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
    // 5. Forum d'échange
    // =============================================
    const postButton = document.getElementById('post-message');
    const forumMessages = document.getElementById('forum-messages');
    const forumMessageInput = document.getElementById('forum-message');

    // Charger les messages depuis le localStorage
    function loadMessages() {
        const savedMessages = localStorage.getItem('forumMessages');
        if (savedMessages) {
            JSON.parse(savedMessages).forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.className = 'forum-message';
                messageElement.innerHTML = msg;
                forumMessages.appendChild(messageElement);
            });
            forumMessages.scrollTop = forumMessages.scrollHeight;
        }
    }

    // Sauvegarder les messages dans le localStorage
    function saveMessages() {
        const messages = Array.from(forumMessages.children).map(msg => msg.innerHTML);
        localStorage.setItem('forumMessages', JSON.stringify(messages));
    }

    // Initialiser le forum
    loadMessages();

    if (postButton && forumMessages && forumMessageInput) {
        postButton.addEventListener('click', () => {
            const message = forumMessageInput.value.trim();
            if (message) {
                const messageElement = document.createElement('div');
                messageElement.className = 'forum-message';
                messageElement.innerHTML = `<p>${message}</p><small>${new Date().toLocaleString('fr-FR')}</small>`;
                forumMessages.appendChild(messageElement);
                forumMessageInput.value = '';
                forumMessages.scrollTop = forumMessages.scrollHeight;
                saveMessages();
                showNotification('Votre message a été publié !', 'success');
            } else {
                showNotification('Veuillez écrire un message.', 'warning');
            }
        });
    }

    // =============================================
    // 6. Calendrier des webinaires (FullCalendar)
    // =============================================
    const webinaires = [
        {
            id: 1,
            title: 'Stratégies pour les élèves dyslexiques',
            start: '2025-11-15T14:00:00',
            end: '2025-11-15T15:30:00',
            extendedProps: {
                description: 'Méthodes adaptées.',
                organisateur: 'Marie Dupont'
            }
        },
        {
            id: 2,
            title: 'Gestion de classe et TDAH',
            start: '2025-11-18T16:30:00',
            end: '2025-11-18T18:00:00',
            extendedProps: {
                description: 'Outils pour gérer l’attention.',
                organisateur: 'Jean Martin'
            }
        },
        {
            id: 3,
            title: 'Outils numériques en classe',
            start: '2025-11-22T10:00:00',
            end: '2025-11-22T11:30:00',
            extendedProps: {
                description: 'Présentation d’applications.',
                organisateur: 'Sophie Lambert'
            }
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
    // 7. Notifications
    // =============================================
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 500);
        }, 2700);
    }

    // =============================================
    // 8. Mise en évidence de la section active
    // =============================================
    const sections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('.nav-list .nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
