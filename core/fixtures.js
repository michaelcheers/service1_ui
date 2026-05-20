// Auto-generated fixture bundle (classic-script build, file:// safe).
// All visible module data lives here. NO hardcoded values may remain in
// modules/*/index.html. Each F[<module>] is loaded into the comm store
// via loadFixture(<module>) and is accessed strictly through
// window.S1.comm.get(<resource>).
(function () {
  window.S1 = window.S1 || {};
  window.S1.fixtures = window.S1.fixtures || {};
  var F = window.S1.fixtures;

  // ─────────────────────────────────────────── crewProcesses
  F["crewProcesses"] = {
    "crews": [
      { "id": 1, "name": "Crew A" },
      { "id": 2, "name": "Crew B" }
    ],
    "settings": {
      "processes": [
        { "id": "morning-check", "label": "Morning check-in", "steps": 4, "stepsList": [
            { "n": 1, "label": "Vehicle check",   "owner": "Driver" },
            { "n": 2, "label": "Tools inventory", "owner": "Lead"   },
            { "n": 3, "label": "PPE check",       "owner": "All"    },
            { "n": 4, "label": "Safety briefing", "owner": "Lead"   }
          ]
        },
        { "id": "shift-handover", "label": "Shift handover", "steps": 3, "stepsList": [
            { "n": 1, "label": "Job status sync", "owner": "Lead" },
            { "n": 2, "label": "Vehicle return",  "owner": "Driver" },
            { "n": 3, "label": "Incident report", "owner": "Lead" }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────── dashboard
  F["dashboard"] = {
    "auth/me": { "id": 1, "name": "Paul", "role": "admin" },
    "jobs": [
      { "id": 1, "customer": "Acme Co.",  "status": "open",        "date": "2026-05-20", "value": 12400 },
      { "id": 2, "customer": "Wayland",   "status": "in_progress", "date": "2026-05-21", "value": 9800  },
      { "id": 3, "customer": "Hatfield",  "status": "complete",    "date": "2026-05-19", "value": 22100 }
    ],
    "tasks": [
      { "id": 11, "title": "Confirm crew assignments", "done": false, "due": "2026-05-21" },
      { "id": 12, "title": "Approve invoice 0042",     "done": true  }
    ],
    "reports": [
      { "id": "kpi-revenue", "label": "Revenue", "value": 184200, "change": 0.08 },
      { "id": "kpi-jobs",    "label": "Jobs",    "value": 42,     "change": 0.02 }
    ],
    "dashboard/kpis": [
      { "id":"gross-rev", "label":"Gross revenue",      "value": 128400.50, "unit":"$", "deltaPct": 14.2, "dir":"up"   },
      { "id":"deals",     "label":"Deals booked",       "value": 48,                    "deltaPct":  9.1, "dir":"up"   },
      { "id":"avg-deal",  "label":"Average deal size",  "value": 2675,      "unit":"$", "deltaPct":  6.2, "dir":"up"   },
      { "id":"close-rt",  "label":"Close rate",         "value": 43,        "unit":"%", "deltaPct": -2.1, "dir":"down" }
    ],
    "dashboard/chart": {
      "label": "Net revenue · Last 12 months",
      "total": 1420800, "prevYear": 1180000, "forecastEoy": 1580000,
      "months":   ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
      "thisYear": [62,71,78,84,92,103,118,130,142,150,159,168],
      "prev":     [60,62,66,70,74,78,82,88,92,96,100,104]
    },
    "dashboard/performers": [
      { "id": 1, "name": "John Sales",     "init": "JS", "deals": 14, "amount": 42640, "rate": 0.92, "color": "#004D40" },
      { "id": 2, "name": "Jane Finance",   "init": "JF", "deals": 11, "amount": 31210, "rate": 0.78, "color": "#3F6FA6" },
      { "id": 3, "name": "Andrew Haylton", "init": "AH", "deals":  9, "amount": 24810, "rate": 0.71, "color": "#0E7C8F" },
      { "id": 4, "name": "Paul Rai",       "init": "PR", "deals":  8, "amount": 18400, "rate": 0.64, "color": "#7B4B94" }
    ],
    "dashboard/attention": [
      { "id":"stale",   "title":"Stale opportunities",   "sub":"No contact in 7+ days",   "count": 5, "tone":"warn" },
      { "id":"tickets", "title":"Open service tickets",  "sub":"Awaiting customer reply", "count": 2, "tone":"bad"  },
      { "id":"plans",   "title":"Accepted Growth Plans", "sub":"Not yet booked or paid",  "count": 3, "tone":""     },
      { "id":"unleads", "title":"Unassigned new leads",  "sub":"In queue under 1h",       "count": 4, "tone":""     }
    ],
    "dashboard/realtime": {
      "online": 7, "total": 12, "onCalls": 5,
      "callsLastHour": 38, "avgDuration": "3m 42s",
      "inQueue": 3, "longestWait": "42s",
      "queues": [
        { "name": "Sales line",   "n": 2 },
        { "name": "Support line", "n": 1 }
      ],
      "today": { "totalCalls": 186, "connectedRate": 0.62, "avgWait": "18s", "abandoned": 2 },
      "dealsBookedToday": { "count": 2, "amount": 5403, "lastBookedAgo": "12m" },
      "agents": [
        { "id":1, "name":"John Sales",     "init":"JS", "color":"#004D40", "state":"on_call", "since":"2m 14s", "calls":12, "connected":8, "rate":0.67, "talk":"34m", "deals":2 },
        { "id":2, "name":"Jane Finance",   "init":"JF", "color":"#3F6FA6", "state":"on_call", "since":"38s",    "calls": 9, "connected":6, "rate":0.67, "talk":"22m", "deals":0 },
        { "id":3, "name":"Andrew Haylton", "init":"AH", "color":"#0E7C8F", "state":"online",  "since":null,     "calls": 7, "connected":5, "rate":0.71, "talk":"18m", "deals":0 },
        { "id":4, "name":"Paul Rai",       "init":"PR", "color":"#7B4B94", "state":"on_call", "since":"5m 02s", "calls": 6, "connected":3, "rate":0.50, "talk":"14m", "deals":0 },
        { "id":5, "name":"Donald James",   "init":"DJ", "color":"#D4960A", "state":"away",    "since":null,     "calls": 4, "connected":2, "rate":0.50, "talk":"9m",  "deals":0 },
        { "id":6, "name":"Fred Waite",     "init":"FW", "color":"#8792A2", "state":"offline", "since":null,     "calls": 0, "connected":0, "rate":0,    "talk":"—",   "deals":0 }
      ]
    }
  };

  // ─────────────────────────────────────────── dashboard-v2 (mirrors dashboard)
  F["dashboard-v2"] = {
    "auth/me":              F["dashboard"]["auth/me"],
    "jobs":                 F["dashboard"]["jobs"],
    "tasks":                F["dashboard"]["tasks"],
    "reports":              F["dashboard"]["reports"],
    "dashboard/kpis":       F["dashboard"]["dashboard/kpis"],
    "dashboard/chart":      F["dashboard"]["dashboard/chart"],
    "dashboard/performers": F["dashboard"]["dashboard/performers"],
    "dashboard/attention":  F["dashboard"]["dashboard/attention"],
    "dashboard/realtime":   F["dashboard"]["dashboard/realtime"]
  };

  // ─────────────────────────────────────────── documents
  F["documents"] = {
    "documents": [
      { "id": 1, "name": "Estimate.pdf",  "folder": "Jobs",       "url": "#", "size": 124000, "modified": "2026-05-15", "owner": "Paul" },
      { "id": 2, "name": "Insurance.pdf", "folder": "Compliance", "url": "#", "size":  98000, "modified": "2026-04-30", "owner": "Sara" },
      { "id": 3, "name": "Permit.pdf",    "folder": "Jobs",       "url": "#", "size":  44000, "modified": "2026-05-10", "owner": "Paul" }
    ]
  };

  // ─────────────────────────────────────────── fieldCrew
  F["fieldCrew"] = {
    "crews": [
      { "id": 1, "name": "Crew A", "members": ["Alice","Bob"],  "checkedIn": true,  "currentJobId": 1, "location": "Site A", "lastPing": "2m ago" },
      { "id": 2, "name": "Crew B", "members": ["Carla","Dan"], "checkedIn": false, "currentJobId": null, "location": "—",    "lastPing": "1h ago" }
    ],
    "jobs": [
      { "id": 1, "customer": "Acme",    "status": "in_progress", "crewId": 1 },
      { "id": 2, "customer": "Wayland", "status": "open",        "crewId": 2 }
    ]
  };

  // ─────────────────────────────────────────── finance
  F["finance"] = {
    "finance/invoices": [
      { "id": 1, "number": "INV-0001", "amount": 4200, "status": "paid",    "customer": "Acme Co." },
      { "id": 2, "number": "INV-0002", "amount": 7800, "status": "sent",    "customer": "Wayland" },
      { "id": 3, "number": "INV-0003", "amount": 1450, "status": "overdue", "customer": "Hatfield" }
    ],
    "finance/payments": [
      { "id": 1, "ref": "PAY-0001", "amount": 4200, "date": "2026-05-15", "customer": "Acme Co." }
    ],
    "finance/pnl": [
      { "month": "Jan", "revenue":  92000, "expenses": 71000, "net": 21000 },
      { "month": "Feb", "revenue":  98500, "expenses": 73200, "net": 25300 },
      { "month": "Mar", "revenue": 104300, "expenses": 75800, "net": 28500 },
      { "month": "Apr", "revenue": 118000, "expenses": 78900, "net": 39100 },
      { "month": "May", "revenue": 128400, "expenses": 82200, "net": 46200 }
    ],
    "finance/receivables": [
      { "customer": "Acme Co.", "amount": 12400, "aging": "0-30"  },
      { "customer": "Wayland",  "amount":  7800, "aging": "31-60" },
      { "customer": "Hatfield", "amount":  1450, "aging": "60+"   }
    ],
    "finance/payables": [
      { "vendor": "FuelMart",  "amount": 3200, "due": "2026-05-30" },
      { "vendor": "PaintsRUs", "amount": 1840, "due": "2026-06-05" }
    ]
  };

  // ─────────────────────────────────────────── jobCalendar
  F["jobCalendar"] = {
    "jobs": [
      { "id": 1, "title": "Acme roof",      "customer": "Acme",    "date": "2026-05-20", "startHour":  8, "endHour": 12, "crewId": 1, "color": "#004D40", "status": "open" },
      { "id": 2, "title": "Wayland reno",   "customer": "Wayland", "date": "2026-05-22", "startHour":  9, "endHour": 17, "crewId": 2, "color": "#3F6FA6", "status": "open" },
      { "id": 3, "title": "Hatfield paint", "customer": "Hatfield","date": "2026-05-25", "startHour": 10, "endHour": 15, "crewId": 1, "color": "#0E7C8F", "status": "complete" }
    ]
  };

  // ─────────────────────────────────────────── jobDetail
  F["jobDetail"] = {
    "jobs": [
      { "id": 17826, "number": "JOB-17826", "customer": "Acme Co.", "status": "in_progress",
        "address": "12 Main St, Toronto, ON", "value": 12400,
        "contact": { "name": "Alice Acme", "email": "ops@acme.test", "phone": "555-0100" },
        "timeline": [
          { "ts": "2026-05-19 09:14", "label": "Job created",  "by": "Paul" },
          { "ts": "2026-05-19 10:02", "label": "Estimate sent", "by": "Paul" },
          { "ts": "2026-05-20 08:30", "label": "Crew dispatched", "by": "System" }
        ]
      }
    ],
    "customers": [
      { "id": 7, "name": "Acme Co.", "email": "ops@acme.test", "phone": "555-0100" }
    ],
    "finance/invoices": [
      { "id": 42, "number": "INV-0042", "amount": 12400, "status": "sent", "jobId": 17826 }
    ],
    "documents": [
      { "id": 1, "name": "Estimate.pdf", "folder": "Job 17826", "url": "#" },
      { "id": 2, "name": "Photos.zip",   "folder": "Job 17826", "url": "#" }
    ]
  };

  // ─────────────────────────────────────────── preOfficeSubmissions
  F["preOfficeSubmissions"] = {
    "preoffice/submissions": [
      { "id": 1, "customer": "Acme",    "date": "2026-05-19", "status": "pending",  "assignee": "Paul" },
      { "id": 2, "customer": "Wayland", "date": "2026-05-18", "status": "approved", "assignee": "Sara" }
    ]
  };

  // ─────────────────────────────────────────── preOfficeTemplates
  F["preOfficeTemplates"] = {
    "preoffice/templates": [
      { "id": 1, "name": "Roof Repair", "fields":  8, "updated": "2026-05-10", "createdBy": "Paul" },
      { "id": 2, "name": "Renovation",  "fields": 12, "updated": "2026-04-22", "createdBy": "Sara" }
    ]
  };

  // ─────────────────────────────────────────── qualityControl
  F["qualityControl"] = {
    "quality/incidents": [
      { "id": 1, "jobId": 1, "severity": "low",  "description": "Minor paint scuff",      "status": "open",     "reportedBy": "Bob",  "date": "2026-05-18" },
      { "id": 2, "jobId": 2, "severity": "med",  "description": "Trim not flush",         "status": "closed",   "reportedBy": "Alice","date": "2026-05-17" }
    ]
  };

  // ─────────────────────────────────────────── reports
  F["reports"] = {
    "reports": [
      { "id": "kpi-revenue", "label": "Revenue", "value": 184200, "unit": "$",  "trend": [62,71,78,84,92,103,118] },
      { "id": "kpi-jobs",    "label": "Jobs",    "value": 42,                    "trend": [3,5,6,7,8,7,6] },
      { "id": "kpi-crews",   "label": "Crews",   "value": 6,                     "trend": [4,4,5,5,6,6,6] }
    ]
  };

  // ─────────────────────────────────────────── safetyDashboard
  F["safetyDashboard"] = {
    "safety/incidents": [
      { "id": 1, "jobId": 1, "severity": "med", "description": "Slip near edge", "status": "open",   "date": "2026-05-18" },
      { "id": 2, "jobId": 3, "severity": "low", "description": "Tool drop",      "status": "closed", "date": "2026-05-12" }
    ]
  };

  // ─────────────────────────────────────────── salesDashboard
  F["salesDashboard"] = {
    "customers": [
      { "id": 7, "name": "Acme Co.", "email": "ops@acme.test",   "phone": "555-0100" },
      { "id": 8, "name": "Wayland",  "email": "info@wayland.test","phone": "555-0102" }
    ],
    "jobs": [
      { "id": 1, "customer": "Acme",    "value": 12400, "status": "open" },
      { "id": 2, "customer": "Wayland", "value":  9800, "status": "in_progress" }
    ],
    "sales/pipeline": [
      { "stage": "New",       "deals": 12, "value": 48000 },
      { "stage": "Qualified", "deals":  8, "value": 96000 },
      { "stage": "Proposal",  "deals":  4, "value": 72000 },
      { "stage": "Won",       "deals":  3, "value": 54000 }
    ],
    "sales/deals": [
      { "id": 1, "customer": "Acme Co.", "stage": "Proposal",  "value": 24000, "owner": "John Sales",   "updated": "2026-05-19" },
      { "id": 2, "customer": "Wayland",  "stage": "Qualified", "value": 18000, "owner": "Jane Finance", "updated": "2026-05-18" }
    ]
  };

  // ─────────────────────────────────────────── scheduling
  F["scheduling"] = {
    "jobs": [
      { "id": 1, "title": "Acme roof",    "customer": "Acme",    "crewId": 1, "date": "2026-05-20", "startHour":  8, "endHour": 12, "status": "open" },
      { "id": 2, "title": "Wayland reno", "customer": "Wayland", "crewId": 2, "date": "2026-05-20", "startHour":  9, "endHour": 17, "status": "open" },
      { "id": 3, "title": "Hatfield paint","customer": "Hatfield","crewId": 1, "date": "2026-05-21", "startHour": 10, "endHour": 15, "status": "open" }
    ],
    "crews": [
      { "id": 1, "name": "Crew A", "members": ["Alice","Bob"]  },
      { "id": 2, "name": "Crew B", "members": ["Carla","Dan"] }
    ]
  };

  // ─────────────────────────────────────────── settings
  F["settings"] = {
    "settings": {
      "company": "Service1",
      "timezone": "America/Toronto",
      "features": { "sms": true, "email": true }
    },
    "auth/me": {
      "id": 1, "name": "Admin User", "email": "admin@service1.com",
      "phone": "(555) 200-0143", "role": "Admin", "avatarInitial": "A"
    },
    "settings/roles":     [ "Admin","Manager","Sales","Driver" ],
    "settings/timezones": [ "America/Toronto (EDT)","America/Vancouver","America/New_York","UTC" ],
    "settings/languages": [ "English (US)","Français" ],
    "settings/theme":     { "value": "system" },
    "settings/notifications": [
      { "id":"leads",    "label":"New leads",     "help":"Notify whenever a new lead is created.", "email": true,  "sms": true,  "push": false },
      { "id":"summary",  "label":"Daily summary", "help":"",                                       "email": true,  "sms": false, "push": false },
      { "id":"mentions", "label":"Mentions",      "help":"",                                       "email": true,  "sms": true,  "push": true  }
    ],
    "settings/nav": [
      { "group":"Account",      "items":[ {"key":"profile","label":"Profile","active":true},{"key":"security","label":"Password & security"},{"key":"notif","label":"Notifications"} ] },
      { "group":"Workspace",    "items":[ {"key":"company","label":"Company"},{"key":"team","label":"Team & roles"},{"key":"locs","label":"Locations"} ] },
      { "group":"Operations",   "items":[ {"key":"vehicles","label":"Vehicles"},{"key":"jobtypes","label":"Job types & pricing"},{"key":"templates","label":"Templates"} ] },
      { "group":"Integrations", "items":[ {"key":"stripe","label":"Stripe"},{"key":"twilio","label":"Twilio"},{"key":"mailgun","label":"Mailgun"},{"key":"qb","label":"QuickBooks"},{"key":"webhooks","label":"Webhooks"} ] },
      { "group":"Billing",      "items":[ {"key":"sub","label":"Subscription"},{"key":"inv","label":"Invoices"} ] }
    ]
  };

  // ─────────────────────────────────────────── storage
  F["storage"] = {
    "documents": [
      { "id": 1, "name": "Estimate.pdf", "folder": "Jobs",  "size": 124000, "modified": "2026-05-15", "type": "pdf", "url": "#" },
      { "id": 2, "name": "Photo.jpg",   "folder": "Sites", "size": 480000, "modified": "2026-05-10", "type": "img", "url": "#" },
      { "id": 3, "name": "Plan.dwg",    "folder": "Plans", "size": 750000, "modified": "2026-04-22", "type": "dwg", "url": "#" }
    ]
  };

  // ─────────────────────────────────────────── tasks
  F["tasks"] = {
    "tasks": [
      { "id": 1, "title": "Confirm crew",     "done": false, "assignee": "Paul", "due": "2026-05-21", "status": "todo" },
      { "id": 2, "title": "Send pre-office",  "done": false, "assignee": "Sara", "due": "2026-05-22", "status": "in_progress" },
      { "id": 3, "title": "Approve invoice",  "done": true,  "assignee": "Paul", "due": "2026-05-19", "status": "done" }
    ]
  };

  // ─────────────────────────────────────────── tickets
  F["tickets"] = {
    "tickets": [
      { "id": 1, "subject": "Truck flat tire",   "status": "open",    "priority": "high", "assignee": "Paul", "updated": "2026-05-19" },
      { "id": 2, "subject": "Customer callback", "status": "pending", "priority": "med",  "assignee": "Sara", "updated": "2026-05-18" }
    ]
  };

  // ─────────────────────────────────────────── videosLibrary
  F["videosLibrary"] = {
    "videos": [
      { "id": 1, "title": "Onboarding intro", "url": "#", "duration": 180, "thumb": "#", "category": "Onboarding", "uploaded": "2026-04-01" },
      { "id": 2, "title": "Safety training",  "url": "#", "duration": 540, "thumb": "#", "category": "Safety",     "uploaded": "2026-03-15" }
    ]
  };
})();
