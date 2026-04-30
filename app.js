(() => {
	const root = document.documentElement;
	const toggle = document.querySelector("[data-theme-toggle]");
	let theme =
		window.matchMedia("(prefers-color-scheme: dark)").matches ?
			"dark"
		:	"light";
	const moon =
		'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
	const sun =
		'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
	const applyTheme = () => {
		root.setAttribute("data-theme", theme);
		toggle.innerHTML = theme === "dark" ? sun : moon;
	};
	applyTheme();
	toggle.addEventListener("click", () => {
		theme = theme === "dark" ? "light" : "dark";
		applyTheme();
	});
	const menuToggle = document.getElementById("menuToggle");
	const nav = document.getElementById("nav");
	menuToggle.addEventListener("click", () => {
		const open = nav.classList.toggle("open");
		menuToggle.setAttribute("aria-expanded", String(open));
	});
	nav.querySelectorAll("a").forEach((link) =>
		link.addEventListener("click", () => {
			nav.classList.remove("open");
			menuToggle.setAttribute("aria-expanded", "false");
		}),
	);
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) entry.target.classList.add("visible");
			});
		},
		{ threshold: 0.15 },
	);
	document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
