/* ============================================================
   ShvanTV+ Theme Engine
   - Dark / Light Mode
   - Auto Save
   - Smooth Transition
============================================================ */

/* ----------------------------------------------
   LOAD THEME FROM STORAGE
---------------------------------------------- */
let currentTheme = localStorage.getItem("shvantv_theme") || "dark";

/* Apply saved theme immediately */
document.addEventListener("DOMContentLoaded", () => {
    applyTheme(currentTheme, false);
});


/* ----------------------------------------------
   APPLY THEME (MAIN FUNCTION)
---------------------------------------------- */
function applyTheme(theme, animate = true) {
    const body = document.body;

    if (animate) {
        body.style.transition = "background 0.35s ease, color 0.35s ease";
    }

    if (theme === "light") {
        body.classList.add("light");
        currentTheme = "light";
    } else {
        body.classList.remove("light");
        currentTheme = "dark";
    }

    localStorage.setItem("shmovie_theme", currentTheme);

    updateThemeIcon();
}


/* ----------------------------------------------
   TOGGLE THEME
---------------------------------------------- */
function toggleTheme() {
    if (currentTheme === "dark") {
        applyTheme("light");
    } else {
        applyTheme("dark");
    }
}


/* ----------------------------------------------
   UPDATE THEME ICON (HEADER)
---------------------------------------------- */
function updateThemeIcon() {
    const header = document.querySelector(".header-icons");

    if (!header) return;

    let icon = header.querySelector(".theme-toggle");

    if (!icon) {
        icon = document.createElement("i");
        icon.className = "theme-toggle fa";
        icon.style.marginRight = "14px";
        icon.style.cursor = "pointer";
        header.prepend(icon);
    }

    if (currentTheme === "dark") {
        icon.classList = "theme-toggle fa fa-sun";
        icon.title = "گۆڕینی بۆ دۆخی ڕووناک";
    } else {
        icon.classList = "theme-toggle fa fa-moon";
        icon.title = "گۆڕینی بۆ دۆخی تاریک";
    }

    icon.onclick = toggleTheme;
}


/* ----------------------------------------------
   EXPORT CONTROL (Used in app.js)
---------------------------------------------- */
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;