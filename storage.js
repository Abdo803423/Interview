// High-Fidelity LocalStorage State Controller
const StorageEngine = {
    PREFIX: "B_INTERVIEW_BOOTCAMP_",

    saveState(key, data) {
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
        } catch (e) {
            console.error("Storage write error inside platform configuration: ", e);
        }
    },

    getState(key) {
        try {
            const raw = localStorage.getItem(this.PREFIX + key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error("Storage fetch error: ", e);
            return null;
        }
    },

    clearProgress() {
        const targetKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(this.PREFIX)) {
                targetKeys.push(k);
            }
        }
        targetKeys.forEach(k => localStorage.removeItem(k));
    }
};