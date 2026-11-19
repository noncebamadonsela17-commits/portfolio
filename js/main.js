const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");

menuToggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const tiltLinks = document.querySelectorAll(".social");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  tiltLinks.forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = link.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      link.style.transform = `rotateX(${(12 - y * 26).toFixed(2)}deg) rotateY(${(x * 28).toFixed(2)}deg) translateZ(16px)`;
    });

    link.addEventListener("pointerleave", () => {
      link.style.transform = "";
    });
  });
}

const GITHUB_USER = "noncebamadonsela17-commits";

const FALLBACK_REPOS = [
  {
    name: "hospital-occupancy-cloud",
    html_url: "https://github.com/noncebamadonsela17-commits/hospital-occupancy-cloud",
    description: "AWS landing zone (af-south-1) for clinic CSV uploads: S3, SQS, Lambda validation, IAM, alarms, $10 budget — Terraform, no 24/7 EC2.",
    language: "HCL",
    fork: false,
    pushed_at: "2026-10-29T07:51:36Z",
  },
  {
    name: "bed-occupancy-pipeline",
    html_url: "https://github.com/noncebamadonsela17-commits/bed-occupancy-pipeline",
    description: "Daily hospital bed-occupancy pipeline: bronze → silver → gold in PostgreSQL, dbt tests, Airflow DAG, 7-day forecast, Streamlit dashboard. Synthetic data only.",
    language: "Python",
    fork: false,
    pushed_at: "2026-10-21T10:18:22Z",
  },
  {
    name: "Hotel_Management_System",
    html_url: "https://github.com/noncebamadonsela17-commits/Hotel_Management_System",
    description: "Python hotel operations app: bookings, check-in, housekeeping, billing, and SQLite",
    language: "Python",
    fork: false,
    pushed_at: "2026-10-15T09:59:04Z",
  },
];

function renderRepos(repos) {
  const list = document.querySelector("#repo-list");
  const status = document.querySelector("#github-status");
  const own = repos.filter((repo) => !repo.fork);

  list.replaceChildren();

  if (own.length === 0) {
    status.textContent = "No public repositories to show right now.";
    return;
  }

  status.textContent = `${own.length} public ${own.length === 1 ? "repository" : "repositories"}, newest activity first.`;

  for (const repo of own) {
    const item = document.createElement("li");
    item.className = "repo";

    const title = document.createElement("a");
    title.href = repo.html_url;
    title.target = "_blank";
    title.rel = "noopener noreferrer";
    title.textContent = repo.name;

    const summary = document.createElement("p");
    summary.textContent = repo.description || "No description on GitHub yet.";

    const meta = document.createElement("p");
    meta.className = "repo-meta";
    const language = repo.language || "—";
    const updated = repo.pushed_at
      ? new Date(repo.pushed_at).toLocaleDateString("en-ZA", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "unknown date";
    meta.textContent = `${language} · updated ${updated}`;

    item.append(title, summary, meta);
    list.append(item);
  }
}

async function loadRepos() {
  const status = document.querySelector("#github-status");
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
    );
    if (!response.ok) {
      throw new Error(`GitHub responded with ${response.status}`);
    }
    const repos = await response.json();
    renderRepos(repos);
  } catch (error) {
    status.textContent = "Showing saved repositories. Live GitHub data did not load.";
    renderRepos(FALLBACK_REPOS);
  }
}

loadRepos();
