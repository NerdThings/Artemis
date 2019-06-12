// Artemis Config
// Can be modified by users of the library

const config = {
    preferenceCookieDays: 365,
    defaultToMobileNav: true,
    goodBrowsers: ["chrome", "edge", "newedge", "chrome-ios"]
};

// Preferences system

const preferences = {
    // Getters

    isDarkMode: function() {
        let dark = preferences.getConfigValue("darkmode");
        if (dark === undefined) {
            preferences.setDarkMode(false);
            return false;
        }

        return dark;
    },

    getConfig: function() {
        let prefs_str = getCookie("artemis_prefs");
        if (prefs_str === "") {
            setCookie("artemis_prefs", "{}", config.preferenceCookieDays);
            prefs_str = "{}";
        }
        return JSON.parse(prefs_str);
    },

    getConfigValue: function(field) {
        let conf = preferences.getConfig();
        return conf[field];
    },

    // Setters

    setDarkMode: function(isDarkmode) {
        preferences.setConfigValue("darkmode", isDarkmode);

        if (isDarkmode) {
            removeClassFrom(document.getElementsByTagName("html")[0], "dark");
            addClassTo(document.getElementsByTagName("html")[0], "dark");
        } else {
            removeClassFrom(document.getElementsByTagName("html")[0], "dark");
        }
    },

    toggleDarkMode: function() {
        if (preferences.isDarkMode()) {
            preferences.setDarkMode(false);
        } else {
            preferences.setDarkMode(true);
        }
    },

    setConfig: function(json) {
        setCookie("artemis_prefs", JSON.stringify(json), config.preferenceCookieDays);
    },

    setConfigValue: function(field, value) {
        let conf = preferences.getConfig();
        conf[field] = value;
        preferences.setConfig(conf);
    }
};

// Browser Support Helper
// This adds .good-browser to supported browsers

//https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome/13348618#13348618
let isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && window.navigator.vendor.toLowerCase().indexOf("google") > -1;
let isNewEdge = window.navigator.userAgent.toLowerCase().indexOf("edg") > -1 && window.navigator.userAgent.indexOf("Edge") < 0;
let isOpera = typeof window.opr !== "undefined";
let isEdge = window.navigator.userAgent.indexOf("Edge") > -1;
let isIE = window.navigator.userAgent.indexOf("MSIE") > -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
let isIOSChrome = window.navigator.userAgent.match("CriOS");
let isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
let browser = "unknown";
if (isNewEdge) {
    browser = "newedge";
} else if (isChrome) {
    browser = "chrome";
} else if (isOpera) {
    browser = "opera";
} else if (isEdge) {
    browser = "edge";
} else if (isIOSChrome) {
    browser = "chrome-ios"
} else if (isFirefox) {
    browser = "firefox";
} else if (isIE) {
    browser = "internet-explorer";
}

let browser_isgood = false;
config.goodBrowsers.forEach(function(b) {
    if (b === browser)
        browser_isgood = true;
});

// Good browser gets good stuff

if (browser_isgood) {
    document.getElementsByTagName("html")[0].className += " good-browser";
}

// Preloading Helper

// This stops all transitions until the page is loaded

addClassTo(document.getElementsByTagName("html")[0], "preload");

if (preferences.isDarkMode()) {
    addClassTo(document.getElementsByTagName("html")[0], "dark");
}

onload = function() {
    removeClassFrom(document.getElementsByTagName("html")[0], "preload");

    if (preferences.isDarkMode()) {
        // Remove to prevent duping
        removeClassFrom(document.getElementsByTagName("html")[0], "dark");
        addClassTo(document.getElementsByTagName("html")[0], "dark");
    }

    checkForMobile();
};

// Smart nav bar mobile mode

function checkForMobile() {
    let nav = document.getElementById("nav");
    if (nav !== undefined && nav !== null) {
        addClassTo(nav, "intermediate");
        removeClassFrom(nav, "mobile");
        if (isOverflown(nav)) {
            addClassTo(nav, "mobile");
        } else {
            removeClassFrom(nav, "mobile");
        }
        setTimeout(function() { removeClassFrom(nav, "intermediate") }, 0.5);
    }
}

// Default to mobile nav to avoid any flickering
if (config.defaultToMobileNav) {
    addClassTo(document.getElementById("nav"), "mobile");
}

// Add resize event
window.addEventListener("resize", checkForMobile);

// Helpers

function addClassTo(elm, class_) {
    elm.className += " " + class_;
}

function removeClassFrom(elm, class_) {
    elm.className = elm.className.replace(class_, "");
    elm.className = elm.className.replace(/ {1,}/g," ");
}

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing/9541579#9541579
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

// Cookies from w3 schools because I am lazy
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}