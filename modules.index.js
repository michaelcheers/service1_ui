// Auto-generated module index (classic-script build, file:// safe).
// Replaces runtime fetch() of modules.index.json.
(function () {
  window.S1 = window.S1 || {};
  window.S1.modulesIndex =
[
  {
    "name": "dashboard",
    "title": "Dashboard",
    "fixture": "dashboard",
    "reads": [
      "jobs",
      "tasks",
      "reports",
      "auth/me"
    ],
    "writes": []
  },
  {
    "name": "scheduling",
    "title": "Scheduling",
    "fixture": "scheduling",
    "reads": [
      "jobs",
      "crews"
    ],
    "writes": [
      "jobs"
    ]
  },
  {
    "name": "jobDetail",
    "title": "Job Detail",
    "fixture": "jobDetail",
    "reads": [
      "jobs",
      "customers",
      "finance/invoices",
      "documents"
    ],
    "writes": [
      "jobs"
    ]
  },
  {
    "name": "jobCalendar",
    "title": "Job Calendar",
    "fixture": "jobCalendar",
    "reads": [
      "jobs"
    ],
    "writes": [
      "jobs"
    ]
  },
  {
    "name": "tasks",
    "title": "Tasks",
    "fixture": "tasks",
    "reads": [
      "tasks"
    ],
    "writes": [
      "tasks"
    ]
  },
  {
    "name": "tickets",
    "title": "Tickets",
    "fixture": "tickets",
    "reads": [
      "tickets"
    ],
    "writes": [
      "tickets"
    ]
  },
  {
    "name": "documents",
    "title": "Documents",
    "fixture": "documents",
    "reads": [
      "documents"
    ],
    "writes": [
      "documents"
    ]
  },
  {
    "name": "fieldCrew",
    "title": "Field Crew",
    "fixture": "fieldCrew",
    "reads": [
      "crews",
      "jobs"
    ],
    "writes": []
  },
  {
    "name": "finance",
    "title": "Finance",
    "fixture": "finance",
    "reads": [
      "finance/invoices",
      "finance/payments"
    ],
    "writes": [
      "finance/invoices"
    ]
  },
  {
    "name": "crewProcesses",
    "title": "Crew Processes",
    "fixture": "crewProcesses",
    "reads": [
      "crews",
      "settings"
    ],
    "writes": [
      "settings"
    ]
  },
  {
    "name": "preOfficeSubmissions",
    "title": "Pre-Office Submissions",
    "fixture": "preOfficeSubmissions",
    "reads": [
      "preoffice/submissions"
    ],
    "writes": [
      "preoffice/submissions"
    ]
  },
  {
    "name": "preOfficeTemplates",
    "title": "Pre-Office Templates",
    "fixture": "preOfficeTemplates",
    "reads": [
      "preoffice/templates"
    ],
    "writes": [
      "preoffice/templates"
    ]
  },
  {
    "name": "qualityControl",
    "title": "Quality Control",
    "fixture": "qualityControl",
    "reads": [
      "quality/incidents"
    ],
    "writes": [
      "quality/incidents"
    ]
  },
  {
    "name": "reports",
    "title": "Reports",
    "fixture": "reports",
    "reads": [
      "reports"
    ],
    "writes": []
  },
  {
    "name": "safetyDashboard",
    "title": "Safety Dashboard",
    "fixture": "safetyDashboard",
    "reads": [
      "safety/incidents"
    ],
    "writes": [
      "safety/incidents"
    ]
  },
  {
    "name": "salesDashboard",
    "title": "Sales Dashboard",
    "fixture": "salesDashboard",
    "reads": [
      "customers",
      "jobs"
    ],
    "writes": []
  },
  {
    "name": "settings",
    "title": "Settings",
    "fixture": "settings",
    "reads": [
      "settings"
    ],
    "writes": [
      "settings"
    ]
  },
  {
    "name": "storage",
    "title": "Storage",
    "fixture": "storage",
    "reads": [
      "documents"
    ],
    "writes": [
      "documents"
    ]
  },
  {
    "name": "videosLibrary",
    "title": "Videos Library",
    "fixture": "videosLibrary",
    "reads": [
      "videos"
    ],
    "writes": []
  },
  { "name": "customers",      "title": "Customers",       "fixture": "customers",      "reads": ["customers"],      "writes": ["customers"] },
  { "name": "createCustomer", "title": "Create customer", "fixture": "createCustomer", "reads": ["customers"],      "writes": ["customers"] },
  { "name": "createDocument", "title": "Create document", "fixture": "createDocument", "reads": ["documents"],      "writes": ["documents"] },
  { "name": "salesFollowUps", "title": "Follow-ups",      "fixture": "salesFollowUps", "reads": ["sales/followups"], "writes": ["sales/followups"] },
  { "name": "salesMyLeads",   "title": "My leads",        "fixture": "salesMyLeads",   "reads": ["sales/leads"],    "writes": ["sales/leads"] },
  { "name": "salesNewLeads",  "title": "New leads",       "fixture": "salesNewLeads",  "reads": ["sales/leads"],    "writes": ["sales/leads"] },
  { "name": "messages",       "title": "Messages",        "fixture": "messages",       "reads": ["messages"],       "writes": ["messages"] },
  { "name": "phoneSystem",    "title": "Phone system",    "fixture": "phoneSystem",    "reads": ["phone"],          "writes": ["phone"] },
  { "name": "incomingCall",   "title": "Incoming call",   "fixture": "incomingCall",   "reads": ["phone"],          "writes": ["phone"] },
  { "name": "referrals",      "title": "Referrals",       "fixture": "referrals",      "reads": ["referrals"],      "writes": ["referrals"] }
];
})();
