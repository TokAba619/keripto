// auth.js (replace your friend's file with this)

const API_BASE = "http://192.168.0.16:8000"; // ✅ YOUR Wi-Fi IPv4 (change if needed)

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
  const role = document.getElementById("role").value; // user/admin

  // basic validation (frontend)
  if (!email || !password) return setStatus("Please enter email and password");
  if (!email.includes("@")) return setStatus("Please enter a valid email");
  if (password.length < 8) return setStatus("Password must be at least 8 characters");

  setStatus("Logging in...", false);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // backend will send {detail: "..."}
      return setStatus(data.detail || "Login failed");
    }

    // ✅ save token + role
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user_id", String(data.user_id));
    localStorage.setItem("email", data.email);

    setStatus("Login success! Redirecting...", false);

    // ✅ redirect based on role
    setTimeout(() => {
      if (data.role === "admin") window.location.href = "dashboard-admin.html";
      else window.location.href = "index.html";
    }, 700);

  } catch (err) {
    console.error(err);
    setStatus("Cannot connect to server. Check backend + same Wi-Fi network.");
  }
}
