// ============ INITIALISATION PRINCIPALE ============
document.addEventListener('DOMContentLoaded', () => {
    // VÉRIFICATION DE SAUVEGARDES
    // Si les comptes principaux sont vides, essayer de récupérer depuis le backup
    if (Object.keys(accountSystem.accounts).length === 0) {
        const backup = localStorage.getItem('tetrisAccountsBackup');
        if (backup) {
            console.log('⚠️ Aucun compte trouvé. Récupération depuis le backup...');
            accountSystem.recoverFromBackup();
        }
    }

    // Backup UI removed — no setup required

    // Vérifier si un utilisateur est déjà connecté (en cas de rechargement)
    if (accountSystem.currentUser) {
        // Restaurer la session
        uiManager.showPage('lobbyPage');
        uiManager.updateLobbyDisplay();
        console.log(`✅ Session restaurée pour ${accountSystem.currentUser}`);
    } else {
        uiManager.showPage('loginPage');
    }

    // Initialiser les volumes du système audio
    const user = accountSystem.getCurrentUser();
    if (user && window.audioSystem) {
        audioSystem.setMusicVolume(user.musicVolume);
        audioSystem.setEffectsVolume(user.effectsVolume);
    }

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        // Adapter les contrôles mobiles
        const isMobile = window.innerWidth < 768;
        const mobileControls = document.querySelector('.mobile-controls');
        
        if (window.tetrisGame && window.tetrisGame.isRunning) {
            if (isMobile) {
                mobileControls.classList.add('active');
            } else {
                mobileControls.classList.remove('active');
            }
        }
    });

    // Afficher les contrôles mobiles si petit écran au démarrage
    if (window.innerWidth < 768) {
        document.querySelector('.mobile-controls').classList.remove('active');
    }

    // ============ DÉSACTIVER LE DÉFILEMENT SUR LA PAGE JEU ============
    // Empêcher le scroll avec la molette, les touches clavier et le tactile
    const disableGamePageScroll = (e) => {
        const gamePage = document.getElementById('gamePage');
        if (gamePage && gamePage.classList.contains('active')) {
            // Empêcher les touches de défilement (Space, Page Down, Page Up, arrows)
            const scrollKeys = [' ', 'PageDown', 'PageUp', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
            if (scrollKeys.includes(e.key)) {
                e.preventDefault();
            }
            // Empêcher la molette de souris
            if (e.type === 'wheel') {
                e.preventDefault();
            }
        }
    };

    document.addEventListener('wheel', disableGamePageScroll, { passive: false });
    document.addEventListener('keydown', disableGamePageScroll, { passive: false });
    document.addEventListener('touchmove', disableGamePageScroll, { passive: false });

    console.log('🎮 District - Tetris Game initialized');
    console.log(`📊 Comptes en mémoire: ${Object.keys(accountSystem.accounts).length}`);
});

// Sauvegarder les données avant de quitter
window.addEventListener('beforeunload', (e) => {
    // Sauvegarder une dernière fois
    if (accountSystem.currentUser) {
        accountSystem.saveAccounts();
        accountSystem.saveCurrentSession();
    }
    
    if (accountSystem.currentUser && window.tetrisGame && window.tetrisGame.isRunning) {
        e.preventDefault();
        e.returnValue = '';
    }
});
