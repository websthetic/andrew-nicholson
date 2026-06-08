(() => {
    const CONFIG = {
        SELECTORS: {
            body: "body",
            navigation: "#cs-navigation",
            hamburger: "#cs-toggle",
            menuOverlay: ".cs-menu-overlay",
        },
        CLASSES: {
            active: "cs-active",
            menuOpen: "cs-open",
            hidden: "cs-hidden",
        },
    };

    const elements = {
        body: document.querySelector(CONFIG.SELECTORS.body),
        navigation: document.querySelector(CONFIG.SELECTORS.navigation),
        hamburger: document.querySelector(CONFIG.SELECTORS.hamburger),
        menuOverlay: document.querySelector(CONFIG.SELECTORS.menuOverlay),
    };

    const menuManager = {
        toggle() {
            const isOpening = !elements.navigation.classList.contains(CONFIG.CLASSES.active);
            elements.navigation.classList.toggle(CONFIG.CLASSES.active);
            elements.menuOverlay.classList.toggle(CONFIG.CLASSES.active);
            elements.body.classList.toggle(CONFIG.CLASSES.menuOpen);
            elements.hamburger.setAttribute("aria-expanded", String(isOpening));
            elements.menuOverlay.setAttribute("aria-hidden", String(!isOpening));
            if (isOpening) elements.navigation.classList.remove(CONFIG.CLASSES.hidden);
        },

        close() {
            if (!elements.navigation.classList.contains(CONFIG.CLASSES.active)) return;
            elements.navigation.classList.remove(CONFIG.CLASSES.active);
            elements.menuOverlay.classList.remove(CONFIG.CLASSES.active);
            elements.body.classList.remove(CONFIG.CLASSES.menuOpen);
            elements.hamburger.setAttribute("aria-expanded", "false");
            elements.menuOverlay.setAttribute("aria-hidden", "true");
        },
    };

    const scrollManager = {
        lastY: window.scrollY,

        init() {
            window.addEventListener("scroll", () => {
                const currentY = window.scrollY;
                if (elements.navigation.classList.contains(CONFIG.CLASSES.active)) {
                    this.lastY = currentY;
                    return;
                }
                if (currentY <= 0) {
                    elements.navigation.classList.remove(CONFIG.CLASSES.hidden);
                    this.lastY = currentY;
                    return;
                }
                if (currentY > this.lastY) {
                    elements.navigation.classList.add(CONFIG.CLASSES.hidden);
                } else {
                    elements.navigation.classList.remove(CONFIG.CLASSES.hidden);
                }
                this.lastY = currentY;
            }, { passive: true });
        },
    };

    const init = () => {
        if (!elements.hamburger) return;
        elements.hamburger.addEventListener("click", menuManager.toggle.bind(menuManager));
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                menuManager.close();
                elements.hamburger.focus();
            }
        });
        scrollManager.init();
    };

    init();
})();