const $ = (id) => document.getElementById(id);
const promptEl = $("prompt"), errorEl = $("error"), resultEl = $("result");

const TYPE_LABEL = { text: "text", email: "email", date: "date", time: "time", number: "number", url: "link", textarea: "long text", select: "choice" };

async function loadSamples() {
  const res = await fetch("/api/samples");
  const { samples } = await res.json();
  const box = $("samples");
  samples.forEach((s) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    b.textContent = s;
    b.onclick = () => { promptEl.value = s; build(); };
    box.appendChild(b);
  });
}

function fieldInput(f) {
  if (f.type === "textarea") {
    const t = document.createElement("textarea");
    t.name = f.name; t.required = f.required; t.rows = 3;
    return t;
  }
  if (f.type === "select") {
    const s = document.createElement("select");
    s.name = f.name; s.required = f.required;
    const blank = document.createElement("option");
    blank.value = ""; blank.textContent = "Choose…";
    s.appendChild(blank);
    f.options.forEach((o) => {
      const opt = document.createElement("option");
      opt.value = o; opt.textContent = o;
      s.appendChild(opt);
    });
    return s;
  }
  const i = document.createElement("input");
  i.name = f.name; i.type = f.type; i.required = f.required;
  return i;
}

async function build() {
  const prompt = promptEl.value.trim();
  errorEl.hidden = true;
  if (!prompt) {
    errorEl.textContent = "Type a prompt first, or tap a sample below.";
    errorEl.hidden = false;
    return;
  }
  $("build").disabled = true;
  $("build").textContent = "Building…";
  try {
    const res = await fetch("/api/build", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not build the form.");
    const { form, html, jsx } = data;
    $("form-title").textContent = form.title;
    $("form-desc").textContent = form.description;
    $("form-rule").textContent = form.matched
      ? `Matched the "${form.id}" rule from your prompt.`
      : "No keyword matched, so here is a general form.";
    const live = $("live-form");
    live.innerHTML = "";
    form.fields.forEach((f) => {
      const wrap = document.createElement("div");
      wrap.className = "field";
      const label = document.createElement("label");
      label.textContent = f.label + (f.required ? " *" : "") + ` (${TYPE_LABEL[f.type] || f.type})`;
      wrap.appendChild(label);
      wrap.appendChild(fieldInput(f));
      live.appendChild(wrap);
    });
    $("thanks").hidden = true;
    $("preview").srcdoc = html;
    $("jsx").textContent = jsx;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  } finally {
    $("build").disabled = false;
    $("build").textContent = "Build my form";
  }
}

$("build").onclick = build;
promptEl.addEventListener("keydown", (e) => { if (e.key === "Enter") build(); });

$("submit-form").onclick = () => {
  const live = $("live-form");
  if (!live.reportValidity()) return;
  const data = Object.fromEntries(new FormData(live).entries());
  const first = data.name || data.title || "friend";
  const thanks = $("thanks");
  thanks.innerHTML = `<strong>Thanks, ${escapeHtml(first)}.</strong> Your ${escapeHtml($("form-title").textContent)} is ready. Demo only, nothing was sent anywhere.`;
  thanks.hidden = false;
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

$("tab-render").onclick = () => {
  $("tab-render").classList.add("active");
  $("tab-jsx").classList.remove("active");
  $("preview").hidden = false;
  $("jsx").hidden = true;
};
$("tab-jsx").onclick = () => {
  $("tab-jsx").classList.add("active");
  $("tab-render").classList.remove("active");
  $("preview").hidden = true;
  $("jsx").hidden = false;
};

loadSamples();
