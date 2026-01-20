/**
 * DOM Utility Functions
 * Safe DOM manipulation helpers
 */

import { createElement } from './sanitize.js';

/**
 * Gets an element by ID with null check
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
export function $(id) {
  return document.getElementById(id);
}

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (defaults to document)
 * @returns {Element|null}
 */
export function $$(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (defaults to document)
 * @returns {NodeList}
 */
export function $$$(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Adds event listener with cleanup support
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 * @returns {Function} - Cleanup function
 */
export function on(element, event, handler, options = {}) {
  if (!element) return () => {};
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Shows an element
 * @param {HTMLElement} element
 */
export function show(element) {
  if (element) {
    element.classList.remove('hidden');
  }
}

/**
 * Hides an element
 * @param {HTMLElement} element
 */
export function hide(element) {
  if (element) {
    element.classList.add('hidden');
  }
}

/**
 * Toggles element visibility
 * @param {HTMLElement} element
 * @param {boolean} visible - Force visibility state
 */
export function toggle(element, visible) {
  if (element) {
    element.classList.toggle('hidden', visible === undefined ? undefined : !visible);
  }
}

/**
 * Clears all children from an element
 * @param {HTMLElement} element
 */
export function clearChildren(element) {
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

/**
 * Safely appends content to an element
 * @param {HTMLElement} parent - Parent element
 * @param {Node|string} content - Content to append (strings are escaped)
 */
export function append(parent, content) {
  if (!parent) return;

  if (typeof content === 'string') {
    parent.appendChild(document.createTextNode(content));
  } else if (content instanceof Node) {
    parent.appendChild(content);
  }
}

/**
 * Creates an icon element (Font Awesome)
 * @param {string} iconClass - Icon class (e.g., 'fa-volume-up')
 * @param {string} style - Icon style (fas, far, fab)
 * @returns {HTMLElement}
 */
export function createIcon(iconClass, style = 'fas') {
  const icon = document.createElement('i');
  icon.className = `${style} ${iconClass}`;
  return icon;
}

/**
 * Creates a button with icon and text
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement}
 */
export function createButton({ text = '', icon = '', className = '', onClick = null }) {
  const button = createElement('button', '', { className });

  if (icon) {
    button.appendChild(createIcon(icon));
    if (text) {
      button.appendChild(document.createTextNode(' '));
    }
  }

  if (text) {
    button.appendChild(document.createTextNode(text));
  }

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}

/**
 * Scrolls element into view smoothly
 * @param {HTMLElement} element
 */
export function scrollIntoView(element) {
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
