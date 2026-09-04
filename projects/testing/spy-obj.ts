import { vi, type Mock } from 'vitest';

/**
 * Vitest stand-ins for the Jasmine spy helpers the specs were written against.
 * Kept in one place so the specs read the same as they did under Karma/Jasmine.
 */

/** An object of type `T` whose method members are Vitest mocks. Replaces `jasmine.SpyObj<T>`. */
export type SpyObj<T> = T & {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? Mock : T[K];
};

/**
 * Replaces `jasmine.createSpyObj`. Every name in `methodNames` becomes a `vi.fn()`,
 * and any `propertyValues` are assigned as plain properties.
 */
export function createSpyObj<T = any>(
  baseName: string,
  methodNames: readonly string [] = [],
  propertyValues?: Record<string, unknown>
): SpyObj<T> {
  const spyObj: Record<string, unknown> = {};

  for (const methodName of methodNames) {
    spyObj[methodName] = vi.fn().mockName(`${baseName}.${methodName}`);
  }

  if (propertyValues) {
    Object.assign(spyObj, propertyValues);
  }

  return spyObj as SpyObj<T>;
}
