const themeStylesheet = document.querySelector("#theme-stylesheet");
const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");


isDarkMode = () => {
    if (themeQuery.matches) {
        return true;
    } else if (!themeQuery.matches) {
        return false;
    }
}

setTheme = () => {
    if (!isDarkMode()) {
        themeStylesheet.href = "/css/theme/light.css"
        // console.log("light-theme set");
    } else if (isDarkMode()) {
        themeStylesheet.href = "/css/theme/dark.css"
        // console.log("dark-theme set");
    }
}

setTheme();
themeQuery.addEventListener("change", setTheme);