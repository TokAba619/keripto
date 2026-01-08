// Change this later to your deployed backend URL (Render/Cloud Run/etc.)
const API_BASE = "http://127.0.0.1:8000";

async function postFile(endpoint, file, password) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("password", password);

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: fd
  });

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data.detail || msg;
    } catch {}
    throw new Error(msg);
  }

  return await res.blob();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
}


function showStatus(el, type, msg) {
  el.classList.remove("ok", "err");
  el.classList.add(type === "ok" ? "ok" : "err");
  el.textContent = msg;
  el.style.display = "block";
}

function initEncryptPage() {
  const file = document.getElementById("file");
  const pass = document.getElementById("password");
  const btn = document.getElementById("encryptBtn");
  const bar = document.getElementById("progress");
  const status = document.getElementById("status");

  btn.addEventListener("click", async () => {
    status.style.display = "none";

    if (!file.files?.length) return showStatus(status, "err", "Please choose a file first.");
    if (!pass.value || pass.value.length < 8) return showStatus(status, "err", "Password must be at least 8 characters.");

    btn.disabled = true;

    // Optional: show progress UI (fake)
    if (bar) bar.style.display = "block";

    try {
      const originalName = file.files[0].name;

      // ✅ REAL CALL to backend
      const blob = await postFile("/encrypt", file.files[0], pass.value);

      // ✅ Download encrypted file
      downloadBlob(blob, `${originalName}.enc`);

      showStatus(status, "ok", `Encrypted successfully: ${originalName}.enc`);
    } catch (e) {
      showStatus(status, "err", e.message);
    } finally {
      btn.disabled = false;
      if (bar) bar.style.display = "none";
    }
  });
}


function initDecryptPage() {
  const file = document.getElementById("file");
  const pass = document.getElementById("password");
  const btn = document.getElementById("decryptBtn");
  const bar = document.getElementById("progress");
  const status = document.getElementById("status");

  btn.addEventListener("click", async () => {
    status.style.display = "none";

    if (!file.files?.length) return showStatus(status, "err", "Please choose an encrypted file (.enc) first.");
    if (!pass.value) return showStatus(status, "err", "Please enter a password.");

    btn.disabled = true;
    if (bar) bar.style.display = "block";

    try {
      const encName = file.files[0].name;

      // ✅ REAL CALL to backend
      const blob = await postFile("/decrypt", file.files[0], pass.value);

      // output filename
      const outName = encName.toLowerCase().endsWith(".enc")
        ? encName.slice(0, -4)
        : "decrypted_file";

      // ✅ Download decrypted file
      downloadBlob(blob, outName);

      showStatus(status, "ok", `Decrypted successfully: ${outName}`);
    } catch (e) {
      showStatus(status, "err", e.message);
    } finally {
      btn.disabled = false;
      if (bar) bar.style.display = "none";
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  if (document.body.dataset.page === "encrypt") initEncryptPage();
  if (document.body.dataset.page === "decrypt") initDecryptPage();
});
