(() => {
  const root = document.documentElement;
  const rtlLanguages = new Set([
    "ar",
    "dv",
    "fa",
    "he",
    "iw",
    "ps",
    "ur",
    "yi",
  ]);

  function getLanguageCode(language) {
    const detectedLanguage = language || root.getAttribute("lang") || navigator.language || "en";
    return detectedLanguage.toLowerCase().split("-")[0].split("_")[0];
  }

  function updateDirection(language) {
    const isRtl = rtlLanguages.has(getLanguageCode(language));
    root.setAttribute("dir", isRtl ? "rtl" : "ltr");
    root.classList.toggle("is-rtl", isRtl);
  }

  function updateFromGoogleTranslate() {
    const languageSelect = document.querySelector(".goog-te-combo");
    if (languageSelect && languageSelect.value) {
      updateDirection(languageSelect.value);
    }
  }

  updateDirection();

  const languageObserver = new MutationObserver((mutations) => {
    const languageChanged = mutations.some((mutation) => mutation.attributeName === "lang");
    const translatedLtr = root.classList.contains("translated-ltr");
    const translatedRtl = root.classList.contains("translated-rtl");

    if (languageChanged) {
      updateDirection();
    } else if (translatedLtr) {
      updateDirection("en");
    } else if (translatedRtl) {
      updateDirection("ar");
    }
  });

  languageObserver.observe(root, {
    attributes: true,
    attributeFilter: ["lang", "class"],
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches(".goog-te-combo")) {
      updateDirection(event.target.value);
    }
  });

  const translateObserver = new MutationObserver(updateFromGoogleTranslate);
  translateObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  updateFromGoogleTranslate();
})();
