(() => {
  const validFilters = new Set([
    "all",
    "mastering",
    "mixing",
    "production",
    "recording",
    "engineering"
  ]);
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const buttons = Array.from(document.querySelectorAll(".portfolio-filter-button"));
  const grid = document.querySelector(".project-grid");

  if (!cards.length || !buttons.length || !grid) {
    return;
  }

  cards.forEach((card) => {
    const credits = Array.from(card.querySelectorAll(".project-meta li"))
      .map((credit) => credit.textContent.trim().toLowerCase());
    const services = [];

    if (credits.includes("mastering")) services.push("mastering");
    if (credits.includes("mixing")) services.push("mixing");
    if (credits.includes("producer")) services.push("production");
    if (credits.includes("recording")) services.push("recording");
    if (credits.some((credit) => credit.includes("engineering"))) services.push("engineering");

    card.dataset.services = services.join(" ");
  });

  const status = document.createElement("p");
  status.className = "sr-only";
  status.setAttribute("aria-live", "polite");
  grid.before(status);

  const applyFilter = (requestedFilter, updateUrl = true) => {
    const filter = validFilters.has(requestedFilter) ? requestedFilter : "all";
    let visibleCount = 0;

    cards.forEach((card) => {
      const services = card.dataset.services.split(" ").filter(Boolean);
      const visible = filter === "all" || services.includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    status.textContent = filter === "all"
      ? `Showing all ${visibleCount} projects.`
      : `Showing ${visibleCount} ${filter} projects.`;

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (filter === "all") {
        url.searchParams.delete("service");
      } else {
        url.searchParams.set("service", filter);
      }
      window.history.pushState({ service: filter }, "", url);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.dataset.filter);
    });
  });

  window.addEventListener("popstate", () => {
    const filter = new URL(window.location.href).searchParams.get("service") || "all";
    applyFilter(filter, false);
  });

  const initialFilter = new URL(window.location.href).searchParams.get("service") || "all";
  applyFilter(initialFilter, false);
})();
