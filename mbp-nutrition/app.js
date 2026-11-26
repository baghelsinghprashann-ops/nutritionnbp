/* ==========================================================================
   MBP Nutrition — Shared UI, Search, Catalog, Reviews, Modals & Forms Logic
   ========================================================================== */

(function () {
  const STORAGE_REVIEWS_KEY = "mbp_user_reviews_v1";
  const STORAGE_NEWSLETTER_KEY = "mbp_newsletter_email";

  const data = window.MBP_DATA || { products: [], recipes: [], featuredTestimonials: [] };

  // ---------- Helpers ----------
  function formatINR(num) {
    return "₹" + Number(num).toLocaleString("en-IN");
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getUserReviewsMap() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_REVIEWS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveUserReview(productId, reviewObj) {
    const map = getUserReviewsMap();
    if (!Array.isArray(map[productId])) map[productId] = [];
    map[productId].unshift(reviewObj);
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(map));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }

  function getAllReviewsForProduct(product) {
    const userMap = getUserReviewsMap();
    const custom = Array.isArray(userMap[product.id]) ? userMap[product.id] : [];
    return [...custom, ...(product.reviews || [])];
  }

  function getRatingStats(product) {
    const all = getAllReviewsForProduct(product);
    if (!all.length) return { avg: 5.0, count: 0 };
    const sum = all.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    // Offset count with verified storefront base for realistic social proof while keeping live average reactive
    const avg = (sum / all.length).toFixed(1);
    return { avg, count: all.length };
  }

  function renderStars(rating) {
    const rounded = Math.round(Number(rating) || 5);
    return "★".repeat(rounded) + "☆".repeat(Math.max(0, 5 - rounded));
  }

  function showToast(message) {
    let toast = document.getElementById("mbpToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "mbpToast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("is-visible"), 3600);
  }

  // ---------- Sticky Header Shadow & Mobile Drawer ----------
  function initNavigation() {
    const header = document.querySelector(".site-header");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    const menuBtn = document.getElementById("menuToggle");
    const drawer = document.getElementById("mobileDrawer");
    if (menuBtn && drawer) {
      menuBtn.addEventListener("click", () => {
        const isOpen = drawer.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Live Search Dropdown (Desktop + Mobile)
    document.querySelectorAll("[data-search-widget]").forEach((widget) => {
      const form = widget.querySelector("form");
      const input = widget.querySelector("input[type='search']");
      const dropdown = widget.querySelector(".search-dropdown");
      if (!form || !input) return;

      const renderResults = (query) => {
        if (!dropdown) return;
        const q = query.trim().toLowerCase();
        if (!q) {
          dropdown.classList.remove("is-open");
          dropdown.innerHTML = "";
          return;
        }
        const prodHits = data.products
          .filter((p) =>
            (p.name + " " + p.category + " " + p.benefit + " " + p.highlights.join(" ")).toLowerCase().includes(q)
          )
          .map((p) => ({
            title: p.name,
            meta: `${p.category} • ${formatINR(p.variants[0].price)}`,
            image: p.image,
            href: `products.html?product=${encodeURIComponent(p.id)}`
          }));

        const recipeHits = data.recipes
          .filter((r) => (r.title + " " + r.summary).toLowerCase().includes(q))
          .map((r) => ({
            title: r.title,
            meta: `Recipe • ${r.prepTime} • ${r.macros.protein} Protein`,
            image: r.image,
            href: `recipes.html#${encodeURIComponent(r.id)}`
          }));

        const hits = [...prodHits, ...recipeHits].slice(0, 6);
        dropdown.innerHTML = hits.length
          ? hits
              .map(
                (h) => `
              <a class="search-dropdown__item" href="${h.href}">
                <img class="search-dropdown__thumb" src="${h.image}" alt="${escapeHTML(h.title)}">
                <div>
                  <div class="search-dropdown__title">${escapeHTML(h.title)}</div>
                  <div class="search-dropdown__meta">${escapeHTML(h.meta)}</div>
                </div>
              </a>`
              )
              .join("")
          : `<div class="search-dropdown__empty">No matches for "${escapeHTML(query)}". Press Enter to view all products.</div>`;
        dropdown.classList.add("is-open");
      };

      input.addEventListener("input", () => renderResults(input.value));
      input.addEventListener("focus", () => {
        if (input.value.trim()) renderResults(input.value);
      });

      document.addEventListener("click", (e) => {
        if (dropdown && !widget.contains(e.target)) {
          dropdown.classList.remove("is-open");
        }
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (window.location.pathname.endsWith("products.html")) {
          const searchFilter = document.getElementById("catalogSearchInput");
          if (searchFilter) {
            searchFilter.value = q;
            searchFilter.dispatchEvent(new Event("input"));
          }
          if (dropdown) dropdown.classList.remove("is-open");
        } else {
          window.location.href = q ? `products.html?q=${encodeURIComponent(q)}` : "products.html";
        }
      });
    });
  }

  // ---------- Modals Injection (Shared Across Pages) ----------
  function ensureModals() {
    if (!document.getElementById("productDetailModal")) {
      const detailModal = document.createElement("div");
      detailModal.id = "productDetailModal";
      detailModal.className = "modal-backdrop";
      detailModal.setAttribute("role", "dialog");
      detailModal.setAttribute("aria-modal", "true");
      detailModal.setAttribute("aria-labelledby", "detailModalTitle");
      detailModal.innerHTML = `
        <div class="modal-dialog">
          <button type="button" class="modal-close" data-close-modal="productDetailModal" aria-label="Close product details">✕</button>
          <div id="productDetailContent"></div>
        </div>
      `;
      document.body.appendChild(detailModal);
    }

    if (!document.getElementById("quickOrderModal")) {
      const orderModal = document.createElement("div");
      orderModal.id = "quickOrderModal";
      orderModal.className = "modal-backdrop";
      orderModal.setAttribute("role", "dialog");
      orderModal.setAttribute("aria-modal", "true");
      orderModal.setAttribute("aria-labelledby", "quickOrderTitle");
      orderModal.innerHTML = `
        <div class="modal-dialog modal-dialog--sm">
          <button type="button" class="modal-close" data-close-modal="quickOrderModal" aria-label="Close quick order modal">✕</button>
          <span class="eyebrow eyebrow--orange">Fast Checkout &amp; Enquiry</span>
          <h2 id="quickOrderTitle" style="font-size:1.5rem;margin-bottom:6px;">Quick Order / Product Enquiry</h2>
          <p style="color:var(--text-muted);font-size:0.92rem;margin-bottom:18px;">
            Reserve your clean-label stack or request bulk/team pricing. Dispatch within 24 hours.
          </p>
          <form id="quickOrderForm" novalidate>
            <div class="form-field">
              <label class="form-label" for="qoProduct">Selected Product</label>
              <select class="form-select" id="qoProduct" name="product" required></select>
            </div>
            <div class="form-grid">
              <div class="form-field">
                <label class="form-label" for="qoVariant">Flavor / Size</label>
                <select class="form-select" id="qoVariant" name="variant" required></select>
              </div>
              <div class="form-field">
                <label class="form-label" for="qoQty">Quantity</label>
                <input class="form-input" id="qoQty" name="qty" type="number" min="1" max="50" value="1" required>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-field">
                <label class="form-label" for="qoName">Full Name</label>
                <input class="form-input" id="qoName" name="name" type="text" placeholder="e.g. Aarav Deshmukh" required>
              </div>
              <div class="form-field">
                <label class="form-label" for="qoPhone">Phone Number</label>
                <input class="form-input" id="qoPhone" name="phone" type="tel" placeholder="+91 98765 43210" required>
              </div>
            </div>
            <div class="form-field">
              <label class="form-label" for="qoEmail">Email Address</label>
              <input class="form-input" id="qoEmail" name="email" type="email" placeholder="you@example.com" required>
            </div>
            <div class="form-field">
              <label class="form-label" for="qoNotes">Delivery City or Nutrition Notes (Optional)</label>
              <input class="form-input" id="qoNotes" name="notes" type="text" placeholder="e.g. Bengaluru • Use code MBP10">
            </div>
            <button type="submit" class="btn btn--accent btn--full">Confirm Quick Order / Enquiry</button>
            <div id="qoFeedback" class="form-feedback" aria-live="polite"></div>
          </form>
        </div>
      `;
      document.body.appendChild(orderModal);
      initQuickOrderForm();
    }

    // Close handlers
    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest("[data-close-modal]");
      if (closeBtn) {
        closeModal(closeBtn.getAttribute("data-close-modal"));
      }
      if (e.target.classList.contains("modal-backdrop")) {
        e.target.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.is-open").forEach((m) => m.classList.remove("is-open"));
        document.body.style.overflow = "";
      }
    });
  }

  function openModal(id) {
    ensureModals();
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("is-open");
    if (!document.querySelector(".modal-backdrop.is-open")) {
      document.body.style.overflow = "";
    }
  }

  // ---------- Quick Order / Enquiry Modal Logic ----------
  function populateVariantSelect(productId, selectedVariantIndex) {
    const variantSelect = document.getElementById("qoVariant");
    const product = data.products.find((p) => p.id === productId) || data.products[0];
    if (!variantSelect || !product) return;
    variantSelect.innerHTML = product.variants
      .map(
        (v, idx) =>
          `<option value="${escapeHTML(v.label)}" ${idx === Number(selectedVariantIndex || 0) ? "selected" : ""}>${escapeHTML(
            v.label
          )} (${formatINR(v.price)})</option>`
      )
      .join("");
  }

  function initQuickOrderForm() {
    const prodSelect = document.getElementById("qoProduct");
    const form = document.getElementById("quickOrderForm");
    if (!prodSelect || !form) return;

    prodSelect.innerHTML = data.products
      .map((p) => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`)
      .join("");

    prodSelect.addEventListener("change", () => {
      populateVariantSelect(prodSelect.value, 0);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const feedback = document.getElementById("qoFeedback");
      const name = document.getElementById("qoName").value.trim();
      const phone = document.getElementById("qoPhone").value.trim();
      const email = document.getElementById("qoEmail").value.trim();
      const qty = document.getElementById("qoQty").value;
      const productObj = data.products.find((p) => p.id === prodSelect.value);
      const variantLabel = document.getElementById("qoVariant").value;

      if (!name || !phone || !email || !email.includes("@")) {
        feedback.className = "form-feedback form-feedback--error is-visible";
        feedback.textContent = "Please enter your name, valid email address, and phone number.";
        return;
      }

      const refId = "MBP-" + Math.floor(100000 + Math.random() * 900000);
      feedback.className = "form-feedback form-feedback--success is-visible";
      feedback.innerHTML = `Order/Enquiry <strong>${refId}</strong> confirmed for <strong>${qty}x ${escapeHTML(
        productObj ? productObj.shortName : "MBP Product"
      )}</strong> (${escapeHTML(variantLabel)}). Confirmation sent to <strong>${escapeHTML(email)}</strong>.`;
      showToast(`Request ${refId} submitted! Check your email for confirmation.`);
      form.reset();
      populateVariantSelect(prodSelect.value, 0);
    });
  }

  window.openQuickOrder = function (productId, variantIdx) {
    ensureModals();
    const prodSelect = document.getElementById("qoProduct");
    const feedback = document.getElementById("qoFeedback");
    if (feedback) {
      feedback.className = "form-feedback";
      feedback.textContent = "";
    }
    if (prodSelect) {
      prodSelect.value = productId || data.products[0].id;
      populateVariantSelect(prodSelect.value, variantIdx || 0);
    }
    openModal("quickOrderModal");
  };

  // ---------- Product Detail & Reviews Modal ----------
  window.openProductDetail = function (productId, selectedVariantIdx = 0) {
    ensureModals();
    const product = data.products.find((p) => p.id === productId);
    if (!product) return;

    const container = document.getElementById("productDetailContent");
    if (!container) return;

    const renderDetail = (variantIndex) => {
      const variant = product.variants[variantIndex] || product.variants[0];
      const stats = getRatingStats(product);
      const reviews = getAllReviewsForProduct(product);

      container.innerHTML = `
        <div class="product-modal__grid">
          <div class="product-modal__img-wrap">
            <img src="${product.image}" alt="${escapeHTML(product.name)}">
          </div>
          <div>
            <span class="product-card__cat">${escapeHTML(product.category)}</span>
            <h2 id="detailModalTitle" style="font-size:1.65rem;margin-bottom:8px;">${escapeHTML(product.name)}</h2>
            <div class="rating-row">
              <span class="stars" aria-label="${stats.avg} out of 5 stars">${renderStars(stats.avg)}</span>
              <span class="rating-row__text">${stats.avg} / 5 (${stats.count} Verified Reviews)</span>
            </div>
            <p style="color:var(--text-muted);font-size:0.95rem;margin-bottom:14px;">${escapeHTML(product.description)}</p>

            <div class="nutrition-strip">
              ${product.nutrition
                .map(
                  (n) => `
                <div class="macro-box">
                  <div class="macro-box__val">${escapeHTML(n.value)}</div>
                  <div class="macro-box__lbl">${escapeHTML(n.label)}</div>
                </div>`
                )
                .join("")}
            </div>

            <div class="variant-group">
              <span class="variant-group__label">Select Flavor / Size</span>
              <div class="variant-chips">
                ${product.variants
                  .map(
                    (v, i) => `
                  <button type="button" class="variant-chip ${i === variantIndex ? "is-selected" : ""}" data-modal-variant="${i}">
                    ${escapeHTML(v.label)}
                  </button>`
                  )
                  .join("")}
              </div>
            </div>

            <div class="product-card__price-row" style="margin-top:16px;">
              <div>
                <span class="price-current">${formatINR(variant.price)}</span>
                <span class="price-compare">${formatINR(variant.compareAt)}</span>
              </div>
              <span class="product-card__servings">${escapeHTML(variant.servings)}</span>
            </div>

            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:14px;">
              <strong>Clean Ingredients:</strong> ${escapeHTML(product.ingredients)}<br>
              <strong>Quality:</strong> ${escapeHTML(product.certifications)}
            </p>

            <div style="display:flex;flex-wrap:wrap;gap:10px;">
              <button type="button" class="btn btn--accent" id="detailQuickOrderBtn">Quick Order / Enquire Now</button>
              <a class="btn btn--outline" href="contact.html?inquiry=Nutrition%20Advice&product=${encodeURIComponent(
                product.name
              )}">Ask a Nutritionist</a>
            </div>
          </div>
        </div>

        <div class="reviews-section-modal">
          <h3 style="font-size:1.25rem;margin-bottom:4px;">Customer Reviews &amp; Ratings</h3>
          <p style="font-size:0.88rem;color:var(--text-muted);">Verified athlete &amp; working professional feedback for ${escapeHTML(
            product.shortName
          )}.</p>

          <div class="reviews-modal__grid">
            <div class="review-list-stack" id="modalReviewsList">
              ${reviews
                .map(
                  (r) => `
                <div class="review-mini-card">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
                    <span class="stars" style="font-size:0.85rem;">${renderStars(r.rating)}</span>
                    <span class="verified-badge">✓ Verified Buyer</span>
                  </div>
                  <p style="font-size:0.9rem;color:var(--text-main);margin-bottom:6px;">"${escapeHTML(r.comment)}"</p>
                  ${
                    r.result
                      ? `<div class="review-card__result" style="margin-bottom:8px;display:inline-block;">${escapeHTML(r.result)}</div>`
                      : ""
                  }
                  <div style="font-size:0.8rem;color:var(--text-muted);">
                    <strong>${escapeHTML(r.author)}</strong> • ${escapeHTML(r.role || "Verified Customer")}
                  </div>
                </div>`
                )
                .join("")}
            </div>

            <form class="form-card" id="writeReviewForm" style="padding:20px;box-shadow:none;" novalidate>
              <h4 style="font-size:1.05rem;margin-bottom:12px;">Write a Review</h4>
              <div class="form-field">
                <label class="form-label">Your Rating</label>
                <div class="star-picker" id="reviewStarPicker" role="radiogroup" aria-label="Select rating">
                  ${[1, 2, 3, 4, 5]
                    .map(
                      (n) =>
                        `<button type="button" class="${n <= 5 ? "is-active" : ""}" data-star="${n}" aria-label="${n} stars">★</button>`
                    )
                    .join("")}
                </div>
                <input type="hidden" id="reviewRatingVal" value="5">
              </div>
              <div class="form-field">
                <label class="form-label" for="reviewAuthor">Your Name</label>
                <input class="form-input" id="reviewAuthor" type="text" placeholder="e.g. Rohan Verma" required>
              </div>
              <div class="form-field">
                <label class="form-label" for="reviewRole">Athlete / Profession</label>
                <input class="form-input" id="reviewRole" type="text" placeholder="e.g. Software Engineer &amp; Runner">
              </div>
              <div class="form-field">
                <label class="form-label" for="reviewResult">Key Result Achieved</label>
                <input class="form-input" id="reviewResult" type="text" placeholder="e.g. Faster recovery, zero bloating">
              </div>
              <div class="form-field">
                <label class="form-label" for="reviewComment">Review</label>
                <textarea class="form-textarea" id="reviewComment" style="min-height:82px;" placeholder="Share taste, mixability, and performance results..." required></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--full btn--sm">Submit Review</button>
              <div id="reviewFormFeedback" class="form-feedback" aria-live="polite"></div>
            </form>
          </div>
        </div>
      `;

      // Bind variant buttons inside detail modal
      container.querySelectorAll("[data-modal-variant]").forEach((btn) => {
        btn.addEventListener("click", () => {
          renderDetail(Number(btn.getAttribute("data-modal-variant")));
        });
      });

      const quickBtn = document.getElementById("detailQuickOrderBtn");
      if (quickBtn) {
        quickBtn.addEventListener("click", () => {
          closeModal("productDetailModal");
          window.openQuickOrder(product.id, variantIndex);
        });
      }

      // Star picker interaction
      const starBtns = container.querySelectorAll("#reviewStarPicker button");
      const ratingInput = document.getElementById("reviewRatingVal");
      starBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = Number(btn.getAttribute("data-star"));
          ratingInput.value = String(val);
          starBtns.forEach((b) => {
            b.classList.toggle("is-active", Number(b.getAttribute("data-star")) <= val);
          });
        });
      });

      // Review submit
      const revForm = document.getElementById("writeReviewForm");
      if (revForm) {
        revForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const author = document.getElementById("reviewAuthor").value.trim();
          const role = document.getElementById("reviewRole").value.trim() || "Verified Athlete / Pro";
          const result = document.getElementById("reviewResult").value.trim();
          const comment = document.getElementById("reviewComment").value.trim();
          const rating = Number(ratingInput.value) || 5;
          const fb = document.getElementById("reviewFormFeedback");

          if (!author || !comment) {
            fb.className = "form-feedback form-feedback--error is-visible";
            fb.textContent = "Please enter your name and review comment.";
            return;
          }

          saveUserReview(product.id, {
            id: "user-" + Date.now(),
            author,
            role,
            result,
            comment,
            rating,
            date: new Date().toISOString().slice(0, 10)
          });

          showToast("Thank you! Your review has been published.");
          renderDetail(variantIndex);
          // Re-render page grids if present so star counts update live
          if (typeof window.refreshCatalogRatings === "function") window.refreshCatalogRatings();
          if (typeof window.refreshHomeBestsellers === "function") window.refreshHomeBestsellers();
        });
      }
    };

    renderDetail(selectedVariantIdx);
    openModal("productDetailModal");
  };

  // ---------- Product Card Builder ----------
  function createProductCardHTML(product, showVariants = true) {
    const stats = getRatingStats(product);
    const v0 = product.variants[0];
    const badgeClass =
      product.badgeStyle === "orange"
        ? "product-card__tag--orange"
        : product.badgeStyle === "emerald"
        ? "product-card__tag--emerald"
        : "";

    return `
      <article class="product-card" data-product-id="${escapeHTML(product.id)}" data-category="${escapeHTML(product.category)}">
        <div class="product-card__media">
          <span class="product-card__tag ${badgeClass}">${escapeHTML(product.badge)}</span>
          <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy" width="480" height="360">
        </div>
        <div class="product-card__body">
          <div class="product-card__cat">${escapeHTML(product.category)}</div>
          <h3 class="product-card__title">${escapeHTML(product.name)}</h3>
          <div class="rating-row">
            <span class="stars" aria-label="${stats.avg} out of 5 stars">${renderStars(stats.avg)}</span>
            <span class="rating-row__text">${stats.avg} (${stats.count} reviews)</span>
          </div>
          <p class="product-card__benefit">${escapeHTML(product.benefit)}</p>
          <div class="highlight-pills">
            ${product.highlights.slice(0, 3).map((h) => `<span class="highlight-pill">${escapeHTML(h)}</span>`).join("")}
          </div>
          ${
            showVariants
              ? `<div class="variant-group">
                  <span class="variant-group__label">Flavor / Size</span>
                  <div class="variant-chips">
                    ${product.variants
                      .map(
                        (v, i) => `
                      <button type="button" class="variant-chip ${i === 0 ? "is-selected" : ""}" data-card-variant="${i}">
                        ${escapeHTML(v.label)}
                      </button>`
                      )
                      .join("")}
                  </div>
                </div>`
              : ""
          }
          <div class="product-card__price-row">
            <div>
              <span class="price-current" data-price-current>${formatINR(v0.price)}</span>
              <span class="price-compare" data-price-compare>${formatINR(v0.compareAt)}</span>
            </div>
            <span class="product-card__servings" data-servings>${escapeHTML(v0.servings)}</span>
          </div>
          <div class="product-card__actions">
            <button type="button" class="btn btn--outline btn--sm" data-action="view-details">View Details</button>
            <button type="button" class="btn btn--primary btn--sm" data-action="enquire-now">Enquire Now</button>
          </div>
        </div>
      </article>
    `;
  }

  function bindProductCardEvents(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll(".product-card").forEach((card) => {
      const productId = card.getAttribute("data-product-id");
      const product = data.products.find((p) => p.id === productId);
      if (!product) return;

      let selectedIdx = 0;

      card.querySelectorAll("[data-card-variant]").forEach((chip) => {
        chip.addEventListener("click", () => {
          selectedIdx = Number(chip.getAttribute("data-card-variant"));
          card.querySelectorAll("[data-card-variant]").forEach((c) => c.classList.remove("is-selected"));
          chip.classList.add("is-selected");
          const v = product.variants[selectedIdx];
          const pCurr = card.querySelector("[data-price-current]");
          const pComp = card.querySelector("[data-price-compare]");
          const serv = card.querySelector("[data-servings]");
          if (pCurr) pCurr.textContent = formatINR(v.price);
          if (pComp) pComp.textContent = formatINR(v.compareAt);
          if (serv) serv.textContent = v.servings;
        });
      });

      const detailsBtn = card.querySelector('[data-action="view-details"]');
      const enquireBtn = card.querySelector('[data-action="enquire-now"]');

      if (detailsBtn) {
        detailsBtn.addEventListener("click", () => window.openProductDetail(productId, selectedIdx));
      }
      if (enquireBtn) {
        enquireBtn.addEventListener("click", () => window.openQuickOrder(productId, selectedIdx));
      }
    });
  }

  // ---------- Home Page Mounts ----------
  function initHomePage() {
    const bestsellersGrid = document.getElementById("homeBestsellersGrid");
    if (bestsellersGrid) {
      const coreIds = [
        "whey-protein-isolate",
        "micronized-creatine",
        "organic-plant-protein",
        "monk-fruit-sweetener"
      ];
      const renderHomeProducts = () => {
        const list = coreIds.map((id) => data.products.find((p) => p.id === id)).filter(Boolean);
        bestsellersGrid.innerHTML = list.map((p) => createProductCardHTML(p, false)).join("");
        bindProductCardEvents(bestsellersGrid);
      };
      window.refreshHomeBestsellers = renderHomeProducts;
      renderHomeProducts();
    }

    const homeRecipesGrid = document.getElementById("homeRecipesGrid");
    if (homeRecipesGrid) {
      const featured = data.recipes.filter((r) => r.featured).slice(0, 3);
      homeRecipesGrid.innerHTML = featured
        .map(
          (r) => `
        <article class="recipe-card">
          <div class="recipe-card__media">
            <img src="${r.image}" alt="${escapeHTML(r.title)}" loading="lazy" width="480" height="300">
            <span class="recipe-card__time">⏱ ${escapeHTML(r.prepTime)}</span>
          </div>
          <div class="recipe-card__body">
            <h3 class="recipe-card__title">${escapeHTML(r.title)}</h3>
            <div class="macro-grid">
              <div class="macro-box"><div class="macro-box__val">${escapeHTML(r.macros.protein)}</div><div class="macro-box__lbl">Protein</div></div>
              <div class="macro-box"><div class="macro-box__val">${escapeHTML(r.macros.carbs)}</div><div class="macro-box__lbl">Carbs</div></div>
              <div class="macro-box"><div class="macro-box__val">${escapeHTML(r.macros.calories)}</div><div class="macro-box__lbl">Calories</div></div>
            </div>
            <p class="recipe-card__desc">${escapeHTML(r.summary)}</p>
            <div style="margin-top:auto;display:flex;gap:10px;flex-wrap:wrap;">
              <a class="btn btn--outline-emerald btn--sm" href="recipes.html#${escapeHTML(r.id)}">View Recipe</a>
              <a class="btn btn--primary btn--sm" href="products.html?product=${encodeURIComponent(
                r.productsUsed[0].id
              )}">Shop Product</a>
            </div>
          </div>
        </article>`
        )
        .join("");
    }

    // Verified Customer Reviews Carousel
    const reviewsTrack = document.getElementById("reviewsCarouselTrack");
    const prevBtn = document.getElementById("reviewsPrev");
    const nextBtn = document.getElementById("reviewsNext");
    if (reviewsTrack && data.featuredTestimonials.length) {
      let page = 0;
      const pageSize = 3;
      const totalPages = Math.ceil(data.featuredTestimonials.length / pageSize);

      const renderReviews = () => {
        const start = page * pageSize;
        const slice = data.featuredTestimonials.slice(start, start + pageSize);
        reviewsTrack.innerHTML = slice
          .map(
            (t) => `
          <article class="review-card">
            <div class="review-card__top">
              <span class="stars" aria-label="5 out of 5 stars">${renderStars(t.rating)}</span>
              <span class="verified-badge">✓ Verified Buyer</span>
            </div>
            <p class="review-card__quote">"${escapeHTML(t.quote)}"</p>
            <div class="review-card__result">Result: ${escapeHTML(t.result)}</div>
            <div class="review-card__author">
              <div>
                <div class="review-card__name">${escapeHTML(t.name)}</div>
                <div class="review-card__role">${escapeHTML(t.role)}</div>
              </div>
              <a class="review-card__product" href="products.html?product=${encodeURIComponent(t.productId)}">
                ${escapeHTML(t.product)} →
              </a>
            </div>
          </article>`
          )
          .join("");
      };

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          page = (page - 1 + totalPages) % totalPages;
          renderReviews();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          page = (page + 1) % totalPages;
          renderReviews();
        });
      }
      renderReviews();
    }

    // Newsletter Form
    const nlForm = document.getElementById("newsletterForm");
    if (nlForm) {
      nlForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("newsletterEmail");
        const fb = document.getElementById("newsletterFeedback");
        const email = emailInput.value.trim();
        if (!email || !email.includes("@")) {
          fb.className = "form-feedback form-feedback--error is-visible";
          fb.textContent = "Please enter a valid email address to unlock your 10% discount.";
          return;
        }
        try {
          localStorage.setItem(STORAGE_NEWSLETTER_KEY, email);
        } catch {}
        fb.className = "form-feedback form-feedback--success is-visible";
        fb.innerHTML = `Welcome to MBP Nutrition! Use code <strong>MBP10</strong> at checkout/enquiry for 10% off your first order.`;
        showToast("Code MBP10 unlocked! Sent to " + email);
        emailInput.value = "";
      });
    }
  }

  // ---------- Products Catalog Page ----------
  function initProductsPage() {
    const grid = document.getElementById("catalogProductsGrid");
    if (!grid) return;

    let activeCategory = "All";
    let searchTerm = "";

    const searchInput = document.getElementById("catalogSearchInput");
    const countLabel = document.getElementById("catalogCountLabel");
    const filterTabs = document.querySelectorAll("[data-filter-category]");

    const urlParams = new URLSearchParams(window.location.search);
    const paramQuery = urlParams.get("q");
    const paramCat = urlParams.get("category");
    const paramProduct = urlParams.get("product");

    if (paramQuery && searchInput) {
      searchTerm = paramQuery;
      searchInput.value = paramQuery;
    }
    if (paramCat) {
      activeCategory = paramCat;
      filterTabs.forEach((t) => {
        t.classList.toggle("is-active", t.getAttribute("data-filter-category") === activeCategory);
      });
    }

    const renderCatalog = () => {
      const q = searchTerm.trim().toLowerCase();
      const filtered = data.products.filter((p) => {
        const catMatch = activeCategory === "All" || p.category === activeCategory;
        const textMatch =
          !q ||
          (p.name + " " + p.category + " " + p.benefit + " " + p.description + " " + p.highlights.join(" "))
            .toLowerCase()
            .includes(q);
        return catMatch && textMatch;
      });

      if (countLabel) {
        countLabel.textContent = `Showing ${filtered.length} of ${data.products.length} clean-label formulas`;
      }

      if (!filtered.length) {
        grid.innerHTML = `
          <div class="info-card" style="grid-column:1/-1;text-align:center;">
            <h3>No supplements matched "${escapeHTML(searchTerm)}"</h3>
            <p style="margin:8px 0 16px;">Try clearing your search or switching to All Categories.</p>
            <button type="button" class="btn btn--primary btn--sm" id="resetCatalogFilters">Show All 5 Products</button>
          </div>`;
        const resetBtn = document.getElementById("resetCatalogFilters");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            activeCategory = "All";
            searchTerm = "";
            if (searchInput) searchInput.value = "";
            filterTabs.forEach((t) => t.classList.toggle("is-active", t.getAttribute("data-filter-category") === "All"));
            renderCatalog();
          });
        }
        return;
      }

      grid.innerHTML = filtered.map((p) => createProductCardHTML(p, true)).join("");
      bindProductCardEvents(grid);
    };

    window.refreshCatalogRatings = renderCatalog;

    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeCategory = tab.getAttribute("data-filter-category");
        filterTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        renderCatalog();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value;
        renderCatalog();
      });
    }

    renderCatalog();

    if (paramProduct) {
      const target = data.products.find((p) => p.id === paramProduct);
      if (target) {
        setTimeout(() => window.openProductDetail(target.id, 0), 120);
      }
    }
  }

  // ---------- Recipes Hub Page ----------
  function initRecipesPage() {
    const grid = document.getElementById("recipesHubGrid");
    if (!grid) return;

    grid.innerHTML = data.recipes
      .map(
        (r) => `
      <article class="recipe-card" id="${escapeHTML(r.id)}">
        <div class="recipe-card__media">
          <img src="${r.image}" alt="${escapeHTML(r.title)}" loading="lazy" width="600" height="375">
          <span class="recipe-card__time">⏱ ${escapeHTML(r.prepTime)}</span>
        </div>
        <div class="recipe-card__body">
          <h2 class="recipe-card__title" style="font-size:1.3rem;">${escapeHTML(r.title)}</h2>
          <div class="macro-grid">
            <div class="macro-box"><div class="macro-box__val">${escapeHTML(r.macros.protein)}</div><div class="macro-box__lbl">Protein</div></div>
            <div class="macro-box"><div class="macro-box__val">${escapeHTML(r.macros.carbs)}</div><div class="macro-box__lbl">Carbs</div></div>
            <div class="macro-box"><div class="macro-box__val">${escapeHTML(r.macros.calories)}</div><div class="macro-box__lbl">Calories</div></div>
          </div>
          <p class="recipe-card__desc">${escapeHTML(r.summary)}</p>

          <div class="recipe-ingredients">
            <strong>Ingredients:</strong>
            <ul style="list-style:disc;padding-left:18px;display:grid;gap:4px;color:var(--text-main);">
              ${r.ingredients.map((ing) => `<li>${escapeHTML(ing)}</li>`).join("")}
            </ul>
          </div>

          <div class="recipe-steps">
            <h4>Step-by-Step Instructions</h4>
            <ol>
              ${r.steps.map((s) => `<li>${escapeHTML(s)}</li>`).join("")}
            </ol>
          </div>

          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:10px;">
            <a class="btn btn--primary btn--sm" href="products.html?product=${encodeURIComponent(
              r.productsUsed[0].id
            )}">Shop Ingredients Used →</a>
            ${
              r.productsUsed[1]
                ? `<a class="btn btn--outline-emerald btn--sm" href="products.html?product=${encodeURIComponent(
                    r.productsUsed[1].id
                  )}">Shop Sweetener</a>`
                : ""
            }
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  // ---------- Contact Page (Form + FAQ Accordion) ----------
  function initContactPage() {
    const form = document.getElementById("contactEnquiryForm");
    if (form) {
      const urlParams = new URLSearchParams(window.location.search);
      const inquiryParam = urlParams.get("inquiry");
      const productParam = urlParams.get("product");
      const inquirySelect = document.getElementById("contactInquiryType");
      const messageField = document.getElementById("contactMessage");

      if (inquiryParam && inquirySelect) {
        Array.from(inquirySelect.options).forEach((opt) => {
          if (opt.value.toLowerCase() === inquiryParam.toLowerCase()) {
            inquirySelect.value = opt.value;
          }
        });
      }
      if (productParam && messageField && !messageField.value) {
        messageField.value = `Hi MBP Nutrition team, I'd like guidance regarding ${productParam}.`;
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const phone = document.getElementById("contactPhone").value.trim();
        const inquiryType = document.getElementById("contactInquiryType").value;
        const message = document.getElementById("contactMessage").value.trim();
        const fb = document.getElementById("contactFormFeedback");

        if (!name || !email || !email.includes("@") || !phone || !message) {
          fb.className = "form-feedback form-feedback--error is-visible";
          fb.textContent = "Please complete all required fields with a valid email address and phone number.";
          return;
        }

        const ticket = "TKT-" + Math.floor(10000 + Math.random() * 90000);
        fb.className = "form-feedback form-feedback--success is-visible";
        fb.innerHTML = `Thank you, <strong>${escapeHTML(name)}</strong>! Your <strong>${escapeHTML(
          inquiryType
        )}</strong> enquiry (Ref: <strong>${ticket}</strong>) has been received. Our sports nutrition desk will respond to <strong>${escapeHTML(
          email
        )}</strong> within 1 business day.`;
        showToast("Enquiry received! Ticket " + ticket);
        form.reset();
      });
    }

    // FAQ Accordion
    document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        const panelId = trigger.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : trigger.nextElementSibling;
        trigger.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.classList.toggle("is-open", !expanded);
      });
    });
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    ensureModals();
    initHomePage();
    initProductsPage();
    initRecipesPage();
    initContactPage();
  });
})();
