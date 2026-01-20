/**
 * Theme Management Module
 * Handles dark/light mode switching
 */

import { $ } from '../utils/dom.js';

const THEME_KEY = 'theme';

/**
 * Sets the dark mode state
 * @param {boolean} isDark - Whether to enable dark mode
 */
export function setDarkMode(isDark) {
  const themeIcon = $('theme-icon');

  if (isDark) {
    document.documentElement.classList.add('dark');
    if (themeIcon) {
      themeIcon.className = 'fas fa-moon';
    }
  } else {
    document.documentElement.classList.remove('dark');
    if (themeIcon) {
      themeIcon.className = 'fas fa-sun';
    }
  }

  // Save preference
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

/**
 * Gets the current dark mode state
 * @returns {boolean}
 */
export function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

/**
 * Toggles dark mode
 * @returns {boolean} - New dark mode state
 */
export function toggleDarkMode() {
  const newState = !isDarkMode();
  setDarkMode(newState);
  return newState;
}

/**
 * Initializes theme based on saved preference or system preference
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
  setDarkMode(shouldBeDark);

  // Set up toggle button
  const themeToggle = $('theme-toggle');
  if (themeToggle) {
    themeToggle.onclick = toggleDarkMode;
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if no saved preference
    if (!localStorage.getItem(THEME_KEY)) {
      setDarkMode(e.matches);
    }
  });
}
