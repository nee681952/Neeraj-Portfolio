
/* ===== Mobile Navigation ===== */

const navLinks = document.querySelector(".nav-links");

const menuButton = document.createElement("button");
menuButton.textContent = "☰";
menuButton.className = "menu-button";
menuButton.setAttribute("aria-label", "Toggle navigation");

const navbar = document.querySelector(".navbar");

if (navbar && navLinks) {
    navbar.insertBefore(menuButton, navLinks);

    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("show-menu");

        const isOpen = navLinks.classList.contains("show-menu");
        menuButton.textContent = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show-menu");
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}

/* ===== Reveal Sections While Scrolling ===== */

const sections = document.querySelectorAll(".section, .hero");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.12
    });

    sections.forEach((section) => {
        observer.observe(section);
    });
}

/* ===== Footer Year ===== */

const footerText = document.querySelector("footer p");

if (footerText) {
    footerText.textContent =
        `© ${new Date().getFullYear()} Neeraj J.All rights reserved.`;
}



/* ===== Portfolio Messaging via WhatsApp ===== */
(() => {
    const WHATSAPP_NUMBER = "918762828712"; // Replace with your WhatsApp number with country code, digits only.

    const toggle = document.getElementById("chatToggle");
    const close = document.getElementById("chatClose");
    const chatWindow = document.getElementById("chatWindow");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");
    const directButton = document.getElementById("whatsappDirect");
    const quickActions = document.querySelectorAll("[data-chat]");

    if (!toggle || !close || !chatWindow || !form ||
        !input || !messages || !directButton) {
        return;
    }

    function openWhatsApp(message = "Hi Neeraj! I visited your portfolio and would like to connect.") {
        // Use your WhatsApp number with country code, digits only.
        if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
            WHATSAPP_NUMBER.includes("YOURNUMBER")) {
            addMessage(
                "Please set your WhatsApp number in script.js first. Use your country code and number, digits only.",
                "assistant"
            );
            return;
        }

        const url = "https://wa.me/" + WHATSAPP_NUMBER +
                    "?text=" + encodeURIComponent(message);

        window.open(url, "_blank", "noopener,noreferrer");
    }

    function setChatOpen(open) {
        chatWindow.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close chat" : "Open chat");

        if (open) input.focus();
    }

    function addMessage(text, sender) {
        const message = document.createElement("div");
        message.className = "chat-message " + sender + "-message";
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    }

    toggle.addEventListener("click", () => {
        setChatOpen(chatWindow.hidden);
    });

    close.addEventListener("click", () => setChatOpen(false));

    
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const loadingMessage = addMessage(
    "Thinking...",
    "assistant"
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    
const data = await response.json();

loadingMessage.textContent = data.reply ||
    "I don't have that information available. Please contact Neeraj via WhatsApp.";

if (data.whatsapp) {
    const whatsappButton = document.createElement("button");
    whatsappButton.type = "button";
    whatsappButton.className = "chat-whatsapp-reply";
    whatsappButton.textContent = "Contact me on WhatsApp";

    whatsappButton.addEventListener("click", () => {
        window.open(data.whatsapp, "_blank", "noopener,noreferrer");
    });

    loadingMessage.appendChild(document.createElement("br"));
    loadingMessage.appendChild(whatsappButton);
}
} catch (error) {
    loadingMessage.textContent =
        "Sorry, the chatbot is temporarily unavailable. Please contact Neeraj using the WhatsApp button below.";
}
});

quickActions.forEach((button) => {
        button.addEventListener("click", () => {
            const text = button.dataset.chat;
            input.value = text;
            input.focus();
        });
    });

    directButton.addEventListener("click", () => {
        openWhatsApp();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !chatWindow.hidden) {
            setChatOpen(false);
            toggle.focus();
        }
    });
})();



/* ===== Reading Progress + Back to Top ===== */
(() => {
    const progressBar = document.getElementById("reading-progress");
    const backToTopButton = document.getElementById("back-to-top");

    if (!progressBar || !backToTopButton) return;

    function updateScrollFeatures() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const scrollPercent = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;

        if (window.scrollY > 300) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }
    }

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", updateScrollFeatures, {
        passive: true
    });

    window.addEventListener("resize", updateScrollFeatures);

    updateScrollFeatures();
})();


/* ===== Compact Project Cards + Details Popup ===== */
(() => {
    const projectCards = document.querySelectorAll(
        "#projects .project-card"
    );

    if (!projectCards.length) return;

    // Create the popup once.
    const modal = document.createElement("div");
    modal.className = "project-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
        <div class="project-modal-panel"
             role="dialog"
             aria-modal="true"
             aria-label="Project details">
            <button class="project-modal-close"
                    type="button"
                    aria-label="Close project details">×</button>
            <div class="project-modal-content"></div>
        </div>
    `;

    document.body.appendChild(modal);

    const panel = modal.querySelector(".project-modal-panel");
    const content = modal.querySelector(".project-modal-content");
    const closeButton = modal.querySelector(".project-modal-close");

    let lastFocusedElement = null;

    function openModal(originalHTML, title, button) {
        lastFocusedElement = button;

        content.innerHTML = originalHTML;

        const heading = content.querySelector("h3");
        if (heading) {
            heading.id = "project-modal-title";
            panel.setAttribute("aria-labelledby", heading.id);
        }

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        content.innerHTML = "";

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    projectCards.forEach((card) => {
        // Save every original detail before hiding it on the card.
        const originalHTML = card.innerHTML;
        const heading = card.querySelector("h3");
        const title = heading ? heading.textContent.trim() : "Project";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "view-project-btn";
        button.innerHTML = 'View Project <span aria-hidden="true">↗</span>';
        button.setAttribute("aria-label", `View details: ${title}`);

        button.addEventListener("click", () => {
            openModal(originalHTML, title, button);
        });

        card.appendChild(button);
    });

    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("is-open")
        ) {
            closeModal();
        }
    });
})();



/* ===== Light and Dark Theme Toggle ===== */
(() => {
    const themeButton = document.getElementById("themeToggle");

    if (!themeButton) return;

    function updateThemeButton() {
        const isLight = document.body.classList.contains("light-theme");

        themeButton.textContent = isLight ? "🌙" : "☀️";
        themeButton.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
        themeButton.title = isLight ? "Dark mode" : "Light mode";
    }

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        updateThemeButton();
    });

    updateThemeButton();
})();
