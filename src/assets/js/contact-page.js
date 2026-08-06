/* ============================================
   AN Contact Form — tabs + Netlify submission
   ============================================ */
(function initAnContact() {
    "use strict";

    var DEFAULT_CATEGORY = "business";
    var SUBMIT_LABEL     = "Send Message";
    var SUCCESS_TEXT     = "Thank You! We'll be in touch soon.";
    var ERROR_TEXT       = "Something went wrong. Please try again, or email hello@andrewnicholson.com.";

    var form          = document.getElementById("cf-form");
    var tabContainer  = document.getElementById("cf-tabs");
    var categoryInput = document.getElementById("cf-category");
    var status        = document.getElementById("cf-status");
    var submit        = form ? form.querySelector(".cs-button-solid") : null;

    if (!form) { return; }

    /* ── Enquiry tabs ───────────────────────── */
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

    function resetTabs() {
        if (!tabContainer || !categoryInput) { return; }

        categoryInput.value = DEFAULT_CATEGORY;
        tabContainer.querySelectorAll(".cf-tab").forEach(function (t) {
            t.classList.toggle("is-active", t.dataset.value === DEFAULT_CATEGORY);
        });
    }

    /* ── Status message ─────────────────────── */
    function showStatus(text, isError) {
        if (!status) { return; }
        status.textContent = text;
        status.classList.toggle("is-error", !!isError);
        status.classList.add("is-visible");
    }

    function clearStatus() {
        if (!status) { return; }
        status.classList.remove("is-visible", "is-error");
    }

    /* ── Submission ─────────────────────────── */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        clearStatus();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (submit) {
            submit.disabled = true;
            submit.textContent = "Sending…";
        }

        /* Netlify listens at the site root, not the page URL */
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString()
        })
        .then(function (res) {
            if (!res.ok) { throw new Error("HTTP " + res.status); }

            form.reset();
            resetTabs();
            showStatus(SUCCESS_TEXT, false);

            if (submit) {
                submit.textContent = "Message Sent";
                /* left disabled to prevent duplicate submissions */
            }
        })
        .catch(function (err) {
            console.error("Contact form:", err);
            showStatus(ERROR_TEXT, true);

            if (submit) {
                submit.disabled = false;
                submit.textContent = SUBMIT_LABEL;
            }
        });
    });

}());