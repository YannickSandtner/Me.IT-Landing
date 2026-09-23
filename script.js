const languageButtons = document.querySelectorAll("[data-language]");
const translatableElements = document.querySelectorAll("[data-en][data-de]");
const translatableOptions = document.querySelectorAll("option[data-en][data-de]");

function setLanguage(language) {
  const safeLanguage = language === "de" ? "de" : "en";
  document.documentElement.lang = safeLanguage;
  document.title = safeLanguage === "de"
    ? "Intellectual Twin in der Versicherung | Eraneos"
    : "Intellectual Twin in Insurance | Eraneos";

  translatableElements.forEach((element) => {
    element.textContent = element.dataset[safeLanguage];
  });

  translatableOptions.forEach((option) => {
    option.textContent = option.dataset[safeLanguage];
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === safeLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  try {
    localStorage.setItem("intellectual-twin-insurance-language", safeLanguage);
  } catch {
    // Keep language switching and form setup working when storage is disabled.
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

let savedLanguage = null;
try {
  savedLanguage = localStorage.getItem("intellectual-twin-insurance-language");
} catch {
  // Fall back to the browser language without blocking the contact form.
}
const browserLanguage = navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
setLanguage(savedLanguage || browserLanguage);

const params = new URLSearchParams(window.location.search);
if (params.get("submitted") === "true") {
  const successMessage = document.querySelector(".form-success");
  if (successMessage) successMessage.hidden = false;
}

const formNextUrl = document.querySelector("#formNextUrl");
if (formNextUrl) {
  const cleanPath = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : /\/[^/]+\.html$/.test(window.location.pathname)
      ? window.location.pathname.replace(/[^/]+\.html$/, "")
      : `${window.location.pathname}/`;
  formNextUrl.value = `${window.location.origin}${cleanPath}?submitted=true#contact`;
}
