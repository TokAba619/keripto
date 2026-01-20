const API_BASE = "http://192.168.0.16:8000"; // change if needed

function setStatus(msg, isError = true) {
  const el = document.getElementById("loginStatus");
  el.style.display = "block";
  el.className = "status " + (isError ? "err" : "ok");
  el.textContent = msg;
}

function togglePassword() {
  const pw = document.getElementById("password");
  pw.type = pw.type === "password" ? "text" : "password";
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) return setStatus("Please enter email and password");
  if (!email.includes("@")) return setStatus("Please enter a valid email");
  if (password.length < 8) return setStatus("Password must be at least 8 characters");

  setStatus("Logging in...", false);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return setStatus(data.detail || "Login failed");
    }

    // store session basic
    localStorage.setItem("role", data.role);
    localStorage.setItem("user_id", String(data.user_id));
    localStorage.setItem("email", data.email);

    setStatus("Login success! Redirecting...", false);

    setTimeout(() => {
      if (data.role === "admin") window.location.href = "dashboardadmin.html";
      else window.location.href = "dashboarduser.html";
    }, 500);

  } catch (err) {
    console.error(err);
    setStatus("Cannot connect to server. Check backend + same Wi-Fi network + CORS.");
  }
}