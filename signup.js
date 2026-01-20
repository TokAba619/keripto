// signup.js

const API_BASE = "http://192.168.0.16:8000"; // <-- YOUR BACKEND IP

function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

function setStatus(message, isError = true) {
  const status = document.getElementById("signupStatus");
  status.style.display = "block";
  status.className = "status " + (isError ? "err" : "ok");
  status.textContent = message;
}

async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  // -----------------------------
  // USER-FRIENDLY VALIDATION
  // -----------------------------
  if (name.length < 2) {
    return setStatus("Please enter your full name.");
  }

  if (!email.includes("@")) {
    return setStatus("Please enter a valid email address.");
  }

  if (password.length < 8) {
    return setStatus("Password must be at least 8 characters.");
  }

  if (password !== confirm) {
    return setStatus("Passwords do not match.");
  }

  setStatus("Creating account...", false);

  // -----------------------------
  // BACKEND CONNECTION
  // -----------------------------
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // FastAPI sends { detail: "message" }
      return setStatus(data.detail || "Signup failed.");
    }

    // SUCCESS
    setStatus("Signup successful! Redirecting to login...", false);

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);

  } catch (error) {
    console.error(error);
    setStatus("Cannot connect to server. Make sure backend is running.");
  }
}
