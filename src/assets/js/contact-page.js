/* ============================================
   AN Contact Form
   ============================================ */
(function initAnContact() {
    "use strict";

    /* ── Enquiry tabs ───────────────────────── */
    var tabContainer = document.getElementById("cf-tabs");
    var categoryInput = document.getElementById("cf-category");

    if (tabContainer && categoryInput) {
        tabContainer.addEventListener("click", function (e) {
            var tab = e.target.closest(".cf-tab");
            if (!tab) { return; }

            tabContainer.querySelectorAll(".cf-tab").forEach(function (t) {
                t.classList.remove("is-active");
            });

            tab.classList.add("is-active");
            categoryInput.value = tab.dataset.value;
        });
    }

    /* ── Form submission ────────────────────── */
    var form    = document.getElementById("cf-form");
    var success = document.getElementById("cf-success");
    var submit  = form ? form.querySelector(".cs-button-solid") : null;

    if (!form) { return; }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (submit) {
            submit.disabled = true;
            submit.textContent = "Sending…";
        }

        /* ── Replace with your actual form endpoint ── */
        fetch(form.action || "/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString()
        })
        .then(function (res) {
            if (!res.ok) { throw new Error("Network error"); }
            form.reset();
            categoryInput.value = "business";
            tabContainer.querySelectorAll(".cf-tab").forEach(function (t) {
                t.classList.toggle("is-active", t.dataset.value === "business");
            });
            if (success) { success.classList.add("is-visible"); }
        })
        .catch(function () {
            if (submit) {
                submit.disabled = false;
                submit.textContent = "Send Message";
            }
            alert("Something went wrong — please try again.");
        });
    });

}());

