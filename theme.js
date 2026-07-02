// Theme Controller
const ThemeEngine = {
    init() {
        const saved = StorageEngine.getState("THEME") || "dark";
        this.apply(saved);
        
        const btn = document.getElementById("theme-toggle");
        if (btn) {
            btn.addEventListener("click", () => {
                const current = document.documentElement.getAttribute("data-theme");
                const target = current === "dark" ? "light" : "dark";
                this.apply(target);
            });
        }
    },

    apply(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        StorageEngine.saveState("THEME", theme);
    }
};