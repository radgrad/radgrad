/* eslint max-len: "off" */
import { ROLE } from '/imports/api/role/Role';

/** @module UserDefinitions */

/**
 * Provides an array containing User definitions.
 */
export const userDefinitions = [
  {
    firstName: 'Philip',
    lastName: 'Johnson',
    slug: 'johnson',
    email: 'johnson@hawaii.edu',
    password: 'foo',
    role: ROLE.FACULTY,
    uhID: '8765-4321',
  },
  {
    firstName: 'Kim',
    lastName: 'Binsted',
    slug: 'binsted',
    email: 'binsted@hawaii.edu',
    password: 'foo',
    role: ROLE.FACULTY,
    uhID: '8765-4320',
  },
  {
    firstName: 'Lipyeow',
    lastName: 'Lim',
    slug: 'lipyeow',
    email: 'lipyeow@hawaii.edu',
    password: 'foo',
    role: ROLE.FACULTY,
    uhID: '8765-4319',
  },
  {
    firstName: 'Depeng',
    lastName: 'Li',
    slug: 'depengli',
    email: 'depengli@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'foo',
    uhID: '8765-4318',
  },
  {
    firstName: 'Edo',
    lastName: 'Biagioni',
    slug: 'esb',
    email: 'esb@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'foo',
    uhID: '8765-4317',
  },
  {
    firstName: 'Cam',
    lastName: 'Moore',
    slug: 'cmoore',
    email: 'cmoore@hawaii.edu',
    role: ROLE.ADVISOR,
    password: 'foo',
    uhID: '1017-6869',
  },
  {
    firstName: 'Gerald',
    lastName: 'Lau',
    slug: 'glau',
    email: 'glau@hawaii.edu',
    role: ROLE.ADVISOR,
    password: 'foo',
    uhID: '8765-4315',
  },
];
