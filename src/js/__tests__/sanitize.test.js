/**
 * Sanitize Utilities Tests
 */

import { describe, it, expect } from 'vitest';

import {
  escapeHtml,
  createTextNode,
  setTextContent,
  createElement,
  safeHtml,
  sanitizeUrl,
} from '../utils/sanitize.js';

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    );
  });

  it('should escape ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('should escape quotes', () => {
    expect(escapeHtml('"hello" \'world\'')).toBe('&quot;hello&quot; &#x27;world&#x27;');
  });

  it('should handle null and undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('should convert non-strings to strings', () => {
    expect(escapeHtml(123)).toBe('123');
    expect(escapeHtml(true)).toBe('true');
  });

  it('should return empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('createTextNode', () => {
  it('should create a text node', () => {
    const node = createTextNode('Hello World');
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.textContent).toBe('Hello World');
  });

  it('should handle empty string', () => {
    const node = createTextNode('');
    expect(node.textContent).toBe('');
  });

  it('should handle null', () => {
    const node = createTextNode(null);
    expect(node.textContent).toBe('');
  });
});

describe('setTextContent', () => {
  it('should set text content of an element', () => {
    const div = document.createElement('div');
    setTextContent(div, 'Hello World');
    expect(div.textContent).toBe('Hello World');
  });

  it('should handle null element gracefully', () => {
    expect(() => setTextContent(null, 'test')).not.toThrow();
  });

  it('should handle null text', () => {
    const div = document.createElement('div');
    setTextContent(div, null);
    expect(div.textContent).toBe('');
  });
});

describe('createElement', () => {
  it('should create an element with text content', () => {
    const p = createElement('p', 'Hello World');
    expect(p.tagName).toBe('P');
    expect(p.textContent).toBe('Hello World');
  });

  it('should set className attribute', () => {
    const div = createElement('div', '', { className: 'test-class' });
    expect(div.className).toBe('test-class');
  });

  it('should set regular attributes', () => {
    const input = createElement('input', '', { type: 'text', placeholder: 'Enter text' });
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('placeholder')).toBe('Enter text');
  });

  it('should set data attributes', () => {
    const div = createElement('div', '', { dataset: { id: '123', name: 'test' } });
    expect(div.dataset.id).toBe('123');
    expect(div.dataset.name).toBe('test');
  });
});

describe('safeHtml', () => {
  it('should escape interpolated values', () => {
    const userInput = '<script>alert("xss")</script>';
    const result = safeHtml`<div>${userInput}</div>`;
    expect(result).toContain('&lt;script&gt;');
    expect(result).not.toContain('<script>');
  });

  it('should handle multiple values', () => {
    const name = '<b>John</b>';
    const age = 25;
    const result = safeHtml`Name: ${name}, Age: ${age}`;
    expect(result).toBe('Name: &lt;b&gt;John&lt;&#x2F;b&gt;, Age: 25');
  });
});

describe('sanitizeUrl', () => {
  it('should allow http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('should allow https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should allow relative URLs', () => {
    expect(sanitizeUrl('/path/to/page')).toBe('/path/to/page');
    expect(sanitizeUrl('./page')).toBe('./page');
    expect(sanitizeUrl('../page')).toBe('../page');
  });

  it('should reject javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
  });

  it('should reject data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBe('');
  });

  it('should handle empty strings', () => {
    expect(sanitizeUrl('')).toBe('');
    expect(sanitizeUrl(null)).toBe('');
    expect(sanitizeUrl(undefined)).toBe('');
  });
});
