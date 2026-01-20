/**
 * DOM Utilities Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { $, $$, $$$, on, show, hide, toggle, clearChildren, debounce, throttle } from '../utils/dom.js';

describe('$ (getElementById)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-element">Test</div>';
  });

  it('should find element by ID', () => {
    const element = $('test-element');
    expect(element).not.toBeNull();
    expect(element.textContent).toBe('Test');
  });

  it('should return null for non-existent ID', () => {
    const element = $('non-existent');
    expect(element).toBeNull();
  });
});

describe('$$ (querySelector)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="test-class"><span>Inner</span></div>';
  });

  it('should find element by selector', () => {
    const element = $$('.test-class');
    expect(element).not.toBeNull();
  });

  it('should find nested elements', () => {
    const element = $$('.test-class span');
    expect(element.textContent).toBe('Inner');
  });
});

describe('$$$ (querySelectorAll)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="item">1</div><div class="item">2</div><div class="item">3</div>';
  });

  it('should find all matching elements', () => {
    const elements = $$$('.item');
    expect(elements.length).toBe(3);
  });
});

describe('on (addEventListener)', () => {
  it('should add event listener', () => {
    const button = document.createElement('button');
    const handler = vi.fn();

    on(button, 'click', handler);
    button.click();

    expect(handler).toHaveBeenCalled();
  });

  it('should return cleanup function', () => {
    const button = document.createElement('button');
    const handler = vi.fn();

    const cleanup = on(button, 'click', handler);
    cleanup();
    button.click();

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle null element', () => {
    const cleanup = on(null, 'click', vi.fn());
    expect(cleanup).toBeInstanceOf(Function);
  });
});

describe('show', () => {
  it('should remove hidden class', () => {
    const div = document.createElement('div');
    div.classList.add('hidden');

    show(div);

    expect(div.classList.contains('hidden')).toBe(false);
  });

  it('should handle null element', () => {
    expect(() => show(null)).not.toThrow();
  });
});

describe('hide', () => {
  it('should add hidden class', () => {
    const div = document.createElement('div');

    hide(div);

    expect(div.classList.contains('hidden')).toBe(true);
  });

  it('should handle null element', () => {
    expect(() => hide(null)).not.toThrow();
  });
});

describe('toggle', () => {
  it('should toggle hidden class', () => {
    const div = document.createElement('div');

    toggle(div);
    expect(div.classList.contains('hidden')).toBe(true);

    toggle(div);
    expect(div.classList.contains('hidden')).toBe(false);
  });

  it('should force visibility state', () => {
    const div = document.createElement('div');

    toggle(div, true);
    expect(div.classList.contains('hidden')).toBe(false);

    toggle(div, false);
    expect(div.classList.contains('hidden')).toBe(true);
  });
});

describe('clearChildren', () => {
  it('should remove all children', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<span>1</span><span>2</span><span>3</span>';

    clearChildren(parent);

    expect(parent.children.length).toBe(0);
  });

  it('should handle empty element', () => {
    const parent = document.createElement('div');
    expect(() => clearChildren(parent)).not.toThrow();
  });

  it('should handle null element', () => {
    expect(() => clearChildren(null)).not.toThrow();
  });
});

describe('debounce', () => {
  it('should debounce function calls', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('throttle', () => {
  it('should throttle function calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled();

    expect(fn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
