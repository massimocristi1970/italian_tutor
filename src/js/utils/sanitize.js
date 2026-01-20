/**
 * HTML Sanitization Utilities
 * Prevents XSS attacks by safely escaping user input
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') str = String(str);

  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char]);
}

/**
 * Creates a text node (completely safe from XSS)
 * @param {string} text - The text content
 * @returns {Text} - A text node
 */
export function createTextNode(text) {
  return document.createTextNode(text || '');
}

/**
 * Safely sets text content of an element
 * @param {HTMLElement} element - The element to update
 * @param {string} text - The text content
 */
export function setTextContent(element, text) {
  if (element) {
    element.textContent = text || '';
  }
}

/**
 * Creates an element with safe text content
 * @param {string} tagName - The HTML tag name
 * @param {string} textContent - The text content
 * @param {Object} attributes - Optional attributes
 * @returns {HTMLElement} - The created element
 */
export function createElement(tagName, textContent = '', attributes = {}) {
  const element = document.createElement(tagName);
  element.textContent = textContent;

  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  }

  return element;
}

/**
 * Safely creates HTML from a template with escaped values
 * @param {TemplateStringsArray} strings - Template strings
 * @param {...any} values - Values to interpolate (will be escaped)
 * @returns {string} - Safe HTML string
 */
export function safeHtml(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    const escapedValue = value !== undefined ? escapeHtml(String(value)) : '';
    return result + escapedValue + str;
  });
}

/**
 * Parses HTML string and returns elements (for trusted HTML only)
 * Use sparingly - prefer createElement for dynamic content
 * @param {string} html - The HTML string (must be from trusted source)
 * @returns {DocumentFragment} - Document fragment with parsed elements
 */
export function parseHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
}

/**
 * Sanitizes a URL to prevent javascript: protocol attacks
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL or empty string if unsafe
 */
export function sanitizeUrl(url) {
  if (!url) return '';

  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow http, https, and relative URLs
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
    // Check for relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return url;
    }
  } catch {
    // Invalid URL
  }

  return '';
}
