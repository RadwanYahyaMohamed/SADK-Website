import { ID } from "appwrite";
import { databases } from "./appwrite.js";
import { AUTH_CONFIG } from "./auth-config.js";

const CONTACT_COLLECTION_ID = "contact_messages";

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
  initFAQ();
});

function initContactForm() {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMessage");
  const sendAnother = document.getElementById("sendAnother");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();
    const newsletter = form.newsletter?.checked ?? false;

    if (!name || !email || !subject || !message) return;

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = ' Sending...';
    }

    try {
      await databases.createDocument({
        databaseId: AUTH_CONFIG.DATABASE_ID,
        collectionId: CONTACT_COLLECTION_ID,
        documentId: ID.unique(),
        data: {
          name,
          email,
          subject,
          message,
          newsletter,
          createdAt: new Date().toISOString(),
        },
      });

      form.style.display = "none";
      if (successMsg) successMsg.style.display = "block";
    } catch (error) {
      console.error("Contact form error:", error);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Send Message';
      }
      alert("Failed to send message. Please try again or email us directly.");
    }
  });

  sendAnother?.addEventListener("click", () => {
    form.reset();
    form.style.display = "block";
    if (successMsg) successMsg.style.display = "none";
  });
}

function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      document.querySelectorAll(".faq-item.active").forEach((openItem) => {
        openItem.classList.remove("active");
      });

      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });
}
