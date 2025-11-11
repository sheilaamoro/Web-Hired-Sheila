const ConnectionStatus = {
    isConnected: false,
    staleTimer: null,
    STALE_MS: 3000,

    init(socket) {
        this.socket = socket;
        this.statusDot = document.getElementById('status-dot');
        this.statusText = document.getElementById('status-text');

        // Intentar recuperar el último estado conocido
        const lastKnownState = sessionStorage.getItem('connectionState');
        const lastStateTimestamp = parseInt(sessionStorage.getItem('connectionStateTimestamp') || '0');
        
        // Solo usar el estado guardado si no han pasado más de 2 segundos
        if (lastKnownState === 'connected' && 
            (Date.now() - lastStateTimestamp) < 1000) {
            this.setStatus(true, false); // no guardar de nuevo
        } else {
            this.setStatus(false, false); // estado inicial: desconectado
        }

        // Limpiar estado al cerrar la ventana
        window.addEventListener('beforeunload', () => {
            sessionStorage.removeItem('connectionState');
            sessionStorage.removeItem('connectionStateTimestamp');
        });
    },

    setStatus(connected, save = true) {
        this.isConnected = connected;

        if (this.statusText) {
            this.statusText.textContent = connected ? 'Conectado' : 'Desconectado';
        }

        if (this.statusDot) {
            this.statusDot.classList.toggle('connected', connected);
            this.statusDot.classList.toggle('disconnected', !connected);
            this.statusDot.classList.toggle('recording', connected);
        }

        // Guardar estado actual
        if (save) {
            if (connected) {
                sessionStorage.setItem('connectionState', 'connected');
                sessionStorage.setItem('connectionStateTimestamp', Date.now().toString());
            } else {
                sessionStorage.removeItem('connectionState');
                sessionStorage.removeItem('connectionStateTimestamp');
            }
        }

        // Reiniciar timer de desconexión si está conectado
        if (connected) {
            if (this.staleTimer) clearTimeout(this.staleTimer);
            this.staleTimer = setTimeout(() => this.setStatus(false), this.STALE_MS);
        }
    },

    onFrame() {
        this.setStatus(true);
    }
};