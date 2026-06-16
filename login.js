import { auth, googleProvider, db } from "./firebase-config.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// ============================================================
// JAVASCRIPT - Página Login (login.html)
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  initializeLogin();
});

/**
 * Função de inicialização da página de login
 */
function initializeLogin() {
  console.log("Login page carregada");
  setupFormValidation();
  setupGoogleLogin();
  setupPasswordToggle();
}

/**
 * Setup validação do formulário
 */
function setupFormValidation() {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value;

    // Validação básica
    if (!email || !password) {
      showError("Por favor, preencha todos os campos");
      return;
    }

    if (!App.isValidEmail(email)) {
      showError("Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Se passou nas validações
    performLogin(email, password);
  });
}

/**
 * Setup Google Login
 */
function setupGoogleLogin() {
  const googleBtn = document.getElementById("googleLoginBtn");

  if (!googleBtn) return;

  googleBtn.addEventListener("click", async function () {
    console.log("[Google Login] Clicado");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[Login] Sucesso");
      await redirectByRole(result.user);
    } catch (error) {
      console.error("[Google Login] Erro", error);
      showError(error.message || "Erro ao fazer login com Google");
    }
  });
}

/**
 * Setup toggle de visibilidade da senha (opcional)
 */
function setupPasswordToggle() {
  const passwordInput = document.getElementById("passwordInput");

  if (!passwordInput) return;

  // Você pode adicionar um botão de "mostrar/esconder senha" aqui
  // Por enquanto, apenas registramos o input
  passwordInput.addEventListener("focus", function () {
    this.parentElement.classList.add("focused");
  });

  passwordInput.addEventListener("blur", function () {
    this.parentElement.classList.remove("focused");
  });
}

/**
 * Validação de email
 */
/**
 * Mostrar erro
 */
function showError(message) {
  console.warn("[Form Error]", message);
  // Aqui você pode adicionar um toast ou alerta visual
  alert(message);
}

/**
 * Realizar login
 */
async function performLogin(email, password) {
  console.log("[Login] Tentando fazer login com:", email);

  const loginBtn = document.querySelector(".login-button--primary");
  const originalText = loginBtn.textContent;
  loginBtn.textContent = "Autenticando...";
  loginBtn.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    console.log("[Login] Sucesso");
    await redirectByRole(userCredential.user);
  } catch (error) {
    console.error("[Login] Erro", error);

    const errorCode = error.code || "";
    if (errorCode === "auth/user-not-found") {
      showError("Usuário não encontrado.");
    } else if (errorCode === "auth/wrong-password") {
      showError("Senha incorreta.");
    } else if (errorCode === "auth/invalid-credential") {
      showError("E-mail ou senha inválidos.");
    } else if (errorCode === "auth/invalid-email") {
      showError("E-mail inválido.");
    } else if (errorCode === "auth/network-request-failed") {
      showError("Verifique sua conexão.");
    } else {
      showError("Não foi possível realizar o login.");
    }
  } finally {
    loginBtn.textContent = originalText;
    loginBtn.disabled = false;
  }
}

async function redirectByRole(user) {
  if (!user) return;
  try {
    const userRef = doc(db, "clientes", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "principal.html";
    }
  } catch (error) {
    window.location.href = "principal.html";
  }
}

/**
 * Log de eventos
 */
function logEvent(eventName, eventData = {}) {
  console.log(`[Event] ${eventName}`, eventData);
  // Aqui você pode conectar a um serviço de analytics
}
