/**
 * Modal Dialog Module
 * Handles modal popups and notifications
 */

import { $, hide, show } from '../utils/dom.js';
import { escapeHtml } from '../utils/sanitize.js';

let modalContainer = null;
let modalCloseBtn = null;

/**
 * Initializes modal elements
 */
export function initModal() {
  modalContainer = $('modal-container');
  modalCloseBtn = $('modal-close-btn');

  if (modalCloseBtn) {
    modalCloseBtn.onclick = hideModal;
  }

  // Close modal on background click
  if (modalContainer) {
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        hideModal();
      }
    };
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer && !modalContainer.classList.contains('hidden')) {
      hideModal();
    }
  });
}

/**
 * Shows a modal dialog
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {boolean} isError - Whether this is an error message
 */
export function showModal(title, message, isError = false) {
  const modalTitle = $('modal-title');
  const modalMessage = $('modal-message');

  if (modalTitle) {
    modalTitle.textContent = title;
    modalTitle.className = isError
      ? 'text-xl font-bold text-red-600 dark:text-red-400'
      : 'text-xl font-bold text-verde-italiano dark:text-green-400';
  }

  if (modalMessage) {
    modalMessage.textContent = message;
  }

  show(modalContainer);
}

/**
 * Hides the modal dialog
 */
export function hideModal() {
  hide(modalContainer);
}

/**
 * Shows a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'info'
 * @param {number} duration - Duration in ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toast if any
  const existingToast = $('toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'toast-notification';

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  toast.className = `fixed bottom-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slideIn`;
  toast.innerHTML = `<span class="text-lg">${icons[type]}</span><span>${escapeHtml(message)}</span>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Shows a confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @returns {Promise<boolean>} - True if confirmed, false otherwise
 */
export function confirm(title, message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    const dialog = document.createElement('div');
    dialog.className = 'bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl';
    dialog.innerHTML = `
      <h3 class="text-lg font-bold mb-2 text-gray-800 dark:text-white">${escapeHtml(title)}</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">${escapeHtml(message)}</p>
      <div class="flex gap-2 justify-end">
        <button id="confirm-cancel" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancel</button>
        <button id="confirm-ok" class="px-4 py-2 bg-verde-italiano text-white rounded-lg hover:bg-verde-hover transition">Confirm</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.remove();
    };

    dialog.querySelector('#confirm-cancel').onclick = () => {
      cleanup();
      resolve(false);
    };

    dialog.querySelector('#confirm-ok').onclick = () => {
      cleanup();
      resolve(true);
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        cleanup();
        resolve(false);
      }
    };
  });
}
