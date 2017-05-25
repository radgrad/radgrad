/** @module api/base/RadGrad */

/**
 * RadGrad is an object intended to provide simple, global state information.
 * To start, it has a field called collections that holds an array containing all of the
 * collection class instances defined in the system. (Each collection must ensure that it adds
 * itself to this array.)
 * @type { Object }
 */
export const RadGrad = { collections: [] };
