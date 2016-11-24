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
    slug: 'philipjohnson',
    email: 'johnson@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'foo',
    uhID: '8765-4321',
  },
  {
    firstName: 'Kim',
    lastName: 'Binsted',
    slug: 'kimbinsted',
    email: 'binsted@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'foo',
    uhID: '8765-4320',
  },
  {
    firstName: 'Lipyeow',
    lastName: 'Lim',
    slug: 'lipyeowlim',
    email: 'lipyeow@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'foo',
    uhID: '8765-4319',
  },
  {
    firstName: 'Depeng',
    lastName: 'Li',
    slug: 'depengli',
    email: 'depeng@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'foo',
    uhID: '8765-4318',
  },
  {
    firstName: 'Edo',
    lastName: 'Biagioni',
    slug: 'edobiagioni',
    email: 'esb@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'foo',
    uhID: '8765-4317',
  },
  {
    firstName: 'Cam',
    lastName: 'Moore',
    slug: 'cammoore',
    email: 'cmoore@hawaii.edu',
    role: ROLE.FACULTY,
    password: 'test1',
    uhID: '8765-4316',
  },  {
    firstName: 'Gerald',
    lastName: 'Lau',
    slug: 'geraldlau',
    email: 'glau@hawaii.edu',
    role: ROLE.ADVISOR,
    password: 'foo',
    uhID: '8765-4315',
  },
];
