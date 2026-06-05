// (() => {
// 	const CONFIG = {
// 		SELECTORS: {
// 			body: "body",
// 			navigation: "#cs-navigation",
// 			hamburger: "#cs-toggle",
// 			menuOverlay: ".cs-menu-overlay",
// 			dropdownToggle: ".cs-dropdown-toggle",
// 			dropdown: ".cs-dropdown",
// 			dropdownMenu: ".cs-drop-ul",
// 		},
// 		CLASSES: {
// 			active: "cs-active",
// 			menuOpen: "cs-open",
// 			hidden: "cs-hidden",
// 		},
// 	};

// 	const elements = {
// 		body: document.querySelector(CONFIG.SELECTORS.body),
// 		navigation: document.querySelector(CONFIG.SELECTORS.navigation),
// 		hamburger: document.querySelector(CONFIG.SELECTORS.hamburger),
// 		menuOverlay: document.querySelector(CONFIG.SELECTORS.menuOverlay),
// 	};

// 	// Dropdown Management
// 	const dropdownManager = {
// 		close(dropdown) {
// 			if (!dropdown || !dropdown.classList.contains(CONFIG.CLASSES.active)) return;
// 			dropdown.classList.remove(CONFIG.CLASSES.active);
// 			const button = dropdown.querySelector(CONFIG.SELECTORS.dropdownToggle);
// 			if (button) button.setAttribute("aria-expanded", "false");
// 		},

// 		toggle(dropdown) {
// 			const isOpen = dropdown.classList.toggle(CONFIG.CLASSES.active);
// 			const button = dropdown.querySelector(CONFIG.SELECTORS.dropdownToggle);
// 			if (button) button.setAttribute("aria-expanded", String(isOpen));
// 		},

// 		closeAll() {
// 			document.querySelectorAll(`${CONFIG.SELECTORS.dropdown}.${CONFIG.CLASSES.active}`)
// 				.forEach((d) => this.close(d));
// 		},
// 	};

// 	// Menu Management
// 	const menuManager = {
// 		toggle() {
// 			const isOpening = !elements.navigation.classList.contains(CONFIG.CLASSES.active);

// 			elements.navigation.classList.toggle(CONFIG.CLASSES.active);
// 			elements.menuOverlay.classList.toggle(CONFIG.CLASSES.active);
// 			elements.body.classList.toggle(CONFIG.CLASSES.menuOpen);
// 			elements.hamburger.setAttribute("aria-expanded", String(isOpening));
// 			elements.menuOverlay.setAttribute("aria-hidden", String(!isOpening));

// 			// Always show nav when menu opens
// 			if (isOpening) {
// 				elements.navigation.classList.remove(CONFIG.CLASSES.hidden);
// 			}

// 			if (!isOpening) dropdownManager.closeAll();
// 		},

// 		close() {
// 			if (!elements.navigation.classList.contains(CONFIG.CLASSES.active)) return;
// 			elements.navigation.classList.remove(CONFIG.CLASSES.active);
// 			elements.menuOverlay.classList.remove(CONFIG.CLASSES.active);
// 			elements.body.classList.remove(CONFIG.CLASSES.menuOpen);
// 			elements.hamburger.setAttribute("aria-expanded", "false");
// 			elements.menuOverlay.setAttribute("aria-hidden", "true");
// 			dropdownManager.closeAll();
// 		},
// 	};

// 	// Scroll show/hide
// 	const scrollManager = {
// 		lastY: window.scrollY,

// 		init() {
// 			window.addEventListener("scroll", () => {
// 				const currentY = window.scrollY;
// 				const menuOpen = elements.navigation.classList.contains(CONFIG.CLASSES.active);

// 				// Never hide while menu is open
// 				if (menuOpen) {
// 					this.lastY = currentY;
// 					return;
// 				}

// 				// Always show at top of page
// 				if (currentY <= 0) {
// 					elements.navigation.classList.remove(CONFIG.CLASSES.hidden);
// 					this.lastY = currentY;
// 					return;
// 				}

// 				if (currentY > this.lastY) {
// 					// Scrolling down — hide
// 					elements.navigation.classList.add(CONFIG.CLASSES.hidden);
// 				} else {
// 					// Scrolling up — show
// 					elements.navigation.classList.remove(CONFIG.CLASSES.hidden);
// 				}

// 				this.lastY = currentY;
// 			}, { passive: true });
// 		},
// 	};

// 	// Event listeners
// 	const init = () => {
// 		if (!elements.hamburger) return;

// 		// Hamburger click
// 		elements.hamburger.addEventListener("click", menuManager.toggle.bind(menuManager));

// 		// Dropdown clicks inside overlay
// 		elements.menuOverlay.addEventListener("click", (e) => {
// 			const button = e.target.closest(CONFIG.SELECTORS.dropdownToggle);
// 			if (!button) return;
// 			e.preventDefault();
// 			const dropdown = button.closest(CONFIG.SELECTORS.dropdown);
// 			if (dropdown) dropdownManager.toggle(dropdown);
// 		});

// 		// Escape key
// 		document.addEventListener("keydown", (e) => {
// 			if (e.key !== "Escape") return;
// 			if (dropdownManager.closeAll()) return;
// 			menuManager.close();
// 			elements.hamburger.focus();
// 		});

// 		// Resize
// 		window.addEventListener("resize", () => {
// 			if (window.innerWidth >= 1024 && elements.navigation.classList.contains(CONFIG.CLASSES.active)) {
// 				// Keep open on desktop — remove this block if you want it to close on resize
// 			}
// 		});

// 		// Scroll
// 		scrollManager.init();
// 	};

// 	init();
// })();