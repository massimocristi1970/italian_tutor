/**
 * Config Module Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { isLocalDevelopment, DEFAULTS, API, LEVEL_DESCRIPTIONS } from '../config.js';

describe('isLocalDevelopment', () => {
  beforeEach(() => {
    // Reset location mock
    delete window.location;
  });

  it('should return true for localhost', () => {
    window.location = { hostname: 'localhost' };
    expect(isLocalDevelopment()).toBe(true);
  });

  it('should return true for 127.0.0.1', () => {
    window.location = { hostname: '127.0.0.1' };
    expect(isLocalDevelopment()).toBe(true);
  });

  it('should return false for production domain', () => {
    window.location = { hostname: 'italiantutorapp.web.app' };
    expect(isLocalDevelopment()).toBe(false);
  });
});

describe('DEFAULTS', () => {
  it('should have expected default values', () => {
    expect(DEFAULTS.LANGUAGE).toBe('Italian');
    expect(DEFAULTS.LEVEL).toBe('level1');
    expect(DEFAULTS.MAX_STATIC_PHRASES).toBe(100);
    expect(DEFAULTS.GEMINI_MODEL).toBe('gemini-2.5-flash');
    expect(DEFAULTS.MAX_RETRIES).toBe(5);
    expect(DEFAULTS.INITIAL_RETRY_DELAY).toBe(1000);
  });
});

describe('API', () => {
  it('should have correct API endpoints', () => {
    expect(API.GEMINI_PROXY).toBe('/api/gemini-proxy');
    expect(API.GET_CONFIG).toBe('/api/get-config');
  });
});

describe('LEVEL_DESCRIPTIONS', () => {
  it('should have descriptions for all levels', () => {
    expect(LEVEL_DESCRIPTIONS.level1).toContain('beginner');
    expect(LEVEL_DESCRIPTIONS.level2).toContain('intermediate');
    expect(LEVEL_DESCRIPTIONS.level3).toContain('advanced');
  });

  it('should mention appropriate tenses for each level', () => {
    expect(LEVEL_DESCRIPTIONS.level1).toContain('present tense');
    expect(LEVEL_DESCRIPTIONS.level2).toContain('past/future');
    expect(LEVEL_DESCRIPTIONS.level3).toContain('subjunctive');
  });
});
