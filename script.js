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
                if (window.innerWidth <= 768) {
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
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchButton.click();
        });
    }

    // Filtrer les articles
    function filterContent(query) {
        const articles = document.querySelectorAll('.article-card');
        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const content = article.querySelector('p').textContent.toLowerCase();
            const category = article.getAttribute('data-category') || '';

            if (title.includes(query.toLowerCase()) ||
                content.includes(query.toLowerCase()) ||
                category.includes(query.toLowerCase())) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }

    // =============================================
    // 3. Connexion enseignant (modale)
    // =============================================
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Connexion Enseignant</h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Mot de passe</label>
                            <input type="password" id="password" required>
                        </div>
                        <button type="submit" class="btn-submit">Se connecter</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            // Fermer la modale
            modal.querySelector('.close').addEventListener('click', () => {
                modal.remove();
            });

            // Soumission du formulaire
            const loginForm = modal.querySelector('#login-form');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();

                if (email && password) {
                    showNotification(`Connexion réussie en tant que ${email} !`, 'success');
                    modal.remove();
                } else {
                    showNotification('Veuillez remplir tous les champs.', 'warning');
                }
            });
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
                    <small>${new Date().toLocaleString()}</small>
                `;
                forumMessages.appendChild(messageElement);
                forumMessageInput.value = '';
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
            extendedProps: {
                description: 'Découvrez des méthodes adaptées pour accompagner les élèves dyslexiques.',
                organisateur: 'Marie Dupont'
            }
        },
        {
            id: 2,
            title: 'Gestion de classe et TDAH',
            start: '2025-11-18T16:30:00',
            end: '2025-11-18T18:00:00',
            extendedProps: {
                description: 'Outils pour gérer l’attention et l’organisation des élèves TDAH.',
                organisateur: 'Jean Martin'
            }
        },
        {
            id: 3,
            title: 'Outils numériques en classe',
            start: '2025-11-22T10:00:00',
            end: '2025-11-22T11:30:00',
            extendedProps: {
                description: 'Présentation d’applications pour dynamiser vos cours.',
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
    // 6. Notifications
    // =============================================
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: fadeIn 0.3s, fadeOut 0.3s 2.7s forwards;
            }
            @keyframes fadeIn {
                from { opacity: 0; top: 0; }
                to { opacity: 1; top: 20px; }
            }
            @keyframes fadeOut {
                from { opacity: 1; top: 20px; }
                to { opacity: 0; top: 0; }
            }
            .notification.success { background-color: #2ecc71; }
            .notification.warning { background-color: #f39c12; }
            .notification.info { background-color: #3498db; }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }

    // =============================================
    // 7. Mise en évidence de la section active
    // =============================================
    const sections = document.querySelectorAll('main > section');
    const navItems = document.querySelectorAll('.nav-item:not(.external)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            const link = item.querySelector('.nav-link');
            if (link.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });
});
