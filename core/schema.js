// JSDoc typedefs for the JSON shapes the comm layer exchanges.
// These are non-runtime — they document what mock fixtures + real endpoints must produce.
// Classic-script build (file:// safe): attaches to window.S1, no ES module.

/**
 * @typedef {Object} Job
 * @property {number} id
 * @property {string} customer
 * @property {string} status     "open" | "in_progress" | "complete" | "closed"
 * @property {string} [date]     ISO date "YYYY-MM-DD"
 * @property {number} [crewId]
 * @property {string} [address]
 * @property {number} [value]
 */

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} title
 * @property {boolean} done
 * @property {string} [due]
 * @property {string} [assignee]
 * @property {number} [jobId]
 */

/**
 * @typedef {Object} Ticket
 * @property {number} id
 * @property {string} subject
 * @property {string} status   "open" | "pending" | "closed"
 * @property {string} priority "low" | "med" | "high"
 */

/**
 * @typedef {Object} Customer
 * @property {number} id
 * @property {string} name
 * @property {string} [email]
 * @property {string} [phone]
 */

/**
 * @typedef {Object} Crew
 * @property {number} id
 * @property {string} name
 * @property {string[]} members
 */

/**
 * @typedef {Object} Document
 * @property {number} id
 * @property {string} name
 * @property {string} folder
 * @property {string} url
 * @property {number} [size]
 */

/**
 * @typedef {Object} Invoice
 * @property {number} id
 * @property {string} number
 * @property {number} amount
 * @property {string} status   "draft" | "sent" | "paid" | "overdue"
 * @property {number} [jobId]
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} role
 */
(function () {
  window.S1 = window.S1 || {};
  window.S1.RESOURCES = [
    'jobs','tasks','tickets','customers','crews','documents',
    'finance/invoices','finance/payments',
    'preoffice/submissions','preoffice/templates',
    'quality/incidents','safety/incidents',
    'reports','videos','settings','auth/me'
  ];
})();
