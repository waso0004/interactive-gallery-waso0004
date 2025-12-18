(() => {
  "use strict"; // Turn on strict mode so JavaScript warns us about risky mistakes.

 
  // Artwork Data (all the pieces we show in the gallery)
 

  const galleryData = [
    {
  id: "art-01", // Short id so we can tell which artwork is which.
  title: "Starlit Harbor", // Title shown under the thumbnail and in the lightbox.
  caption: "A contemplative oceanside evening rendered with neon pinpoints of light.", // Longer description used in the lightbox caption.
  thumb: "images/1.jpg", // Thumbnail image path for the grid.
  hd: "images/1.jpg", // High-resolution image shown in the lightbox.
  alt: "Digital illustration titled Starlit Harbor by Yoneyama Mai." // Alt text read by screen readers.
    },
    {
      id: "art-02",
      title: "Dawn Commune",
      caption: "Warm sunrise hues bathe distant city towers in a luminous haze.",
      thumb: "images/2.jpg",
      hd: "images/2.jpg",
      alt: "Digital illustration titled Dawn Commune by Yoneyama Mai."
    },
    {
      id: "art-03",
      title: "Skybound",
      caption: "A soaring perspective capturing the sensation of motion above the clouds.",
      thumb: "images/3.jpg",
      hd: "images/3.jpg",
      alt: "Digital illustration titled Skybound by Yoneyama Mai."
    },
    {
      id: "art-04",
      title: "Aurora Streets",
      caption: "Chromatic reflections stretch across rain-slicked streets under neon signage.",
      thumb: "images/4.jpg",
      hd: "images/4.jpg",
      alt: "Digital illustration titled Aurora Streets by Yoneyama Mai."
    },
    {
      id: "art-05",
      title: "Iridescent Gaze",
      caption: "Portrait study highlighting delicate lighting and flowing hair.",
      thumb: "images/5.jpg",
      hd: "images/5.jpg",
      alt: "Digital illustration titled Iridescent Gaze by Yoneyama Mai."
    },
    {
      id: "art-06",
      title: "Nocturne Bloom",
      caption: "Bioluminescent flora glows softly against a star-speckled sky.",
      thumb: "images/6.jpg",
      hd: "images/6.jpg",
      alt: "Digital illustration titled Nocturne Bloom by Yoneyama Mai."
    },
    {
      id: "art-07",
      title: "Future Isles",
      caption: "Floating structures drift over tranquil waters drenched in twilight colors.",
      thumb: "images/7.jpg",
      hd: "images/7.jpg",
      alt: "Digital illustration titled Future Isles by Yoneyama Mai."
    },
    {
      id: "art-08",
      title: "Luminous Drift",
      caption: "Soft gradients and glowing trails trace the motion of a serene figure.",
      thumb: "images/8.jpg",
      hd: "images/8.jpg",
      alt: "Digital illustration titled Luminous Drift by Yoneyama Mai."
    },
    {
      id: "art-09",
      title: "Mirrored Horizon",
      caption: "Expansive clouds mirror across calm waters under a bright horizon.",
      thumb: "images/9.jpg",
      hd: "images/9.jpg",
      alt: "Digital illustration titled Mirrored Horizon by Yoneyama Mai."
    },
    {
      id: "art-10",
      title: "Crimson Echo",
      caption: "Electric reds pulse through architecture floating above the skyline.",
      thumb: "images/10.jpg",
      hd: "images/10.jpg",
      alt: "Digital illustration titled Crimson Echo by Yoneyama Mai."
    },
    {
      id: "art-11",
      title: "Gilded Current",
      caption: "Golden light cascades through sweeping fabric caught mid-motion.",
      thumb: "images/11.jpg",
      hd: "images/11.jpg",
      alt: "Digital illustration titled Gilded Current by Yoneyama Mai."
    },
    {
      id: "art-12",
      title: "Azure Reverie",
      caption: "Cool-toned cityscapes melt into a dreamlike twilight gradient.",
      thumb: "images/12.jpg",
      hd: "images/12.jpg",
      alt: "Digital illustration titled Azure Reverie by Yoneyama Mai."
    }
  ];


 
  // Cached DOM References (elements we reuse many times)
 

  const refs = {
    gallery: null, // The wrapper that will receive all the artwork cards.
    lightbox: null, // The overlay that appears when someone opens an artwork.
    lightboxImage: null, // The full-size <img> element inside the overlay.
    lightboxCaption: null, // The <figcaption> inside the overlay.
    layoutControls: null, // The container that holds the grid/list buttons.
    layoutStatus: null // The paragraph that announces which layout is active.
  };


 
  // Application State (values that change while the app runs)
 

  const state = {
    layout: "grid", // Remember whether the gallery is showing grid or list view.
    activeArtworkId: null // Remember which artwork is currently open in the lightbox.
  };


 
  // Application Bootstrap (kick things off once HTML has loaded)
 

  document.addEventListener("DOMContentLoaded", init); // Run init after the browser has built the DOM tree.


  // Initialization Lifecycle

  function init() {
    refs.gallery = document.getElementById("gallery"); // Captures the gallery container injected into index.html.
    refs.lightbox = document.getElementById("lightbox"); // Captures the overlay wrapper that will toggle visibility.
    refs.lightboxImage = document.getElementById("lightboxImage"); // Captures the HD image element for source updates.
    refs.lightboxCaption = document.getElementById("lightboxCaption"); // Captures where the long caption text will appear.
    refs.layoutControls = document.getElementById("viewControls"); // Captures the parent element for layout toggle delegation.
    refs.layoutStatus = document.getElementById("layoutStatus"); // Captures the live region used to announce layout changes.

    if (!areRefsReady()) {
      console.error("Interactive gallery: required DOM nodes are missing."); // Logs a descriptive error if markup is incomplete.
      return; // Abandons initialization to avoid runtime exceptions elsewhere.
    }

    renderGallery(galleryData); // Populates the gallery grid with all artwork tiles in one pass.
    bindEvents(); // Hooks up delegated event listeners once the DOM nodes exist.
  }


  // DOM Guard Rails

  function areRefsReady() {
    return (
      refs.gallery instanceof HTMLElement && // Validates that the gallery container exists.
      refs.lightbox instanceof HTMLElement && // Ensures the lightbox wrapper was found.
      refs.lightboxImage instanceof HTMLImageElement && // Ensures the HD image element is present.
      refs.lightboxCaption instanceof HTMLElement && // Ensures the caption element is available.
      refs.layoutControls instanceof HTMLElement && // Ensures layout controls are reachable.
      refs.layoutStatus instanceof HTMLElement // Ensures the status live region exists.
    );
  }


  // Gallery Rendering

  function renderGallery(items) {
    const fragment = document.createDocumentFragment(); // Uses a document fragment to minimize layout thrashing.

    for (const item of items) {
      fragment.appendChild(createGalleryTile(item)); // Builds each tile and appends it to the fragment.
    }

    refs.gallery.appendChild(fragment); // Inserts the populated fragment into the gallery grid at once.
  }

  function createGalleryTile(item) {
    const figure = document.createElement("figure"); // Root element that groups the thumbnail and caption.
    figure.className = "gallery__item"; // Applies styling used for each tile in the grid.
    figure.dataset.artworkId = item.id; // Stores the artwork id so future features can identify the tile.

    const button = document.createElement("button"); // Button provides keyboard accessibility without extra JavaScript.
    button.type = "button"; // Prevents the button from submitting any forms inadvertently.
    button.className = "gallery__thumb"; // Applies styling for the interactive thumbnail area.
    button.dataset.hd = item.hd; // Caches the high-definition image path for quick lookup during clicks.
    button.dataset.caption = item.caption; // Caches the longer caption text for the lightbox.
    button.dataset.alt = item.alt; // Caches the alt text so we can reuse it when swapping images.
    button.dataset.title = item.title; // Caches the artwork title for the caption display.

    const img = document.createElement("img"); // Image element displays the thumbnail asset.
    img.className = "gallery__image"; // Applies thumbnail-specific styling such as the hover zoom.
    img.src = item.thumb; // Points the image source at the thumbnail file path.
    img.alt = item.alt; // Supplies accessible alt text so the tile remains meaningful to screen readers.
    img.loading = "lazy"; // Defers loading until the image scrolls into view, improving performance.
    img.decoding = "async"; // Allows the browser to decode images asynchronously for smoother rendering.

    button.appendChild(img); // Nests the image within the interactive button container.

    const caption = document.createElement("figcaption"); // Caption element holds the title and credit badge.
    caption.className = "gallery__caption"; // Applies layout and typography styling for captions.

    const titleSpan = document.createElement("span"); // Span wraps the title so we can style and reuse it easily.
    titleSpan.className = "gallery__title"; // Applies a slightly bolder weight and ensures consistent spacing.
    titleSpan.textContent = item.title; // Inserts the artwork title text.

    const creditSpan = document.createElement("span"); // Span houses the recurring credit badge text.
    creditSpan.className = "gallery__credit"; // Styles the credit label to read like a badge.
    creditSpan.textContent = "Art by Yoneyama Mai"; // Credits the artist on each tile, meeting assignment requirements.

    caption.appendChild(titleSpan); // Adds the title span to the caption block.
    caption.appendChild(creditSpan); // Adds the credit badge to the caption block.

    figure.appendChild(button); // Places the interactive button at the top of the tile.
    figure.appendChild(caption); // Places the caption beneath the thumbnail.

    return figure; // Returns the fully assembled tile for inclusion in the gallery.
  }


  // Event Wiring

  function bindEvents() {
    refs.gallery.addEventListener("click", handleThumbnailSelection); // Delegates thumbnail clicks to open the lightbox.
    refs.layoutControls.addEventListener("click", handleLayoutToggle); // Delegates layout toggle clicks for grid/list view.
    refs.lightbox.addEventListener("click", handleLightboxInteraction); // Allows both backdrop and HD image to close the overlay.
    document.addEventListener("keydown", handleGlobalKeydown); // Enables keyboard shortcuts such as Escape to close the lightbox.
  }


  // Gallery Interaction Handlers

  function handleThumbnailSelection(event) {
    const trigger = event.target.closest(".gallery__thumb"); // Finds the nearest thumbnail button relative to the click target.
    if (!trigger || !refs.gallery.contains(trigger)) return; // Ignores clicks that land outside the gallery buttons.

    const hdSource = trigger.dataset.hd; // Retrieves the HD image path stored on the button.
    const captionText = trigger.dataset.caption; // Retrieves the descriptive caption string.
    const altText = trigger.dataset.alt; // Retrieves the alt text to keep descriptions consistent.
    const titleText = trigger.dataset.title; // Retrieves the artwork title for combined captions.
    const hostFigure = trigger.closest(".gallery__item"); // Grabs the surrounding figure for stable artwork identification.

    if (!hdSource) return; // If no HD path exists, skip opening to avoid a broken overlay.

    openLightbox({
      src: hdSource, // Passes the HD image source to the lightbox.
      caption: captionText,
      alt: altText,
      title: titleText,
      id: hostFigure ? hostFigure.dataset.artworkId || null : null // Uses the surrounding figure id for state tracking.
    });
  }

  function handleLayoutToggle(event) {
    const control = event.target.closest("[data-layout]"); // Detects which layout button (if any) was pressed.
    if (!control || !refs.layoutControls.contains(control)) return; // Exits when the click is outside the toggle buttons.

    const requestedLayout = control.getAttribute("data-layout") || "grid"; // Reads the desired layout from the data attribute.
    if (requestedLayout === state.layout) return; // Avoids recalculating the layout if it is already active.

    state.layout = requestedLayout; // Updates the stored layout state.
    refs.gallery.setAttribute("data-layout", requestedLayout); // Updates the gallery attribute so CSS can react.

    updateLayoutButtons(requestedLayout); // Refreshes visual states and accessibility attributes on the buttons.
    announceLayoutChange(requestedLayout); // Updates the live region text for assistive technologies.
  }


  // Lightbox Interaction Handlers

  function handleLightboxInteraction(event) {
    const { target } = event; // Saves the original event target for clarity.

    if (target instanceof HTMLElement && target.dataset.action === "close") {
      closeLightbox(); // Clicking the backdrop closes the overlay.
      return;
    }

    if (target === refs.lightboxImage) {
      closeLightbox(); // Clicking directly on the HD image closes the overlay as per assignment requirements.
    }
  }

  function handleGlobalKeydown(event) {
    if (event.key === "Escape" && !refs.lightbox.hasAttribute("hidden")) {
      closeLightbox(); // Allows the Escape key to dismiss the overlay, improving accessibility.
    }
  }


  // Lightbox Controls

  function openLightbox({ src, caption, alt, title, id }) {
    refs.lightboxImage.src = src; // Injects the requested HD image path into the overlay.
    refs.lightboxImage.alt = alt || title || "Artwork by Yoneyama Mai"; // Reuses detailed alt text or falls back to a generic description.
    refs.lightboxCaption.textContent = title ? `${title} — ${caption}` : caption || ""; // Combines title and caption for context.
    refs.lightbox.removeAttribute("hidden"); // Reveals the lightbox overlay.
    document.body.classList.add("is-locked"); // Locks background scrolling while the overlay is active.
    state.activeArtworkId = id; // Records which artwork is currently highlighted.
  }

  function closeLightbox() {
    refs.lightbox.setAttribute("hidden", ""); // Hides the overlay again.
    document.body.classList.remove("is-locked"); // Restores background scrolling when the overlay closes.
    refs.lightboxImage.src = ""; // Clears the image source to free memory in some browsers.
    refs.lightboxImage.alt = ""; // Clears the alt text so stale descriptions are not announced.
    refs.lightboxCaption.textContent = ""; // Clears the caption to avoid flashing outdated text on the next open.
    state.activeArtworkId = null; // Resets the active artwork tracker.
  }


  // Accessibility & UI Sync Helpers

  function updateLayoutButtons(activeLayout) {
    const buttons = refs.layoutControls.querySelectorAll("[data-layout]"); // Collects both layout toggle buttons.

    for (const button of buttons) {
      const isActive = button.getAttribute("data-layout") === activeLayout; // Checks whether the button matches the active layout.
      button.classList.toggle("controls__button--active", isActive); // Adds or removes the visual highlight class.
      button.setAttribute("aria-pressed", String(isActive)); // Updates ARIA pressed state for assistive tech.
    }
  }

  function announceLayoutChange(layout) {
    const text = layout === "list" ? "List view enabled" : "Grid view enabled"; // Chooses wording that matches the current layout.
    refs.layoutStatus.textContent = text; // Updates the live region so screen readers hear the change.
  }
})();
