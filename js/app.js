(() => {
	// Mobile menu toggle
	const menuToggle = document.getElementById("menuToggle");
	const nav = document.getElementById("nav");
	if (menuToggle && nav) {
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
	}
	// Reveal on scroll
	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (e.isIntersecting) e.target.classList.add("visible");
			}),
		{ threshold: 0.15 },
	);
	document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

	// Day/Night theme toggle
	const themeBtn = document.getElementById("themeToggle");
	if (themeBtn) {
		themeBtn.addEventListener("click", () => {
			const cur =
				document.documentElement.getAttribute("data-theme") || "light";
			const next = cur === "dark" ? "light" : "dark";
			document.documentElement.setAttribute("data-theme", next);
			try {
				localStorage.setItem("nw-theme", next);
			} catch (e) {}
			// Brief rotate animation feedback
			themeBtn.style.transform = "rotate(180deg)";
			setTimeout(() => {
				themeBtn.style.transform = "";
			}, 250);
		});
	}
	// JS for newsletter form submission to Formspree with custom popup modal
	document
		.querySelector(".newsletter-form")
		.addEventListener("submit", function (event) {
			event.preventDefault(); // Stop the default Formspree page redirect

			const form = this;
			const data = new FormData(form);
			const button = form.querySelector('button[type="submit"]');

			// Optional: Disable button during submission
			if (button) button.disabled = true;

			// Send data to Formspree via AJAX
			fetch(form.action, {
				method: form.method,
				body: data,
				headers: {
					Accept: "application/json",
				},
			})
				.then((response) => {
					if (response.ok) {
						// Show your custom popup modal
						document.getElementById("popupModal").style.display =
							"flex";
						form.reset(); // Clear the email input field
					} else {
						alert("Oops! There was a problem submitting your form");
					}
				})
				.catch((error) => {
					alert("Oops! There was a problem submitting your form");
				})
				.finally(() => {
					// Re-enable button
					if (button) button.disabled = false;
				});
		});

	function closePopup() {
		document.getElementById("popupModal").style.display = "none";
	}

	// =====================================================================
	// MailerLite subscribe helper — used by Northwinds lead forms
	// =====================================================================
	window.northwindsMlSubscribe = async function ({
		formId,
		groupId,
		data,
		onSuccess,
		onError,
	}) {
		const ACCOUNT_ID = "2342537"; // Double-check this matches your MailerLite account ID

		// Fallback to default form ID if none passed via data attribute
		const finalFormId = formId || "187714994342725328";
		const endpoint = `https://assets.mailerlite.com/jsonp/${ACCOUNT_ID}/forms/${finalFormId}/subscribe`;

		// Honeypot — if filled, silently "succeed" without submitting
		if (data._gotcha) {
			if (onSuccess) onSuccess();
			return;
		}

		try {
			const payload = new URLSearchParams();
			payload.append("fields[email]", data.email || "");

			// MailerLite default fields are typically 'name' and 'last_name'
			if (data.first_name)
				payload.append("fields[name]", data.first_name);
			if (data.last_name)
				payload.append("fields[last_name]", data.last_name);
			if (data.phone) payload.append("fields[phone]", data.phone);

			// Custom field — Make sure 'traveler_type' exists exactly like this in MailerLite
			if (data.traveler_type)
				payload.append("fields[traveler_type]", data.traveler_type);

			if (data.service) payload.append("fields[service]", data.service);
			if (data.message) payload.append("fields[message]", data.message);

			if (groupId) payload.append("groups[]", groupId);
			payload.append("ml-submit", "1");
			payload.append("anticsrf", "true");

			await fetch(endpoint, {
				method: "POST",
				mode: "no-cors", // Necessary for cross-domain JSONP tracking endpoints
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: payload.toString(),
			});

			if (onSuccess) onSuccess();
		} catch (err) {
			console.error("MailerLite subscribe error:", err);
			if (onError) onError(err);
		}
	};

	// Wire up forms automatically — opt-in via [data-ml-form]
	document.querySelectorAll("form[data-ml-form]").forEach((form) => {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			// 1. Verify fields match HTML requirements (required, email structure, etc.)
			if (!form.checkValidity()) {
				form.reportValidity(); // Shows standard browser error popups
				return; // Kills execution so empty details don't process
			}

			const formId = form.dataset.mlFormId;
			const groupId = form.dataset.mlGroupId;
			const wrapper =
				form.closest(".lead-form-wrapper") || form.parentElement;
			const successEl =
				wrapper ? wrapper.querySelector(".form-success") : null;
			const errorEl = form.querySelector(".form-error");
			const submitBtn = form.querySelector('button[type="submit"]');

			const fd = new FormData(form);
			const data = {
				first_name: (fd.get("first_name") || "").toString().trim(),
				last_name: (fd.get("last_name") || "").toString().trim(),
				email: (fd.get("email") || "").toString().trim(),
				phone: (fd.get("phone") || "").toString().trim(),
				traveler_type: (fd.get("traveler_type") || "")
					.toString()
					.trim(),
				service: (fd.get("service") || "").toString().trim(),
				message: (fd.get("message") || "").toString().trim(),
				_gotcha: (fd.get("_gotcha") || "").toString().trim(),
			};

			// Fixed the .style.with typo here
			if (errorEl) errorEl.style.display = "none";

			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.dataset.origLabel = submitBtn.textContent;
				submitBtn.textContent = "Sending…";
			}

			await window.northwindsMlSubscribe({
				formId,
				groupId,
				data,
				onSuccess: () => {
					form.style.display = "none";
					if (successEl) successEl.style.display = "block";
					if (submitBtn) {
						submitBtn.disabled = false;
						submitBtn.textContent =
							submitBtn.dataset.origLabel || "Submit";
					}
				},
				onError: () => {
					if (errorEl) {
						errorEl.textContent =
							"Something went wrong. Please email info@northwindstravel.com and we'll send the handbook directly.";
						errorEl.style.display = "block";
					}
					if (submitBtn) {
						submitBtn.disabled = false;
						submitBtn.textContent =
							submitBtn.dataset.origLabel || "Submit";
					}
				},
			});
		});
	});
})();
