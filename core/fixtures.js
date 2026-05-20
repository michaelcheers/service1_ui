// Auto-generated fixture bundle (classic-script build, file:// safe).
// Replaces runtime fetch() of core/fixtures/*.json. Edit the source object
// below (or regenerate from JSON) and reload — no server needed.
(function () {
  window.S1 = window.S1 || {};
  window.S1.fixtures = window.S1.fixtures || {};
  var F = window.S1.fixtures;
  F["crewProcesses"] =
  {
    "crews": [
      {
        "id": 1,
        "name": "Crew A"
      },
      {
        "id": 2,
        "name": "Crew B"
      }
    ],
    "settings": {
      "processes": [
        {
          "id": "morning-check",
          "label": "Morning check-in",
          "steps": 4
        }
      ]
    }
  };
  F["dashboard-v2"] =
  {
    "auth/me": {
      "id": 1,
      "name": "Paul",
      "role": "admin"
    },
    "jobs": [
      {
        "id": 1,
        "customer": "Acme",
        "status": "open"
      }
    ],
    "tasks": [
      {
        "id": 1,
        "title": "Inspect site",
        "done": false
      }
    ],
    "reports": [
      {
        "id": "kpi-revenue",
        "label": "Revenue",
        "value": 100000
      }
    ]
  };
  F["dashboard"] =
  {
    "auth/me": {
      "id": 1,
      "name": "Paul",
      "role": "admin"
    },
    "jobs": [
      {
        "id": 1,
        "customer": "Acme Co.",
        "status": "open",
        "date": "2026-05-20",
        "value": 12400
      },
      {
        "id": 2,
        "customer": "Wayland",
        "status": "in_progress",
        "date": "2026-05-21",
        "value": 9800
      },
      {
        "id": 3,
        "customer": "Hatfield",
        "status": "complete",
        "date": "2026-05-19",
        "value": 22100
      }
    ],
    "tasks": [
      {
        "id": 11,
        "title": "Confirm crew assignments",
        "done": false,
        "due": "2026-05-21"
      },
      {
        "id": 12,
        "title": "Approve invoice 0042",
        "done": true
      }
    ],
    "reports": [
      {
        "id": "kpi-revenue",
        "label": "Revenue",
        "value": 184200,
        "change": 0.08
      },
      {
        "id": "kpi-jobs",
        "label": "Jobs",
        "value": 42,
        "change": 0.02
      }
    ]
  };
  F["documents"] =
  {
    "documents": [
      {
        "id": 1,
        "name": "Estimate.pdf",
        "folder": "Jobs",
        "url": "#"
      },
      {
        "id": 2,
        "name": "Insurance.pdf",
        "folder": "Compliance",
        "url": "#"
      }
    ]
  };
  F["fieldCrew"] =
  {
    "crews": [
      {
        "id": 1,
        "name": "Crew A",
        "members": [
          "Alice",
          "Bob"
        ],
        "checkedIn": true
      },
      {
        "id": 2,
        "name": "Crew B",
        "members": [
          "Carla",
          "Dan"
        ],
        "checkedIn": false
      }
    ],
    "jobs": [
      {
        "id": 1,
        "customer": "Acme",
        "status": "in_progress",
        "crewId": 1
      }
    ]
  };
  F["finance"] =
  {
    "finance/invoices": [
      {
        "id": 1,
        "number": "INV-0001",
        "amount": 4200,
        "status": "paid"
      },
      {
        "id": 2,
        "number": "INV-0002",
        "amount": 7800,
        "status": "sent"
      },
      {
        "id": 3,
        "number": "INV-0003",
        "amount": 1450,
        "status": "overdue"
      }
    ],
    "finance/payments": [
      {
        "id": 1,
        "ref": "PAY-0001",
        "amount": 4200,
        "date": "2026-05-15"
      }
    ]
  };
  F["jobCalendar"] =
  {
    "jobs": [
      {
        "id": 1,
        "customer": "Acme",
        "date": "2026-05-20",
        "status": "open"
      },
      {
        "id": 2,
        "customer": "Wayland",
        "date": "2026-05-22",
        "status": "open"
      },
      {
        "id": 3,
        "customer": "Hatfield",
        "date": "2026-05-25",
        "status": "complete"
      }
    ]
  };
  F["jobDetail"] =
  {
    "jobs": [
      {
        "id": 17826,
        "customer": "Acme",
        "status": "in_progress",
        "address": "12 Main St",
        "value": 12400
      }
    ],
    "customers": [
      {
        "id": 7,
        "name": "Acme Co.",
        "email": "ops@acme.test",
        "phone": "555-0100"
      }
    ],
    "finance/invoices": [
      {
        "id": 42,
        "number": "INV-0042",
        "amount": 12400,
        "status": "sent",
        "jobId": 17826
      }
    ],
    "documents": [
      {
        "id": 1,
        "name": "Estimate.pdf",
        "folder": "Job 17826",
        "url": "#"
      }
    ]
  };
  F["preOfficeSubmissions"] =
  {
    "preoffice/submissions": [
      {
        "id": 1,
        "customer": "Acme",
        "date": "2026-05-19",
        "status": "pending"
      },
      {
        "id": 2,
        "customer": "Wayland",
        "date": "2026-05-18",
        "status": "approved"
      }
    ]
  };
  F["preOfficeTemplates"] =
  {
    "preoffice/templates": [
      {
        "id": 1,
        "name": "Roof Repair",
        "fields": 8
      },
      {
        "id": 2,
        "name": "Renovation",
        "fields": 12
      }
    ]
  };
  F["qualityControl"] =
  {
    "quality/incidents": [
      {
        "id": 1,
        "jobId": 1,
        "severity": "low",
        "description": "Minor paint scuff",
        "status": "open"
      }
    ]
  };
  F["reports"] =
  {
    "reports": [
      {
        "id": "kpi-revenue",
        "label": "Revenue",
        "value": 184200
      },
      {
        "id": "kpi-jobs",
        "label": "Jobs",
        "value": 42
      },
      {
        "id": "kpi-crews",
        "label": "Crews",
        "value": 6
      }
    ]
  };
  F["safetyDashboard"] =
  {
    "safety/incidents": [
      {
        "id": 1,
        "jobId": 1,
        "severity": "med",
        "description": "Slip near edge",
        "status": "open",
        "date": "2026-05-18"
      }
    ]
  };
  F["salesDashboard"] =
  {
    "customers": [
      {
        "id": 7,
        "name": "Acme Co."
      },
      {
        "id": 8,
        "name": "Wayland"
      }
    ],
    "jobs": [
      {
        "id": 1,
        "customer": "Acme",
        "value": 12400,
        "status": "open"
      }
    ]
  };
  F["scheduling"] =
  {
    "jobs": [
      {
        "id": 1,
        "customer": "Acme",
        "crewId": 1,
        "date": "2026-05-20",
        "status": "open"
      },
      {
        "id": 2,
        "customer": "Wayland",
        "crewId": 2,
        "date": "2026-05-20",
        "status": "open"
      }
    ],
    "crews": [
      {
        "id": 1,
        "name": "Crew A",
        "members": [
          "Alice",
          "Bob"
        ]
      },
      {
        "id": 2,
        "name": "Crew B",
        "members": [
          "Carla",
          "Dan"
        ]
      }
    ]
  };
  F["settings"] =
  {
    "settings": {
      "company": "Service1",
      "timezone": "America/New_York",
      "features": {
        "sms": true,
        "email": true
      }
    }
  };
  F["storage"] =
  {
    "documents": [
      {
        "id": 1,
        "name": "Estimate.pdf",
        "folder": "Jobs",
        "size": 124000,
        "url": "#"
      },
      {
        "id": 2,
        "name": "Photo.jpg",
        "folder": "Sites",
        "size": 480000,
        "url": "#"
      }
    ]
  };
  F["tasks"] =
  {
    "tasks": [
      {
        "id": 1,
        "title": "Confirm crew",
        "done": false,
        "assignee": "Paul",
        "due": "2026-05-21"
      },
      {
        "id": 2,
        "title": "Send pre-office",
        "done": false,
        "assignee": "Sara"
      },
      {
        "id": 3,
        "title": "Approve invoice",
        "done": true,
        "assignee": "Paul"
      }
    ]
  };
  F["tickets"] =
  {
    "tickets": [
      {
        "id": 1,
        "subject": "Truck flat tire",
        "status": "open",
        "priority": "high"
      },
      {
        "id": 2,
        "subject": "Customer callback",
        "status": "pending",
        "priority": "med"
      }
    ]
  };
  F["videosLibrary"] =
  {
    "videos": [
      {
        "id": 1,
        "title": "Onboarding intro",
        "url": "#",
        "duration": 180
      },
      {
        "id": 2,
        "title": "Safety training",
        "url": "#",
        "duration": 540
      }
    ]
  };
})();
