/**
 * UI Components Module
 * Reusable UI components for the browser extension
 */

import { ELEMENT_IDS, UI_CONFIG } from "./constants";
import type { ToastState } from "./types";

/**
 * Creates a toast notification element
 * @param state - The state of the toast (loading, success, error)
 * @returns HTMLElement - The toast element
 */
export function createToast(state: ToastState): HTMLElement {
	const toast = document.createElement("div");
	toast.id = ELEMENT_IDS.SUPERMEMORY_TOAST;

	toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2147483647;
    background: #ffffff;
    border-radius: 9999px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    color: #374151;
    min-width: 200px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.12);
  `;

	// Add keyframe animations and fonts if not already present
	if (!document.getElementById("supermemory-toast-styles")) {
		const style = document.createElement("style");
		style.id = "supermemory-toast-styles";
		style.textContent = `
      @font-face {
        font-family: 'Space Grotesk';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url('${chrome.runtime.getURL("fonts/SpaceGrotesk-Light.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'Space Grotesk';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('${chrome.runtime.getURL("fonts/SpaceGrotesk-Regular.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'Space Grotesk';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('${chrome.runtime.getURL("fonts/SpaceGrotesk-Medium.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'Space Grotesk';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('${chrome.runtime.getURL("fonts/SpaceGrotesk-SemiBold.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'Space Grotesk';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('${chrome.runtime.getURL("fonts/SpaceGrotesk-Bold.ttf")}') format('truetype');
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
		document.head.appendChild(style);
	}

	const icon = document.createElement("div");
	icon.style.cssText = "width: 20px; height: 20px; flex-shrink: 0;";

	const text = document.createElement("span");
	text.style.fontWeight = "500";

	// Configure toast based on state
	switch (state) {
		case "loading":
			icon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V2" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 22V18" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
          <path d="M20.49 8.51L18.36 6.38" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
          <path d="M5.64 17.64L3.51 15.51" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
          <path d="M22 12H18" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
          <path d="M6 12H2" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
          <path d="M20.49 15.49L18.36 17.62" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
          <path d="M5.64 6.36L3.51 8.49" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        </svg>
      `;
			icon.style.animation = "spin 1s linear infinite";
			text.textContent = "Adding to Memory...";
			break;

		case "success": {
			const iconUrl = browser.runtime.getURL("/icon-16.png");
			icon.innerHTML = `<img src="${iconUrl}" width="20" height="20" alt="Success" style="border-radius: 2px;" />`;
			text.textContent = "Added to Memory";
			break;
		}

		case "error":
			icon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#ef4444"/>
          <path d="M15 9L9 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 9L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
			text.textContent = "Failed to save memory / Make sure you are logged in";
			break;
	}

	toast.appendChild(icon);
	toast.appendChild(text);

	return toast;
}

/**
 * Creates the Twitter import button
 * @param onClick - Click handler for the button
 * @returns HTMLElement - The button element
 */
export function createTwitterImportButton(onClick: () => void): HTMLElement {
	const button = document.createElement("div");
	button.id = ELEMENT_IDS.TWITTER_IMPORT_BUTTON;
	button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 2147483646;
    background: #ffffff;
    color: black;
    border: none;
    border-radius: 50px;
    padding: 10px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  `;

	const iconUrl = browser.runtime.getURL("/icon-16.png");
	button.innerHTML = `
    <img src="${iconUrl}" width="20" height="20" alt="Save to Memory" style="border-radius: 4px;" />
    <span style="font-weight: 500; font-size: 12px;">Import Bookmarks</span>
  `;

	button.addEventListener("mouseenter", () => {
		button.style.opacity = "0.8";
		button.style.boxShadow = "0 4px 12px rgba(29, 155, 240, 0.4)";
	});

	button.addEventListener("mouseleave", () => {
		button.style.opacity = "1";
		button.style.boxShadow = "0 2px 8px rgba(29, 155, 240, 0.3)";
	});

	button.addEventListener("click", onClick);

	return button;
}

/**
 * Creates a save tweet element button for Twitter/X
 * @param onClick - Click handler for the button
 * @returns HTMLElement - The save button element
 */
export function createSaveTweetElement(onClick: () => void): HTMLElement {
	const iconButton = document.createElement("div");
	iconButton.style.cssText = `
    display: inline-flex;
    align-items: flex-end;
    opacity: 0.7;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 2px;
    z-index: 1000;
  `;

	const iconFileName = "/icon-16.png";
	const iconUrl = browser.runtime.getURL(iconFileName);
	iconButton.innerHTML = `
    <img src="${iconUrl}" width="20" height="20" alt="Save to Memory" style="border-radius: 4px;" />
  `;

	iconButton.addEventListener("mouseenter", () => {
		iconButton.style.opacity = "1";
	});

	iconButton.addEventListener("mouseleave", () => {
		iconButton.style.opacity = "0.7";
	});

	iconButton.addEventListener("click", (event) => {
		event.stopPropagation();
		event.preventDefault();
		onClick();
	});

	return iconButton;
}

/**
 * Creates a save element button for ChatGPT input bar
 * @param onClick - Click handler for the button
 * @returns HTMLElement - The save button element
 */
export function createChatGPTInputBarElement(onClick: () => void): HTMLElement {
	const iconButton = document.createElement("div");
	iconButton.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 24px;
    cursor: pointer;
    transition: opacity 0.2s ease;
    border-radius: 50%;
  `;

	// Use appropriate icon based on theme
	const iconFileName = "/icon-16.png";
	const iconUrl = browser.runtime.getURL(iconFileName);
	iconButton.innerHTML = `
    <img src="${iconUrl}" width="20" height="20" alt="Save to Memory" style="border-radius: 50%;" />
  `;

	iconButton.addEventListener("mouseenter", () => {
		iconButton.style.opacity = "0.8";
	});

	iconButton.addEventListener("mouseleave", () => {
		iconButton.style.opacity = "1";
	});

	iconButton.addEventListener("click", (event) => {
		event.stopPropagation();
		event.preventDefault();
		onClick();
	});

	return iconButton;
}

/**
 * Creates a save element button for Claude input bar
 * @param onClick - Click handler for the button
 * @returns HTMLElement - The save button element
 */
export function createClaudeInputBarElement(onClick: () => void): HTMLElement {
	const iconButton = document.createElement("div");
	iconButton.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 32px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 6px;
    background: transparent;
  `;

	const iconFileName = "/icon-16.png";
	const iconUrl = browser.runtime.getURL(iconFileName);
	iconButton.innerHTML = `
    <img src="${iconUrl}" width="20" height="20" alt="Get Related Memories from supermemory" style="border-radius: 4px;" />
  `;

	iconButton.addEventListener("mouseenter", () => {
		iconButton.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
		iconButton.style.borderColor = "rgba(0, 0, 0, 0.2)";
	});

	iconButton.addEventListener("mouseleave", () => {
		iconButton.style.backgroundColor = "transparent";
		iconButton.style.borderColor = "rgba(0, 0, 0, 0.1)";
	});

	iconButton.addEventListener("click", (event) => {
		event.stopPropagation();
		event.preventDefault();
		onClick();
	});

	return iconButton;
}

/**
 * Creates a save element button for T3.chat input bar
 * @param onClick - Click handler for the button
 * @returns HTMLElement - The save button element
 */
export function createT3InputBarElement(onClick: () => void): HTMLElement {
	const iconButton = document.createElement("div");
	iconButton.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 32px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 6px;
    background: transparent;
  `;

	const iconFileName = "/icon-16.png";
	const iconUrl = browser.runtime.getURL(iconFileName);
	iconButton.innerHTML = `
    <img src="${iconUrl}" width="20" height="20" alt="Get Related Memories from supermemory" style="border-radius: 4px;" />
  `;

	iconButton.addEventListener("mouseenter", () => {
		iconButton.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
		iconButton.style.borderColor = "rgba(0, 0, 0, 0.2)";
	});

	iconButton.addEventListener("mouseleave", () => {
		iconButton.style.backgroundColor = "transparent";
		iconButton.style.borderColor = "rgba(0, 0, 0, 0.1)";
	});

	iconButton.addEventListener("click", (event) => {
		event.stopPropagation();
		event.preventDefault();
		onClick();
	});

	return iconButton;
}

/**
 * Utility functions for DOM manipulation
 */
export const DOMUtils = {
	/**
	 * Check if current page is on specified domains
	 * @param domains - Array of domain names to check
	 * @returns boolean
	 */
	isOnDomain(domains: readonly string[]): boolean {
		return domains.includes(window.location.hostname);
	},

	/**
	 * Detect if the page is in dark mode based on color-scheme style
	 * @returns boolean - true if dark mode, false if light mode
	 */
	isDarkMode(): boolean {
		const htmlElement = document.documentElement;
		const style = htmlElement.getAttribute("style");
		return style?.includes("color-scheme: dark") || false;
	},

	/**
	 * Check if element exists in DOM
	 * @param id - Element ID to check
	 * @returns boolean
	 */
	elementExists(id: string): boolean {
		return !!document.getElementById(id);
	},

	/**
	 * Remove element from DOM if it exists
	 * @param id - Element ID to remove
	 */
	removeElement(id: string): void {
		const element = document.getElementById(id);
		element?.remove();
	},

	/**
	 * Show toast notification with auto-dismiss
	 * @param state - Toast state
	 * @param duration - Duration to show toast (default from config)
	 * @returns The toast element
	 */
	showToast(
		state: ToastState,
		duration: number = UI_CONFIG.TOAST_DURATION,
	): HTMLElement {
		const existingToast = document.getElementById(
			ELEMENT_IDS.SUPERMEMORY_TOAST,
		);

		if ((state === "success" || state === "error") && existingToast) {
			const icon = existingToast.querySelector("div");
			const text = existingToast.querySelector("span");

			if (icon && text) {
				if (state === "success") {
					const iconUrl = browser.runtime.getURL("/icon-16.png");
					icon.innerHTML = `<img src="${iconUrl}" width="20" height="20" alt="Success" style="border-radius: 2px;" />`;
					icon.style.animation = "";
					text.textContent = "Added to Memory";
				} else if (state === "error") {
					icon.innerHTML = `
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="12" cy="12" r="10" fill="#ef4444"/>
							<path d="M15 9L9 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M9 9L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					`;
					icon.style.animation = "";
					text.textContent =
						"Failed to save memory / Make sure you are logged in";
				}

				// Auto-dismiss
				setTimeout(() => {
					if (document.body.contains(existingToast)) {
						existingToast.style.animation = "fadeOut 0.3s ease-out";
						setTimeout(() => {
							if (document.body.contains(existingToast)) {
								existingToast.remove();
							}
						}, 300);
					}
				}, duration);

				return existingToast;
			}
		}

		const existingToasts = document.querySelectorAll(
			`#${ELEMENT_IDS.SUPERMEMORY_TOAST}`,
		);
		existingToasts.forEach((toast) => {
			toast.remove();
		});

		const toast = createToast(state);
		document.body.appendChild(toast);

		// Auto-dismiss for success and error states
		if (state === "success" || state === "error") {
			setTimeout(() => {
				if (document.body.contains(toast)) {
					toast.style.animation = "fadeOut 0.3s ease-out";
					setTimeout(() => {
						if (document.body.contains(toast)) {
							toast.remove();
						}
					}, 300);
				}
			}, duration);
		}

		return toast;
	},
};
