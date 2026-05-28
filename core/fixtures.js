// Auto-generated fixture bundle (classic-script build, file:// safe).
// Replaces runtime fetch() of core/fixtures/*.json. Edit the source object
// below (or regenerate from JSON) and reload — no server needed.
(function () {
  window.S1 = window.S1 || {};
  window.S1.fixtures = window.S1.fixtures || {};
  var F = window.S1.fixtures;
  F["crewProcesses"] = {
  processOwnerOptions: [{"value": "Alex Morgan (Admin)", "label": "Alex Morgan (Admin)"}, {"value": "Jamie Liu (Ops)", "label": "Jamie Liu (Ops)"}, {"value": "Priya Shah", "label": "Priya Shah"}, {"value": "Lin Hayes", "label": "Lin Hayes"}],
  editableByOptions: [{"value": "Admins &amp; Ops managers", "label": "Admins &amp; Ops managers"}, {"value": "Admins only", "label": "Admins only"}, {"value": "Process owner", "label": "Process owner"}],
  visibleToOptions: [{"value": "Crew leads only", "label": "Crew leads only"}, {"value": "Specific people\u2026", "label": "Specific people\u2026"}],
  branchOptions: [{"value": "Toronto HQ", "label": "Toronto HQ"}, {"value": "Mississauga", "label": "Mississauga"}, {"value": "Hamilton", "label": "Hamilton"}],
  appliesToJobTypeOptions: [{"value": "Any move type", "label": "Any move type"}, {"value": "Local residential", "label": "Local residential"}, {"value": "Long distance", "label": "Long distance"}, {"value": "Commercial \u00b7 office", "label": "Commercial \u00b7 office"}, {"value": "Box delivery", "label": "Box delivery"}, {"value": "Packing only", "label": "Packing only"}],
  optionsOptions: [{"value": "required", "label": "Required"}, {"value": "optional", "label": "Optional"}, {"value": "auto", "label": "Auto"}],
  summary: "Crew Processes",
  subtitle: "Define step-by-step processes for crew members to follow on jobs",
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "header": { "activeCount": 8, "templateCount": 12 },
    "tabs": { "active": 8, "templates": 12 },
    "stats": {
      "active":     { "value": 8,  "delta": "5 on schedule, 2 at risk" },
      "avgTime":    { "value": 42, "unit": "m", "delta": "target 45m" },
      "compliance": { "value": 94, "unit": "%", "delta": "across all teams" },
      "photos":     { "value": 128, "delta": "this week" }
    },
    "active": [
      { "process": "Pre-load inspection", "processMeta": "v3.2 · standard local move", "team": "Truck 1", "teamPill": "terra", "job": "17826-1 · Johnson", "step": "5 / 8", "stepNote": "Photo: truck interior", "progressPct": 62, "progressColor": "terra", "status": "On track", "statusPill": "ok" },
      { "process": "Origin walkthrough", "processMeta": "v2.1 · standard", "team": "Van 1", "teamPill": "info", "job": "17870-1 · Patel", "step": "3 / 6", "stepNote": "Awaiting customer signoff", "progressPct": 50, "progressColor": "info", "status": "Waiting", "statusPill": "warn" },
      { "process": "Commercial inventory log", "processMeta": "v1.4 · office", "team": "Truck 3", "teamPill": "teal", "job": "17821-1 · Northside", "step": "8 / 12", "stepNote": "Photo: server rack labels", "progressPct": 67, "progressColor": "teal", "status": "On track", "statusPill": "ok" },
      { "process": "Box delivery confirmation", "processMeta": "v2.0", "team": "Van 1", "teamPill": "info", "job": "17870-1 · Patel", "step": "2 / 4", "stepNote": "", "progressPct": 50, "progressColor": "info", "status": "On track", "statusPill": "ok" }
    ],
    "templates": [
      { "version": "v1.1", "name": "Pre-load inspection",        "meta": "4 steps · ~15 min" },
      { "version": "v2.2", "name": "Origin walkthrough",         "meta": "5 steps · ~20 min" },
      { "version": "v3.1", "name": "Destination walkthrough",    "meta": "6 steps · ~25 min" },
      { "version": "v1.2", "name": "Commercial inventory",       "meta": "7 steps · ~30 min" },
      { "version": "v2.1", "name": "Box delivery confirmation",  "meta": "8 steps · ~35 min" },
      { "version": "v3.2", "name": "Damage report",              "meta": "9 steps · ~40 min" },
      { "version": "v1.1", "name": "End-of-day truck reset",     "meta": "10 steps · ~45 min" },
      { "version": "v2.2", "name": "Customer signoff & photos",  "meta": "11 steps · ~50 min" }
    ]
  };
  F["dashboard-v2"] = {
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, header: {
      greeting: "Good morning, Admin",
      dateLabel: "Saturday, May 16",
      rangeLabel: "May 2026",
      subtitle: "Showing data for May 2026 · All locations"
    },
    kpis: {
      dealsBooked: { value: "48", sub: "/ $128.4k", trend: "↑ 14%", trendLabel: "vs. last month" },
      discoveryCalls: { value: "7", sub: "3 confirmed · 4 to go", trend: "↑ 2", trendLabel: "vs. yesterday" },
      avgDeal: { value: "$2,675", sub: "across 48 deals", trend: "↑ 6.2%", trendLabel: "vs. last month" },
      openOpps: { value: "23", sub: "/ $61.2k", note: "5 stale · need follow-up", trend: "↓ 4", trendLabel: "vs. last week" }
    },
    revenue: {
      total12m: "$1.42M",
      thisMonth: "$128.4k",
      forecast: "$1.58M",
      vsTarget: "+8.4%",
      bars: [
        { label: "Jun · $76k",  height: "48%", barClass: "" },
        { label: "Jul · $88k",  height: "55%", barClass: "" },
        { label: "Aug · $98k",  height: "62%", barClass: "" },
        { label: "Sep · $114k", height: "71%", barClass: "" },
        { label: "Oct · $93k",  height: "58%", barClass: "" },
        { label: "Nov · $104k", height: "65%", barClass: "" },
        { label: "Dec · $68k",  height: "42%", barClass: "" },
        { label: "Jan · $80k",  height: "50%", barClass: "" },
        { label: "Feb · $96k",  height: "60%", barClass: "" },
        { label: "Mar · $109k", height: "68%", barClass: "" },
        { label: "Apr · $118k", height: "74%", barClass: "" },
        { label: "May · $128k", height: "80%", barClass: "cur" }
      ]
    },
    leaders: [
      { rank: 1, color: "var(--terra)", initials: "JS", name: "John Sales",     meta: "14 deals · 92% close rate", amount: "$42.6k" },
      { rank: 2, color: "var(--info)",  initials: "JF", name: "Jane Finance",   meta: "11 deals · 78% close rate", amount: "$31.2k" },
      { rank: 3, color: "var(--teal)",  initials: "AH", name: "Andrew Haylton", meta: "9 deals · 71% close rate",  amount: "$24.8k" },
      { rank: 4, color: "var(--plum)",  initials: "PR", name: "Paul Rai",       meta: "8 deals · 64% close rate",  amount: "$18.4k" },
      { rank: 5, color: "var(--gold)",  initials: "DJ", name: "Donald James",   meta: "6 deals · 58% close rate",  amount: "$11.4k" }
    ],
    salesActivity: [
      { stage: "Leads",             today: "4",  week: "27", month: "112", delta: "↑ 18%",  deltaDir: "up"   },
      { stage: "Growth Plans sent", today: "3",  week: "19", month: "78",  delta: "↑ 9%",   deltaDir: "up"   },
      { stage: "Deals booked",      today: "2",  week: "11", month: "48",  delta: "↑ 14%",  deltaDir: "up"   },
      { stage: "Cancellations",     today: "0",  week: "1",  month: "4",   delta: "↓ 33%",  deltaDir: "down" },
      { stage: "Close rate",        today: "50%", week: "41%", month: "43%", delta: "↑ 3 pts", deltaDir: "up" }
    ],
    openItems: [
      { title: "Stale opportunities",              subtitle: "No contact in 7+ days",     count: "5" },
      { title: "Accepted Growth Plans not closed", subtitle: "Need deposit or schedule", count: "3" },
      { title: "Customer service tickets",         subtitle: "2 awaiting response",      count: "2" },
      { title: "Unassigned new leads",             subtitle: "Sat in queue < 1h",        count: "4" }
    ],
    referrals: [
      { name: "Customer referral", color: "terra", width: "82%", amount: "$48.6k", deals: "22" },
      { name: "Website / Google",  color: "info",  width: "58%", amount: "$34.2k", deals: "14" },
      { name: "Facebook ads",      color: "gold",  width: "38%", amount: "$22.4k", deals: "8"  },
      { name: "Yelp",              color: "plum",  width: "24%", amount: "$14.1k", deals: "5"  },
      { name: "Cold outreach",     color: "teal",  width: "14%", amount: "$8.3k",  deals: "3"  }
    ],
    rt: {
      onlineNow: "7", onlineTotal: "12", onCalls: "5",
      callsLastHour: "38", avgDuration: "3m 42s",
      connectedRate: "62%", connectedRateNote: "↑ 4 pts vs yesterday",
      inQueue: "3", longestWait: "42s",
      dealsToday: "2", dealsTodayAmount: "$5.4k", lastBooked: "12m ago"
    },
    agents: [
      { rowStyle: "", color: "var(--terra)", initials: "JS", name: "John Sales",       dotClass: "call",   statusText: "On a call · 2m 14s", calls: "12", connectedClass: "good", connected: "8 · 67%", talkTime: "34m", deals: "2",  lastAction: "just now" },
      { rowStyle: "", color: "var(--info)",  initials: "JF", name: "Jane Finance",     dotClass: "call",   statusText: "On a call · 38s",    calls: "9",  connectedClass: "good", connected: "6 · 67%", talkTime: "22m", deals: "0",  lastAction: "just now" },
      { rowStyle: "", color: "var(--teal)",  initials: "AH", name: "Andrew Haylton",   dotClass: "online", statusText: "Available",          calls: "7",  connectedClass: "good", connected: "5 · 71%", talkTime: "18m", deals: "0",  lastAction: "2m ago" },
      { rowStyle: "", color: "var(--plum)",  initials: "PR", name: "Paul Rai",         dotClass: "call",   statusText: "On a call · 5m 02s", calls: "6",  connectedClass: "warn", connected: "3 · 50%", talkTime: "14m", deals: "0",  lastAction: "just now" },
      { rowStyle: "", color: "var(--gold)",  initials: "DJ", name: "Donald James",     dotClass: "away",   statusText: "Away · break",       calls: "4",  connectedClass: "",     connected: "2 · 50%", talkTime: "9m",  deals: "0",  lastAction: "12m ago" },
      { rowStyle: "", color: "var(--rose, var(--bad))", initials: "GS", name: "Gerald Sabados", dotClass: "online", statusText: "Available", calls: "0",  connectedClass: "bad",  connected: "0",       talkTime: "0",   deals: "0",  lastAction: "28m ago" },
      { rowStyle: "opacity:0.55;", color: "var(--ink-4)", initials: "FW", name: "Fred Waite", dotClass: "off",  statusText: "Offline",       calls: "—",  connectedClass: "",     connected: "—",       talkTime: "—",   deals: "—",  lastAction: "1h ago" }
    ],
    queue: { waiting: "3", num: "3", note: "in queue · longest 42s", sales: "2", support: "1", avgWait: "18s", abandoned: "2" },
    feed: [
      { who: "John Sales",     target: "Alice Johnson", amount: "$2,768", sub: "Deal 17826-1 · Local move",   time: "12m ago" },
      { who: "Jane Finance",   target: "R. Chen",       line: "",         sub: "Long distance · in progress", time: "38s ago" },
      { line: "Call abandoned · 1m 24s wait", sub: "Caller: 416-555-0190 · auto-callback queued", time: "4m ago" },
      { who: "M. Lee",         line: "\"Y\" to confirmation", sub: "SMS · Deal 17880-1", time: "6m ago" },
      { who: "Andrew Haylton", target: "S. Patel",      amount: "$2,635", sub: "Deal 17870-1 · Local move",   time: "1h ago" }
    ]
  };
  F["dashboard"] = {
  summary: "Dashboard",
  metrics: {
  "stat_delta": [
    "Longest wait \u00b7 42s",
    "Avg per agent \u00b7 2h 04m",
    "42 opened \u00b7 27% open rate",
    "8 viewed \u00b7 3 accepted",
    "$18,450 booked today"
  ],
  "stat_eyebrow": [
    "Online now",
    "Calls in last hour",
    "In queue",
    "Talk time today",
    "Leads today",
    "Emails sent",
    "Quotes sent",
    "Moves booked"
  ],
  "tp_rate": [
    "92%",
    "78%",
    "71%",
    "64%"
  ],
  "q_num": [
    "3"
  ],
  "pct": [
    "\u2191 18%"
  ]
},
  amounts: ["$2,675", "$1,420,800", "$0", "$42,640", "$31,210", "$24,810", "$18,400"],
  kpis: [
  {
    "label": "Deals booked this month",
    "value": "",
    "delta": ""
  },
  {
    "label": "Discovery Calls today",
    "value": "12",
    "delta": ""
  },
  {
    "label": "Deals booked today",
    "value": "3",
    "delta": ""
  },
  {
    "label": "Average deal value",
    "value": "$2,675",
    "delta": ""
  },
  { "label": "Calls in last hour", "value": "38", "delta": "" },
  { "label": "In queue",           "value": "3",  "delta": "" },
  { "label": "Leads today",        "value": "21", "delta": "" },
  { "label": "Emails sent",        "value": "156","delta": "" },
  { "label": "Quotes sent",        "value": "19", "delta": "" },
  { "label": "Moves booked",       "value": "7",  "delta": "" }
],
  rows: [
  {
    "c1_text": "12",
    "c2_text": "8 \u00b7 67%",
    "c3_text": "34m",
    "c4_text": "2",
    "c0_wrapCls": "agent",
    "c0_avBg": "var(--terra)",
    "c0_avInitials": "JS",
    "c0_name": "John Sales",
    "c0_sub": "On a call \u00b7 2m 14s",
    "c0_dotCls": "call"
  },
  {
    "c1_text": "9",
    "c2_text": "6 \u00b7 67%",
    "c3_text": "22m",
    "c4_text": "0",
    "c0_wrapCls": "agent",
    "c0_avBg": "var(--info)",
    "c0_avInitials": "JF",
    "c0_name": "Jane Finance",
    "c0_sub": "On a call \u00b7 38s",
    "c0_dotCls": "call"
  },
  {
    "c1_text": "7",
    "c2_text": "5 \u00b7 71%",
    "c3_text": "18m",
    "c4_text": "0",
    "c0_wrapCls": "agent",
    "c0_avBg": "#0E7C8F",
    "c0_avInitials": "AH",
    "c0_name": "Andrew Haylton",
    "c0_sub": "Available",
    "c0_dotCls": "online"
  },
  {
    "c1_text": "6",
    "c2_text": "3 \u00b7 50%",
    "c3_text": "14m",
    "c4_text": "0",
    "c0_wrapCls": "agent",
    "c0_avBg": "#7B4B94",
    "c0_avInitials": "PR",
    "c0_name": "Paul Rai",
    "c0_sub": "On a call \u00b7 5m 02s",
    "c0_dotCls": "call"
  },
  {
    "c1_text": "4",
    "c2_text": "2 \u00b7 50%",
    "c3_text": "9m",
    "c4_text": "0",
    "c0_wrapCls": "agent",
    "c0_avBg": "var(--gold)",
    "c0_avInitials": "DJ",
    "c0_name": "Donald James",
    "c0_sub": "Away \u00b7 break",
    "c0_dotCls": "away"
  },
  {
    "c1_text": "\u2014",
    "c2_text": "\u2014",
    "c3_text": "\u2014",
    "c4_text": "\u2014",
    "c0_wrapCls": "agent",
    "c0_avBg": "var(--ink-4)",
    "c0_avInitials": "FW",
    "c0_name": "Fred Waite",
    "c0_sub": "Offline",
    "c0_dotCls": "off"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, stats: {
      grossRevenue: "$128,400",
      grossRevenueCents: ".50",
      grossRevenueDelta: "14.2%",
      dealsBooked: "48",
      dealsBookedDelta: "9.1%",
      avgDealSize: "$2,675",
      avgDealSizeDelta: "6.2%",
      closeRate: "43",
      closeRateDelta: "2.1pp"
    },
    chart: {
      total: "$1,420,800",
      thisYear: "$1.42M",
      prevYear: "$1.18M",
      forecast: "$1.58M",
      yAxis: [
        { label: "$160k" }, { label: "$120k" }, { label: "$80k" }, { label: "$40k" }, { label: "$0" }
      ],
      xAxis: [
        { label: "Jun", cls: "" }, { label: "Jul", cls: "" }, { label: "Aug", cls: "" },
        { label: "Sep", cls: "" }, { label: "Oct", cls: "" }, { label: "Nov", cls: "" },
        { label: "Dec", cls: "" }, { label: "Jan", cls: "" }, { label: "Feb", cls: "" },
        { label: "Mar", cls: "" }, { label: "Apr", cls: "" }, { label: "May", cls: "cur" }
      ],
      defaultRange: "12m",
      ranges: {
        "1d": {
          headline: "$25,600", yMax: 6,
          yLabels: ["$6k","$4.5k","$3k","$1.5k"],
          xLabels: ["12a","2a","4a","6a","8a","10a","12p","2p","4p","6p","8p","10p"],
          values: [0.2, 0.1, 0.4, 1.2, 2.8, 4.5, 5.2, 4.8, 3.5, 1.8, 0.8, 0.3],
          prev:   [0.15, 0.1, 0.35, 1.1, 2.5, 4.1, 4.8, 4.3, 3.1, 1.5, 0.7, 0.25]
        },
        "7d": {
          headline: "$50,400", yMax: 12,
          yLabels: ["$12k","$9k","$6k","$3k"],
          xLabels: ["5/18","5/19","5/20","5/21","5/22","5/23","Today"],
          values: [6.4, 7.2, 5.8, 8.1, 7.5, 6.9, 8.5],
          prev:   [5.8, 6.5, 5.2, 7.4, 6.8, 6.2, 7.7]
        },
        "30d": {
          headline: "$128,400", yMax: 12,
          yLabels: ["$12k","$9k","$6k","$3k"],
          xLabels: ["Apr 25","","","","","","May 1","","","","","","","May 8","","","","","","","May 15","","","","","","","May 22","",""],
          values: [3.1, 4.2, 5.5, 4.8, 6.1, 5.2, 4.5, 3.8, 5.4, 6.2, 7.1, 5.9, 4.8, 6.5, 7.3, 6.1, 5.4, 4.9, 6.8, 7.4, 5.8, 6.2, 7.5, 8.1, 6.9, 5.7, 7.8, 8.5, 6.4, 7.2],
          prev:   [2.8, 3.8, 5.0, 4.3, 5.5, 4.7, 4.1, 3.4, 4.9, 5.6, 6.4, 5.3, 4.3, 5.9, 6.6, 5.5, 4.9, 4.4, 6.1, 6.7, 5.2, 5.6, 6.8, 7.3, 6.2, 5.1, 7.0, 7.7, 5.8, 6.5]
        },
        "90d": {
          headline: "$463,000", yMax: 60,
          yLabels: ["$60k","$45k","$30k","$15k"],
          xLabels: ["Mar","","","","Apr","","","","May","","","Now"],
          values: [28, 32, 26, 34, 38, 31, 42, 29, 35, 40, 44, 48],
          prev:   [26, 29, 24, 31, 35, 28, 38, 26, 32, 36, 40, 44]
        },
        "12m": {
          headline: "$1,420,800", yMax: 200,
          yLabels: ["$200k","$150k","$100k","$50k"],
          xLabels: ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
          values: [92, 105, 88, 118, 132, 122, 156, 82, 98, 124, 142, 162],
          prev:   [85, 92, 78, 102, 115, 108, 138, 74, 88, 112, 128, 146]
        },
        "ytd": {
          headline: "$608,000", yMax: 200,
          yLabels: ["$200k","$150k","$100k","$50k"],
          xLabels: ["Jan","Feb","Mar","Apr","May"],
          values: [82, 98, 124, 142, 162],
          prev:   [74, 88, 112, 128, 146]
        }
      }
    },
    topPerformers: [
      { color: "var(--terra)", initials: "JS", name: "John Sales",     deals: "14", amount: "$42,640", rate: "92%", rateClass: "good" },
      { color: "var(--info)",  initials: "JF", name: "Jane Finance",   deals: "11", amount: "$31,210", rate: "78%", rateClass: "good" },
      { color: "#0E7C8F",      initials: "AH", name: "Andrew Haylton", deals: "9",  amount: "$24,810", rate: "71%", rateClass: "" },
      { color: "#7B4B94",      initials: "PR", name: "Paul Rai",       deals: "8",  amount: "$18,400", rate: "64%", rateClass: "" }
    ],
    needsAttention: [
      { title: "Stale opportunities",   subtitle: "No contact in 7+ days",  count: "5", level: "warn" },
      { title: "Open service tickets",  subtitle: "Awaiting customer reply", count: "2", level: "bad" },
      { title: "Accepted Growth Plans", subtitle: "Not yet booked or paid",  count: "3", level: "" },
      { title: "Unassigned new leads",  subtitle: "In queue under 1h",       count: "4", level: "" }
    ],
    live: {
      onlineNow: "7", onlineTotal: "/12", onCalls: "5",
      callsLastHour: "38", avgDuration: "3m 42s",
      inQueue: "3", longestWait: "42s"
    },
    agents: [
      { rowStyle: "", color: "var(--terra)", initials: "JS", name: "John Sales",       dotClass: "call",   statusText: "On a call · 2m 14s", calls: "12", connectedClass: "val-good", connected: "8 · 67%", talkTime: "34m", deals: "2" },
      { rowStyle: "", color: "var(--info)",  initials: "JF", name: "Jane Finance",     dotClass: "call",   statusText: "On a call · 38s",    calls: "9",  connectedClass: "val-good", connected: "6 · 67%", talkTime: "22m", deals: "0" },
      { rowStyle: "", color: "#0E7C8F",      initials: "AH", name: "Andrew Haylton",   dotClass: "online", statusText: "Available",          calls: "7",  connectedClass: "val-good", connected: "5 · 71%", talkTime: "18m", deals: "0" },
      { rowStyle: "", color: "#7B4B94",      initials: "PR", name: "Paul Rai",         dotClass: "call",   statusText: "On a call · 5m 02s", calls: "6",  connectedClass: "val-warn", connected: "3 · 50%", talkTime: "14m", deals: "0" },
      { rowStyle: "", color: "var(--gold)",  initials: "DJ", name: "Donald James",     dotClass: "away",   statusText: "Away · break",       calls: "4",  connectedClass: "",         connected: "2 · 50%", talkTime: "9m",  deals: "0" },
      { rowStyle: "opacity:0.55;", color: "var(--ink-4)", initials: "FW", name: "Fred Waite", dotClass: "off", statusText: "Offline",        calls: "—",  connectedClass: "",         connected: "—",       talkTime: "—",   deals: "—" }
    ],
    queue: { inQueue: "3", salesLine: "2", supportLine: "1", longestWait: "42s" },
    today: { totalCalls: "186", connectedRate: "62%", avgWait: "18s", abandoned: "2" },
    dealsToday: { count: "2", amount: "/ $5,403", lastBooked: "12m ago" }
  };
  F["documents"] = {
  docs: [{"id": 1042, "ext": "pdf", "title": "Service contract \u2014 Alice Johnson", "to": "alice.johnson@gmail.com", "date": "May 18, 2026", "status": "process", "tabs": ["all", "process"]}, {"id": 1041, "ext": "pdf", "title": "Quote \u2014 Northside Co. (commercial)", "to": "ops@northsideco.com", "date": "May 17, 2026", "status": "process", "tabs": ["all", "process"]}, {"id": 1040, "ext": "pdf", "title": "Box delivery agreement \u2014 S. Patel", "to": "sara.patel@yahoo.com", "date": "May 16, 2026", "status": "process", "tabs": ["all", "process"]}, {"id": 1039, "ext": "pdf", "title": "Truck 14 \u2014 annual safety renewal", "to": "You \u00b7 countersign", "date": "May 16, 2026", "status": "needs", "tabs": ["all", "sign"]}, {"id": 1038, "ext": "docx", "title": "Vendor \u2014 fuel card terms (Petro-Can)", "to": "You \u00b7 countersign", "date": "May 14, 2026", "status": "needs", "tabs": ["all", "sign"]}, {"id": 1037, "ext": "docx", "title": "Draft \u2014 packing services rider", "to": "\u2014", "date": "Today", "status": "draft", "tabs": ["all", "drafts"]}, {"id": 1036, "ext": "docx", "title": "Draft \u2014 long distance addendum v3", "to": "\u2014", "date": "Yesterday", "status": "draft", "tabs": ["all", "drafts"]}, {"id": 1035, "ext": "pdf", "title": "Service contract \u2014 R. Chen (signed)", "to": "rebecca.chen@gmail.com", "date": "May 12, 2026", "status": "completed", "tabs": ["all", "completed"]}, {"id": 1034, "ext": "pdf", "title": "Service contract \u2014 T. Anand (signed)", "to": "tao.anand@hotmail.com", "date": "May 08, 2026", "status": "completed", "tabs": ["all", "completed"]}, {"id": 1033, "ext": "pdf", "title": "Service contract \u2014 Foundry Co.", "to": "cfo@foundry.com", "date": "May 02, 2026", "status": "completed", "tabs": ["all", "completed"]}, {"id": 1032, "ext": "pdf", "title": "Service contract \u2014 M. Tran", "to": "m.tran@outlook.com", "date": "Apr 28, 2026", "status": "completed", "tabs": ["all", "completed"]}, {"id": 1031, "ext": "pdf", "title": "Quote \u2014 Linwood Plaza (declined)", "to": "pm@linwood.com", "date": "Apr 22, 2026", "status": "cancelled", "tabs": ["all", "cancelled"]}, {"id": 1030, "ext": "pdf", "title": "Quote \u2014 Cedar Glen HOA", "to": "board@cedarglen.com", "date": "Apr 15, 2026", "status": "cancelled", "tabs": ["all", "cancelled"]}, {"id": 1029, "ext": "pdf", "title": "Employee handbook v4.pdf", "to": "All staff", "date": "Apr 01, 2026", "status": "internal", "tabs": ["all", "internal"]}, {"id": 1028, "ext": "pdf", "title": "Workplace safety policy.pdf", "to": "All staff", "date": "Mar 15, 2026", "status": "internal", "tabs": ["all", "internal"]}, {"id": 1027, "ext": "xlsx", "title": "Q1 P&L final.xlsx", "to": "Finance team", "date": "Apr 01, 2026", "status": "internal", "tabs": ["all", "internal"]}, {"id": 1026, "ext": "docx", "title": "Vendor list 2026.docx", "to": "Ops team", "date": "Mar 02, 2026", "status": "internal", "tabs": ["all", "internal"]}, {"id": 2001, "ext": "docx", "title": "Standard service contract \u2014 template", "to": "Template \u00b7 used 12\u00d7", "date": "Mar 01, 2026", "status": "template", "tabs": ["templates"]}, {"id": 2002, "ext": "docx", "title": "Long-distance addendum \u2014 template", "to": "Template \u00b7 used 5\u00d7", "date": "Feb 10, 2026", "status": "template", "tabs": ["templates"]}, {"id": 2003, "ext": "docx", "title": "Packing services rider \u2014 template", "to": "Template \u00b7 used 9\u00d7", "date": "Feb 04, 2026", "status": "template", "tabs": ["templates"]}, {"id": 2004, "ext": "docx", "title": "Damage waiver \u2014 template", "to": "Template \u00b7 used 31\u00d7", "date": "Jan 18, 2026", "status": "template", "tabs": ["templates"]}, {"id": 2005, "ext": "pdf", "title": "Storage rental agreement \u2014 template", "to": "Template \u00b7 used 18\u00d7", "date": "Jan 12, 2026", "status": "template", "tabs": ["templates"]}, {"id": 3001, "ext": "pdf", "title": "Field contract \u2014 J. Park (signed)", "to": "jpark@gmail.com", "date": "May 18, 2026", "status": "fieldsigned", "tabs": ["fieldcontracts"]}, {"id": 3002, "ext": "pdf", "title": "Field contract \u2014 D. Wu (signed)", "to": "david@example.com", "date": "May 16, 2026", "status": "fieldsigned", "tabs": ["fieldcontracts"]}, {"id": 3003, "ext": "pdf", "title": "Field contract \u2014 M. Tran (signed)", "to": "m.tran@outlook.com", "date": "May 14, 2026", "status": "fieldsigned", "tabs": ["fieldcontracts"]}, {"id": 3004, "ext": "pdf", "title": "Field damage report \u2014 Truck 02", "to": "Crew \u00b7 Ravi Patel", "date": "May 09, 2026", "status": "fieldsigned", "tabs": ["fieldcontracts"]}],
  subtitle: "Quotes, contracts, signed forms, and internal files",
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "340 files · 6 folders · 2.4 GB used",
    "counts": { "all": "340" },
    "folders": [
      { "name": "Contracts", "countText": "42 documents" },
      { "name": "Insurance", "countText": "18 documents" },
      { "name": "Tax filings", "countText": "28 documents" },
      { "name": "HR & payroll", "countText": "64 documents" },
      { "name": "Customer signed forms", "countText": "182 documents" },
      { "name": "Truck registration", "countText": "6 documents" }
    ],
    "files": [
      { "type": "PDF", "typeColor": "bad", "name": "Service contract — Alice Johnson.pdf", "category": "Customer", "owner": "A. Haylton", "size": "380 KB", "modified": "Today · 9:38 AM", "signedDisplay": "inline-flex", "dashDisplay": "none" },
      { "type": "PDF", "typeColor": "bad", "name": "COI 2026 — Lloyds of London.pdf", "category": "Insurance", "owner": "Admin", "size": "220 KB", "modified": "May 14", "signedDisplay": "none", "dashDisplay": "inline" },
      { "type": "PDF", "typeColor": "bad", "name": "Tax filing Q1 2026.pdf", "category": "Finance", "owner": "Jane Finance", "size": "1.4 MB", "modified": "Apr 30", "signedDisplay": "none", "dashDisplay": "inline" },
      { "type": "PDF", "typeColor": "bad", "name": "Truck 5 — annual safety cert.pdf", "category": "Vehicle", "owner": "Admin", "size": "186 KB", "modified": "Apr 22", "signedDisplay": "none", "dashDisplay": "inline" },
      { "type": "DOC", "typeColor": "info", "name": "Northside Co. master agreement.docx", "category": "Customer", "owner": "John Sales", "size": "94 KB", "modified": "Apr 18", "signedDisplay": "inline-flex", "dashDisplay": "none" },
      { "type": "PDF", "typeColor": "bad", "name": "Employee handbook v4.pdf", "category": "HR", "owner": "Admin", "size": "2.8 MB", "modified": "Apr 1", "signedDisplay": "none", "dashDisplay": "inline" },
      { "type": "XLS", "typeColor": "ok", "name": "Q1 P&L final.xlsx", "category": "Finance", "owner": "Jane Finance", "size": "520 KB", "modified": "Apr 1", "signedDisplay": "none", "dashDisplay": "inline" },
      { "type": "PDF", "typeColor": "bad", "name": "Workplace safety policy.pdf", "category": "HR", "owner": "Admin", "size": "410 KB", "modified": "Mar 15", "signedDisplay": "none", "dashDisplay": "inline" }
    ]
  };
  F["fieldCrew"] = {
  metrics: {
  "stat_delta": [
    "186 total load photos"
  ]
},
  crew: [{"name": "Andrew Haylton", "role": "Team lead", "license": "CDL \u00b7 expires 2027", "phone": "(416) 555-0184", "hire": "Feb 2024", "status": "on duty"}, {"name": "Donald James", "role": "Team lead", "license": "CDL \u00b7 expires 2026", "phone": "(416) 555-0142", "hire": "May 2023", "status": "on duty"}, {"name": "Fred Waite", "role": "Team lead", "license": "CDL \u00b7 expires 2026", "phone": "(416) 555-0122", "hire": "Aug 2022", "status": "on duty"}, {"name": "Paul Rai", "role": "Driver", "license": "G \u00b7 expires 2028", "phone": "(416) 555-0179", "hire": "Jan 2024", "status": "off"}, {"name": "Jackson Mungai", "role": "Mover", "license": "G \u00b7 expires 2027", "phone": "(416) 555-0118", "hire": "Mar 2024", "status": "on duty"}, {"name": "Alex Zu", "role": "Driver", "license": "CDL \u00b7 expires 2025", "phone": "(416) 555-0166", "hire": "Oct 2023", "status": "on duty"}, {"name": "Gurtsik Ann", "role": "Helper", "license": "G \u00b7 expires 2029", "phone": "(416) 555-0190", "hire": "Nov 2024", "status": "on duty"}, {"name": "Maya Kapoor", "role": "Driver", "license": "CDL \u00b7 expires 2028", "phone": "(416) 555-0151", "hire": "Apr 2025", "status": "off"}],
  speeding: [{"driver": "Alex Zu", "veh": "Truck 09", "date": "Today 9:02 AM", "speed": 74, "limit": 60, "over": 14, "loc": "401 EB \u00b7 Pickering"}, {"driver": "Alex Zu", "veh": "Truck 09", "date": "2 days ago", "speed": 68, "limit": 60, "over": 8, "loc": "427 NB \u00b7 Toronto"}, {"driver": "Jackson Mungai", "veh": "Truck 14", "date": "May 12 4:12 PM", "speed": 62, "limit": 50, "over": 12, "loc": "Yonge \u00b7 Vaughan"}],
  dvirs: [{"veh": "Truck 14", "driver": "Andrew Haylton", "date": "Today 6:48 AM", "defects": "None", "status": "passed"}, {"veh": "Truck 09", "driver": "Alex Zu", "date": "Today 6:51 AM", "defects": "Tire pressure 22 psi (target 35)", "status": "failed"}, {"veh": "Van 03", "driver": "Paul Rai", "date": "Today 6:42 AM", "defects": "None", "status": "passed"}, {"veh": "Truck 02", "driver": "Fred Waite", "date": "Today 6:58 AM", "defects": "None", "status": "passed"}, {"veh": "Van 11", "driver": "Maya Kapoor", "date": "Today 6:55 AM", "defects": "Mirror damage", "status": "failed"}],
  logbooks: [{"driver": "Andrew Haylton", "date": "Today", "veh": "Truck 14", "onDuty": "8h 12m", "driving": "4h 22m", "offDuty": "15h 48m", "comp": "green"}, {"driver": "Donald James", "date": "Today", "veh": "Truck 09", "onDuty": "7h 48m", "driving": "5h 04m", "offDuty": "16h 12m", "comp": "green"}, {"driver": "Alex Zu", "date": "Today", "veh": "Truck 09", "onDuty": "9h 21m", "driving": "6h 18m", "offDuty": "14h 39m", "comp": "yellow"}, {"driver": "Fred Waite", "date": "Today", "veh": "Truck 02", "onDuty": "6h 14m", "driving": "3h 02m", "offDuty": "17h 46m", "comp": "green"}, {"driver": "Paul Rai", "date": "Yesterday", "veh": "Van 03", "onDuty": "8h 04m", "driving": "4h 11m", "offDuty": "15h 56m", "comp": "green"}, {"driver": "Jackson Mungai", "date": "Yesterday", "veh": "Truck 14", "onDuty": "10h 22m", "driving": "7h 04m", "offDuty": "13h 38m", "comp": "red"}],
  contracts: [{"cust": "Alice Johnson", "job": "17826", "crew": "Truck 14", "created": "May 14", "signed": "May 14", "status": "signed", "stCls": "signed"}, {"cust": "Northside Co.", "job": "17821", "crew": "Truck 02", "created": "May 12", "signed": "\u2014", "status": "pending", "stCls": "pending"}, {"cust": "Rebecca Chen", "job": "17812", "crew": "Truck 14", "created": "May 06", "signed": "\u2014", "status": "unsigned", "stCls": "unsigned"}, {"cust": "Tao Anand", "job": "17801", "crew": "Van 03", "created": "May 04", "signed": "May 04", "status": "signed", "stCls": "signed"}, {"cust": "Foundry Co.", "job": "17815", "crew": "Van 03", "created": "May 02", "signed": "May 02", "status": "signed", "stCls": "signed"}],
  photos: [{"title": "Pre-load \u00b7 Truck 14", "who": "A. Haylton \u00b7 7:14 AM", "ai": "pass", "tag": "PASS"}, {"title": "Pad &amp; wrap \u00b7 sofa", "who": "J. Mungai \u00b7 8:22 AM", "ai": "pass", "tag": "PASS"}, {"title": "Pre-load \u00b7 Van 03", "who": "P. Rai \u00b7 7:42 AM", "ai": "fail", "tag": "BLURRY"}, {"title": "Inside truck \u00b7 final", "who": "A. Haylton \u00b7 11:08 AM", "ai": "pass", "tag": "PASS"}, {"title": "Box inventory \u00b7 staging", "who": "M. Lee \u00b7 9:38 AM", "ai": "pass", "tag": "PASS"}, {"title": "Damage report \u00b7 dresser", "who": "P. Rai \u00b7 10:42 AM", "ai": "fail", "tag": "FLAG"}, {"title": "Customer signoff", "who": "F. Waite \u00b7 12:14 PM", "ai": "pass", "tag": "PASS"}, {"title": "Wrap &amp; pad \u00b7 piano", "who": "D. James \u00b7 8:51 AM", "ai": "pass", "tag": "PASS"}],
  reports: [{"type": "Load Quality", "emp": "Paul Rai", "veh": "Van 03", "job": "17801 \u00b7 T. Anand", "date": "Today 10:42 AM", "status": "open", "cls": "loadq"}, {"type": "AI Load Failed", "emp": "Donald James", "veh": "Truck 09", "job": "17820 \u00b7 Garcia", "date": "Today 9:18 AM", "status": "open", "cls": "aiload"}, {"type": "Speeding", "emp": "Alex Zu", "veh": "Truck 09", "job": "17820 \u00b7 Garcia", "date": "Today 9:02 AM", "status": "reviewed", "cls": "speed"}, {"type": "Missed Photo", "emp": "Jackson Mungai", "veh": "Truck 14", "job": "17826 \u00b7 Johnson", "date": "Today 8:14 AM", "status": "open", "cls": "photo"}, {"type": "Contract Not Signed", "emp": "Andrew Haylton", "veh": "Truck 14", "job": "17812 \u00b7 Chen", "date": "Yesterday", "status": "open", "cls": "contract"}, {"type": "Load Quality", "emp": "Fred Waite", "veh": "Truck 02", "job": "17821 \u00b7 Northside", "date": "Yesterday", "status": "resolved", "cls": "loadq"}, {"type": "Speeding", "emp": "Alex Zu", "veh": "Truck 09", "job": "17790 \u00b7 Ng", "date": "2 days ago", "status": "reviewed", "cls": "speed"}, {"type": "AI Load Failed", "emp": "Paul Rai", "veh": "Van 03", "job": "17815 \u00b7 Foundry", "date": "3 days ago", "status": "resolved", "cls": "aiload"}],
  optionsOptions13: [{"value": "Team lead", "label": "Team lead"}, {"value": "Driver", "label": "Driver"}, {"value": "Mover", "label": "Mover"}, {"value": "Helper", "label": "Helper"}],
  optionsOptions12: [{"value": "Last 7 days", "label": "Last 7 days"}, {"value": "Last 30 days", "label": "Last 30 days"}],
  optionsOptions11: [],
  optionsOptions10: [{"value": "Pass", "label": "Pass"}, {"value": "Fail", "label": "Fail"}],
  optionsOptions9: [],
  optionsOptions8: [{"value": "Last 7 days", "label": "Last 7 days"}, {"value": "Last 30 days", "label": "Last 30 days"}, {"value": "This month", "label": "This month"}],
  optionsOptions7: [{"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Donald James", "label": "Donald James"}, {"value": "Alex Zu", "label": "Alex Zu"}],
  optionsOptions6: [],
  optionsOptions5: [{"value": "Signed", "label": "Signed"}, {"value": "Pending", "label": "Pending"}, {"value": "Unsigned", "label": "Unsigned"}],
  optionsOptions4: [{"value": "Pass", "label": "Pass"}, {"value": "Fail", "label": "Fail"}],
  optionsOptions3: [{"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Donald James", "label": "Donald James"}],
  optionsOptions2: [{"value": "Truck 14", "label": "Truck 14"}, {"value": "Truck 09", "label": "Truck 09"}, {"value": "Van 03", "label": "Van 03"}],
  optionsOptions: [{"value": "Open", "label": "Open"}, {"value": "Resolved", "label": "Resolved"}, {"value": "Reviewed", "label": "Reviewed"}],
  fcrempOptions: [{"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Donald James", "label": "Donald James"}, {"value": "Fred Waite", "label": "Fred Waite"}, {"value": "Jackson Mungai", "label": "Jackson Mungai"}, {"value": "Paul Rai", "label": "Paul Rai"}, {"value": "Alex Zu", "label": "Alex Zu"}],
  fcrtypeOptions: [{"value": "AI Load Failed", "label": "AI Load Failed"}, {"value": "Load Quality", "label": "Load Quality"}, {"value": "Speeding", "label": "Speeding"}, {"value": "Contract Not Signed", "label": "Contract Not Signed"}, {"value": "Missed Photo", "label": "Missed Photo"}],
  subtitle: "Loads, contracts &amp; driving \u2014 last 30 days",
  kpis: [
  {
    "label": "Unresolved reports",
    "value": "8",
    "delta": "11 total (30 days)"
  },
  {
    "label": "Load quality issues",
    "value": "4",
    "delta": "42 passed / 4 failed"
  },
  {
    "label": "Speeding violations",
    "value": "3",
    "delta": "Last 30 days"
  },
  {
    "label": "Unsigned contracts",
    "value": "2",
    "delta": ""
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "6 teams · 11 members · Sat May 16, 2026",
    "counts": { "teams": 6, "members": 11, "vehicles": 6 },
    "stats": {
      "active": 4, "activeTotal": 6, "activeSub": "2 on the road",
      "inProgress": 3, "inProgressSub": "5 completed today",
      "hours": 24, "hoursSub": "across all teams",
      "util": 82, "utilDelta": "4 pts"
    },
    "chips": { "all": 6, "onMove": 2, "enRoute": 1, "atDepot": 2, "off": 1 },
    "t1": {
      "name": "Truck 1", "id": "team-001", "status": "On move",
      "job1": { "time": "7:00 AM", "title": "Alice Johnson · 3BR move", "sub": "Toronto → Hamilton · 4h · in progress" },
      "job2": { "time": "1:00 PM", "title": "Joaquin Lopez · in-home survey", "sub": "North York · 1h estimate" },
      "members": "A. Haylton, J. Mungai", "size": "26 ft"
    },
    "t2": {
      "name": "Van 1", "id": "team-002", "status": "En route",
      "job1": { "time": "11:00 AM", "title": "Sara Patel · box delivery", "sub": "Mississauga · 30 boxes · arriving in 12 min" },
      "job2": { "time": "2:00 PM", "title": "Marcus Lee · packing prep", "sub": "Etobicoke · 2 packers, 2h" },
      "members": "D. James, P. Rai", "size": "14 ft"
    },
    "t3": {
      "name": "Truck 3", "id": "team-003", "status": "On site",
      "job1": { "time": "9:00 AM", "title": "Northside Co. · office relocation", "sub": "Downtown · 6h · in progress" },
      "members": "F. Waite, G. Sabados, G. Sigh", "size": "26 ft"
    },
    "t4": {
      "name": "Truck 2", "id": "team-004", "status": "At depot",
      "job1": { "time": "2:00 PM", "title": "Survey · J. Lopez", "sub": "North York · 1h estimate · upcoming" },
      "note": "Loading boxes · departs 1:15 PM",
      "members": "A. Zu (driver only)", "size": "22 ft"
    },
    "t5": {
      "name": "Truck 4", "id": "team-005", "status": "At depot",
      "bodyTitle": "Available for assignment",
      "members": "G. Ann (helper)", "size": "14 ft"
    },
    "t6": {
      "name": "Truck 5", "id": "team-006", "status": "Off today",
      "bodyTitle": "Out of service", "bodySub": "Routine maintenance · back Monday",
      "members": "No members assigned", "size": "14 ft"
    }
  };
  F["finance"] = {
  metrics: {
  "stat_delta": [
    "+4.6% (This Month)",
    "3 employees",
    "$2,140 total",
    "filed Apr 30"
  ],
  "pct": [
    "+12.4%",
    "+18.2%"
  ]
},
  rows: [
  {
    "c0_text": "Revenue",
    "c1_text": "$94,210.00",
    "c2_text": "$79,680.00"
  },
  {
    "c0_text": "Discounts",
    "c1_text": "\u2212$1,420.00",
    "c2_text": "\u2212$2,180.00"
  },
  {
    "c0_text": "Net revenue",
    "c1_text": "$92,790.00",
    "c2_text": "$77,500.00"
  },
  {
    "c0_text": "Cost of goods sold",
    "c1_text": "",
    "c2_text": ""
  },
  {
    "c0_text": "Wages \u2014 field crew",
    "c1_text": "\u2212$14,820.00",
    "c2_text": "\u2212$13,640.00"
  },
  {
    "c0_text": "Vehicle fuel",
    "c1_text": "\u2212$4,180.00",
    "c2_text": "\u2212$3,920.00"
  },
  {
    "c0_text": "Materials &amp; supplies",
    "c1_text": "\u2212$2,180.00",
    "c2_text": "\u2212$1,820.00"
  },
  {
    "c0_text": "Subcontractors",
    "c1_text": "\u2212$1,660.00",
    "c2_text": "\u2212$1,720.00"
  },
  {
    "c0_text": "Cost of goods sold",
    "c1_text": "\u2212$22,840.00",
    "c2_text": "\u2212$21,100.00"
  },
  {
    "c0_text": "Gross profit",
    "c1_text": "$69,950.00",
    "c2_text": "$56,400.00"
  },
  {
    "c0_text": "Operating expenses",
    "c1_text": "",
    "c2_text": ""
  },
  {
    "c0_text": "Office wages",
    "c1_text": "\u2212$8,420.00",
    "c2_text": "\u2212$8,420.00"
  },
  {
    "c0_text": "Rent &amp; utilities",
    "c1_text": "\u2212$3,840.00",
    "c2_text": "\u2212$3,840.00"
  },
  {
    "c0_text": "Marketing",
    "c1_text": "\u2212$2,640.00",
    "c2_text": "\u2212$2,180.00"
  },
  {
    "c0_text": "Software &amp; subscriptions",
    "c1_text": "\u2212$1,180.00",
    "c2_text": "\u2212$1,180.00"
  },
  {
    "c0_text": "Insurance",
    "c1_text": "\u2212$1,040.00",
    "c2_text": "\u2212$1,040.00"
  },
  {
    "c0_text": "Operating expenses",
    "c1_text": "\u2212$17,120.00",
    "c2_text": "\u2212$16,660.00"
  },
  {
    "c0_text": "Net profit",
    "c1_text": "$54,250.00",
    "c2_text": "$39,740.00"
  }
],
  amounts: ["$54,250", "$94,210", "$17,120", "$8,420", "$420", "$84,210", "$48,420", "$12,840", "$3,420", "$9,420"],
  appliesToOptions: [{"value": "services", "label": "Services"}, {"value": "goods", "label": "Goods"}],
  kindOptions: [{"value": "income", "label": "Income"}, {"value": "expense", "label": "Expense"}],
  recipientTypeOptions: [{"value": "employee", "label": "Employee"}, {"value": "vendor", "label": "Vendor"}, {"value": "other", "label": "Other"}],
  statusOptions: [{"value": "Draft", "label": "Draft"}, {"value": "Filed", "label": "Filed"}, {"value": "Paid", "label": "Paid"}, {"value": "Overdue", "label": "Overdue"}],
  periodOptions: [{"value": "Q1 (Jan\u2013Mar)", "label": "Q1 (Jan\u2013Mar)"}, {"value": "Q2 (Apr\u2013Jun)", "label": "Q2 (Apr\u2013Jun)"}, {"value": "Q3 (Jul\u2013Sep)", "label": "Q3 (Jul\u2013Sep)"}, {"value": "Q4 (Oct\u2013Dec)", "label": "Q4 (Oct\u2013Dec)"}, {"value": "Annual", "label": "Annual"}, {"value": "Custom\u2026", "label": "Custom\u2026"}],
  optionsOptions9: [{"value": "2026", "label": "2026"}, {"value": "2025", "label": "2025"}, {"value": "2024", "label": "2024"}, {"value": "2023", "label": "2023"}],
  optionsOptions8: [{"value": "HST", "label": "HST"}, {"value": "GST", "label": "GST"}, {"value": "PST", "label": "PST"}, {"value": "QST", "label": "QST"}, {"value": "Sales Tax", "label": "Sales Tax"}, {"value": "Corporate Income Tax", "label": "Corporate Income Tax"}, {"value": "Payroll Tax", "label": "Payroll Tax"}],
  compareAgainstOptions: [{"value": "Previous period", "label": "Previous period"}, {"value": "Same period last year", "label": "Same period last year"}, {"value": "YTD avg", "label": "YTD avg"}, {"value": "Goal only", "label": "Goal only"}],
  optionsOptions7: [{"value": "Revenue", "label": "Revenue"}, {"value": "Gross profit", "label": "Gross profit"}, {"value": "Net profit", "label": "Net profit"}, {"value": "COGS", "label": "COGS"}, {"value": "Operating expenses", "label": "Operating expenses"}, {"value": "Total jobs", "label": "Total jobs"}, {"value": "Crew hours", "label": "Crew hours"}],
  optionsOptions6: [{"value": "\u00f7", "label": "\u00f7"}, {"value": "\u00d7", "label": "\u00d7"}, {"value": "\u2212", "label": "\u2212"}, {"value": "+", "label": "+"}],
  optionsOptions5: [{"value": "Gross profit", "label": "Gross profit"}, {"value": "Net profit", "label": "Net profit"}, {"value": "Revenue", "label": "Revenue"}, {"value": "COGS", "label": "COGS"}, {"value": "Operating expenses", "label": "Operating expenses"}, {"value": "Labour costs", "label": "Labour costs"}],
  formatOptions: [{"value": "Percent (%)", "label": "Percent (%)"}, {"value": "Currency ($)", "label": "Currency ($)"}, {"value": "Ratio (\u00d7)", "label": "Ratio (\u00d7)"}, {"value": "Number", "label": "Number"}],
  presetOptions: [{"value": "EBITDA margin", "label": "EBITDA margin"}, {"value": "Cost ratio", "label": "Cost ratio"}, {"value": "Labour as % of revenue", "label": "Labour as % of revenue"}, {"value": "Revenue per job", "label": "Revenue per job"}, {"value": "Revenue per crew hour", "label": "Revenue per crew hour"}, {"value": "Marketing spend ratio", "label": "Marketing spend ratio"}, {"value": "Break-even revenue", "label": "Break-even revenue"}],
  typeOptions2: [{"value": "Both (in and out)", "label": "Both (in and out)"}, {"value": "Cash Out only", "label": "Cash Out only"}, {"value": "Cash In only", "label": "Cash In only"}],
  categoryOptions: [{"value": "Office", "label": "Office"}, {"value": "Food", "label": "Food"}, {"value": "Travel", "label": "Travel"}, {"value": "Materials", "label": "Materials"}, {"value": "Fuel", "label": "Fuel"}, {"value": "Top-up", "label": "Top-up"}],
  typeOptions: [{"value": "Cash In", "label": "Cash In"}, {"value": "Cash Out", "label": "Cash Out"}],
  employeeOptions3: [{"value": "Balaji Sukumar", "label": "Balaji Sukumar"}, {"value": "Harvansh Rai", "label": "Harvansh Rai"}, {"value": "Mandeep Bath", "label": "Mandeep Bath"}, {"value": "Paul Kihara", "label": "Paul Kihara"}, {"value": "Sukhwinder Sing", "label": "Sukhwinder Sing"}],
  employeeOptions2: [{"value": "Balaji Sukumar", "label": "Balaji Sukumar"}, {"value": "Harvansh Rai", "label": "Harvansh Rai"}, {"value": "Mandeep Bath", "label": "Mandeep Bath"}, {"value": "Paul Kihara", "label": "Paul Kihara"}, {"value": "Sukhwinder Sing", "label": "Sukhwinder Sing"}],
  employeeOptions: [{"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Donald James", "label": "Donald James"}, {"value": "Fred Waite", "label": "Fred Waite"}, {"value": "Paul Rai", "label": "Paul Rai"}, {"value": "Jackson Mungai", "label": "Jackson Mungai"}, {"value": "Alex Zu", "label": "Alex Zu"}, {"value": "Gurtsik Ann", "label": "Gurtsik Ann"}, {"value": "Maya Kapoor", "label": "Maya Kapoor"}],
  reimbursableToEmployeeOptions: [{"value": "No", "label": "No"}, {"value": "Yes \u2014 Admin User", "label": "Yes \u2014 Admin User"}, {"value": "Yes \u2014 John Sales", "label": "Yes \u2014 John Sales"}],
  branchOptions: [{"value": "Toronto HQ", "label": "Toronto HQ"}, {"value": "Mississauga", "label": "Mississauga"}, {"value": "Hamilton", "label": "Hamilton"}],
  linkedJobOptions: [{"value": "J-2841 Sarah Hess", "label": "J-2841 Sarah Hess"}, {"value": "J-2837 Mark Chen", "label": "J-2837 Mark Chen"}, {"value": "J-2840 Lia Petrov", "label": "J-2840 Lia Petrov"}],
  paymentMethodOptions: [{"value": "Company Visa \u00b7 4811", "label": "Company Visa \u00b7 4811"}, {"value": "Float Virtual Card", "label": "Float Virtual Card"}, {"value": "Bank transfer", "label": "Bank transfer"}, {"value": "Cash", "label": "Cash"}, {"value": "Cheque", "label": "Cheque"}, {"value": "e-Transfer", "label": "e-Transfer"}],
  optionsOptions4: [{"value": "Fuel", "label": "Fuel"}, {"value": "Maintenance", "label": "Maintenance"}, {"value": "Office", "label": "Office"}, {"value": "Marketing", "label": "Marketing"}, {"value": "Insurance", "label": "Insurance"}, {"value": "Equipment", "label": "Equipment"}, {"value": "Supplies", "label": "Supplies"}, {"value": "Software / SaaS", "label": "Software / SaaS"}, {"value": "Professional services", "label": "Professional services"}, {"value": "Other", "label": "Other"}],
  optionsOptions3: [{"value": "This Month", "label": "This Month"}, {"value": "This Week", "label": "This Week"}, {"value": "Today", "label": "Today"}, {"value": "Last 30 days", "label": "Last 30 days"}, {"value": "All time", "label": "All time"}],
  optionsOptions2: [{"value": "Office", "label": "Office"}, {"value": "Food", "label": "Food"}, {"value": "Travel", "label": "Travel"}, {"value": "Materials", "label": "Materials"}, {"value": "Fuel", "label": "Fuel"}],
  optionsOptions: [{"value": "Cash In", "label": "Cash In"}, {"value": "Cash Out", "label": "Cash Out"}],
  rows9: [
  {
    "c0_text": "Q2 2026 (Apr\u2013Jun)",
    "c1_text": "HST ON (13%)",
    "c2_text": "$12,840",
    "c3_text": "$3,420",
    "c4_text": "\u2014"
  },
  {
    "c0_text": "Q1 2026 (Jan\u2013Mar)",
    "c1_text": "HST ON (13%)",
    "c2_text": "$11,420",
    "c3_text": "$2,840",
    "c4_text": "$8,580"
  },
  {
    "c0_text": "Q4 2025",
    "c1_text": "HST ON (13%)",
    "c2_text": "$9,840",
    "c3_text": "$2,420",
    "c4_text": "$7,420"
  },
  {
    "c0_text": "Q3 2025",
    "c1_text": "HST ON (13%)",
    "c2_text": "$10,210",
    "c3_text": "$2,640",
    "c4_text": "$7,570"
  }
],
  rows8: [
  {
    "c0_text": "May 15",
    "c1_text": "STRIPE TRANSFER \u00b7 ref 8412",
    "c2_text": "RBC checking",
    "c3_text": "+$3,840"
  },
  {
    "c0_text": "May 14",
    "c1_text": "POS \u00b7 Sunoco",
    "c2_text": "Visa \u2022\u2022\u2022\u2022 4242",
    "c3_text": "\u2212$184"
  },
  {
    "c0_text": "May 14",
    "c1_text": "E-transfer \u00b7 J. Murphy",
    "c2_text": "RBC checking",
    "c3_text": "+$540"
  },
  {
    "c0_text": "May 13",
    "c1_text": "Office supplies \u00b7 Staples",
    "c2_text": "Visa \u2022\u2022\u2022\u2022 4242",
    "c3_text": "\u2212$92"
  },
  {
    "c0_text": "May 13",
    "c1_text": "Bank fee",
    "c2_text": "RBC checking",
    "c3_text": "\u2212$24"
  }
],
  rows7: [
  {
    "c0_text": "May 15",
    "c1_text": "Petro-Canada \u00b7 fuel",
    "c3_text": "Visa \u2022\u2022\u2022\u2022 4242",
    "c4_text": "$184.20"
  },
  {
    "c0_text": "May 14",
    "c1_text": "Costco wholesale",
    "c3_text": "Visa \u2022\u2022\u2022\u2022 4242",
    "c4_text": "$418.00"
  },
  {
    "c0_text": "May 13",
    "c1_text": "Staples",
    "c3_text": "Visa \u2022\u2022\u2022\u2022 4242",
    "c4_text": "$92.00"
  },
  {
    "c0_text": "May 12",
    "c1_text": "Twilio",
    "c3_text": "Visa \u2022\u2022\u2022\u2022 4242",
    "c4_text": "$348.00"
  },
  {
    "c0_text": "May 11",
    "c1_text": "Insurance \u00b7 Lloyds",
    "c3_text": "RBC checking",
    "c4_text": "$1,040.00"
  },
  {
    "c0_text": "May 10",
    "c1_text": "Truck 02 service",
    "c3_text": "RBC checking",
    "c4_text": "$840.00"
  }
],
  rows6: [
  {
    "c0_text": "May 22",
    "c1_text": "Admin",
    "c3_text": "Office supplies \u00b7 Staples",
    "c4_text": "\u2212C$32.40",
    "c6_name": "C$385.60"
  },
  {
    "c0_text": "May 21",
    "c1_text": "A. Haylton",
    "c3_text": "Coffee for crew \u00b7 Tim Hortons",
    "c4_text": "\u2212C$24.80",
    "c6_name": "C$418.00"
  },
  {
    "c0_text": "May 18",
    "c1_text": "Admin",
    "c3_text": "Bank float top-up",
    "c4_text": "+C$200.00",
    "c6_name": "C$442.80"
  },
  {
    "c0_text": "May 14",
    "c1_text": "A. Zu",
    "c3_text": "Toll \u00b7 Hwy 407",
    "c4_text": "\u2212C$18.60",
    "c6_name": "C$242.80"
  },
  {
    "c0_text": "May 13",
    "c1_text": "P. Rai",
    "c3_text": "Parking \u00b7 Mississauga",
    "c4_text": "\u2212C$6.00",
    "c6_name": "C$261.40"
  },
  {
    "c0_text": "May 12",
    "c1_text": "D. James",
    "c3_text": "Replacement straps",
    "c4_text": "\u2212C$24.20",
    "c6_name": "C$267.40"
  }
],
  rows5: [
  {
    "c1_text": "1",
    "c2_text": "C$176.00",
    "c3_text": "C$0.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$0.00",
    "c7_name": "C$176.00",
    "c9_text": "C$176.00",
    "c8_amount": "0.00"
  },
  {
    "c1_text": "1",
    "c2_text": "C$480.00",
    "c3_text": "C$0.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$0.00",
    "c7_name": "C$480.00",
    "c9_text": "C$480.00",
    "c8_amount": "0.00"
  },
  {
    "c1_text": "1",
    "c2_text": "C$75.00",
    "c3_text": "C$0.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$0.00",
    "c7_name": "C$75.00",
    "c9_text": "C$75.00",
    "c8_amount": "0.00"
  },
  {
    "c1_text": "6",
    "c2_text": "C$343.75",
    "c3_text": "C$0.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$0.00",
    "c7_name": "C$343.75",
    "c9_text": "C$343.75",
    "c8_amount": "0.00"
  },
  {
    "c1_text": "2",
    "c2_text": "C$546.25",
    "c3_text": "C$0.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$0.00",
    "c7_name": "C$546.25",
    "c9_text": "C$546.25",
    "c8_amount": "0.00"
  },
  {
    "c1_text": "11",
    "c2_text": "C$1,621.00",
    "c3_text": "C$0.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$0.00",
    "c7_name": "C$1,621.00",
    "c9_text": "C$1,621.00",
    "c8_amount": "0.00"
  }
],
  rows4: [
  {
    "c0_name": "Ryan Sinclair",
    "c1_text": "C$10,263.96"
  },
  {
    "c0_name": "Moving Papa Vancouver",
    "c1_text": "C$1,182.26"
  },
  {
    "c0_name": "Vartan Mazdak",
    "c1_text": "C$458.15"
  },
  {
    "c0_name": "Andrew Haylton",
    "c1_text": "C$418.40"
  },
  {
    "c0_name": "Sukhwinder Sing",
    "c1_text": "C$346.25"
  }
],
  rows3: [
  {
    "c1": "<b>Pay Period May 11 \u2013 May 24, 2026</b>",
    "c0_bg": "var(--surface-2)",
    "c0_fg": "var(--ink-2)",
    "c0_label": "Closed",
    "c2_text": "8",
    "c3_text": "C$290.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$290.00",
    "c7_btnLabel": "",
    "c7_btnDisplay": "none"
  },
  {
    "c0": "<span class=\"pill ok\">Open</span>",
    "c1": "<b>Pay April 26 \u2013 May 10</b>",
    "c2_text": "5",
    "c3_text": "C$1,621.00",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$1,621.00",
    "c7_btnLabel": "Close",
    "c7_btnDisplay": "inline-block"
  },
  {
    "c1": "<b>jan</b>",
    "c0_bg": "var(--surface-2)",
    "c0_fg": "var(--ink-2)",
    "c0_label": "Closed",
    "c2_text": "6",
    "c3_text": "C$351.75",
    "c4_text": "C$0.00",
    "c5_text": "C$0.00",
    "c6_text": "C$351.75",
    "c7_btnLabel": "",
    "c7_btnDisplay": "none"
  }
],
  rows2: [
  {
    "c0_name": "Revenue",
    "c1_text": "$76,840",
    "c2_text": "$71,210",
    "c3_text": "$82,400",
    "c4_text": "$79,680",
    "c5_name": "$94,210",
    "c6_name": "$404,340"
  },
  {
    "c0_name": "Local moves",
    "c1_text": "$38,420",
    "c2_text": "$35,640",
    "c3_text": "$41,200",
    "c4_text": "$39,840",
    "c5_name": "$47,105",
    "c6_name": "$202,205"
  },
  {
    "c0_name": "Long distance",
    "c1_text": "$19,210",
    "c2_text": "$17,802",
    "c3_text": "$20,600",
    "c4_text": "$19,920",
    "c5_name": "$23,553",
    "c6_name": "$101,085"
  },
  {
    "c0_name": "Commercial",
    "c1_text": "$11,526",
    "c2_text": "$10,681",
    "c3_text": "$12,360",
    "c4_text": "$11,952",
    "c5_name": "$14,131",
    "c6_name": "$60,650"
  },
  {
    "c0_name": "Boxes &amp; supplies",
    "c1_text": "$7,684",
    "c2_text": "$7,087",
    "c3_text": "$8,240",
    "c4_text": "$7,968",
    "c5_name": "$9,421",
    "c6_name": "$40,400"
  },
  {
    "c0_name": "Net revenue",
    "c1_text": "$74,890",
    "c2_text": "$69,180",
    "c3_text": "$80,440",
    "c4_text": "$77,500",
    "c5_name": "$92,790",
    "c6_name": "$394,800"
  },
  {
    "c0_name": "Cost of goods sold",
    "c1_text": "\u2212$18,440",
    "c2_text": "\u2212$17,180",
    "c3_text": "\u2212$19,820",
    "c4_text": "\u2212$21,100",
    "c5_name": "\u2212$22,840",
    "c6_name": "\u2212$99,380"
  },
  {
    "c0_name": "Gross profit",
    "c1_text": "$56,450",
    "c2_text": "$52,000",
    "c3_text": "$60,620",
    "c4_text": "$56,400",
    "c5_name": "$69,950",
    "c6_name": "$295,420"
  },
  {
    "c0_name": "Operating expenses",
    "c1_text": "\u2212$16,200",
    "c2_text": "\u2212$15,800",
    "c3_text": "\u2212$16,440",
    "c4_text": "\u2212$16,660",
    "c5_name": "\u2212$17,120",
    "c6_name": "\u2212$82,220"
  },
  {
    "c0_name": "Net profit",
    "c1_text": "$40,250",
    "c2_text": "$36,200",
    "c3_text": "$44,180",
    "c4_text": "$39,740",
    "c5_name": "$54,250",
    "c6_name": "$214,620"
  }
],
  kpis: [
  {
    "label": "",
    "value": "$54,250",
    "delta": ""
  },
  {
    "label": "Revenue",
    "value": "$94,210",
    "delta": ""
  },
  {
    "label": "Cost of goods sold",
    "value": "\u2212$22,840",
    "delta": "+8.1% (This Month)"
  },
  {
    "label": "Operating expenses",
    "value": "\u2212$17,120",
    "delta": ""
  },
  {
    "label": "Total \u00b7 MTD",
    "value": "$17,120",
    "delta": "82 entries"
  },
  {
    "label": "Largest category",
    "value": "Wages",
    "delta": "$8,420"
  },
  {
    "label": "Pending approval",
    "value": "5",
    "delta": ""
  },
  {
    "label": "Reimbursable",
    "value": "$420",
    "delta": ""
  },
  {
    "label": "RBC checking",
    "value": "$84,210",
    "delta": "primary operating"
  },
  {
    "label": "RBC savings",
    "value": "$48,420",
    "delta": "reserve"
  },
  {
    "label": "Visa \u2022\u2022\u2022\u2022 4242",
    "value": "\u2212$4,820",
    "delta": "due Jun 12"
  },
  {
    "label": "Unreconciled",
    "value": "8",
    "delta": ""
  },
  {
    "label": "HST collected \u00b7 Q2",
    "value": "$12,840",
    "delta": ""
  },
  {
    "label": "HST paid \u00b7 Q2",
    "value": "$3,420",
    "delta": ""
  },
  {
    "label": "Net remit \u00b7 Q2",
    "value": "$9,420",
    "delta": "due Jul 31"
  },
  {
    "label": "Last filing",
    "value": "Q1 2026",
    "delta": ""
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "May 2026 · books closed through Apr",
    "counts": { "receivables": 5, "payables": 2 },
    "stats": {
      "revenue": "$128,400", "revenueDelta": "14%",
      "netMargin": "$78,250", "netMarginSub": "61% margin",
      "ar": "$8,420", "arSub": "5 invoices · 2 overdue",
      "cash": "$248,300", "cashSub": "across 3 accounts"
    },
    "pnl": [
      { "label": "Revenue",            "labelStyle": "font-weight:600;", "labelClass": "", "may": "$128,400", "valStyle": "font-weight:600;", "valClass": "", "apr": "$112,300", "aprClass": "", "ytd": "$542,800", "ytdClass": "", "pct": "100%", "pctStyle": "", "pctClass": "", "rowStyle": "" },
      { "label": "— Local moves",      "labelStyle": "", "labelClass": "cell-light", "may": "$84,200", "valStyle": "", "valClass": "cell-light", "apr": "$71,400", "aprClass": "cell-light", "ytd": "$348,600", "ytdClass": "cell-light", "pct": "66%", "pctStyle": "", "pctClass": "cell-light", "rowStyle": "" },
      { "label": "— Long distance",    "labelStyle": "", "labelClass": "cell-light", "may": "$28,400", "valStyle": "", "valClass": "cell-light", "apr": "$24,800", "aprClass": "cell-light", "ytd": "$118,200", "ytdClass": "cell-light", "pct": "22%", "pctStyle": "", "pctClass": "cell-light", "rowStyle": "" },
      { "label": "— Box delivery",     "labelStyle": "", "labelClass": "cell-light", "may": "$8,600",  "valStyle": "", "valClass": "cell-light", "apr": "$9,200",  "aprClass": "cell-light", "ytd": "$42,300",  "ytdClass": "cell-light", "pct": "7%",  "pctStyle": "", "pctClass": "cell-light", "rowStyle": "" },
      { "label": "— Packing",          "labelStyle": "", "labelClass": "cell-light", "may": "$7,200",  "valStyle": "", "valClass": "cell-light", "apr": "$6,900",  "aprClass": "cell-light", "ytd": "$33,700",  "ytdClass": "cell-light", "pct": "5%",  "pctStyle": "", "pctClass": "cell-light", "rowStyle": "" },
      { "label": "Cost of services",   "labelStyle": "font-weight:600;", "labelClass": "", "may": "−$42,800", "valStyle": "font-weight:600;color:var(--bad);", "valClass": "", "apr": "−$38,400", "aprClass": "", "ytd": "−$184,200", "ytdClass": "", "pct": "33%", "pctStyle": "", "pctClass": "", "rowStyle": "" },
      { "label": "— Wages",            "labelStyle": "", "labelClass": "cell-light", "may": "−$32,400", "valStyle": "", "valClass": "cell-light", "apr": "−$29,100", "aprClass": "cell-light", "ytd": "−$142,600", "ytdClass": "cell-light", "pct": "25%", "pctStyle": "", "pctClass": "cell-light", "rowStyle": "" },
      { "label": "— Fuel & vehicle",   "labelStyle": "", "labelClass": "cell-light", "may": "−$6,200",  "valStyle": "", "valClass": "cell-light", "apr": "−$5,800",  "aprClass": "cell-light", "ytd": "−$24,800",  "ytdClass": "cell-light", "pct": "5%",  "pctStyle": "", "pctClass": "cell-light", "rowStyle": "" },
      { "label": "— Materials",        "labelStyle": "", "labelClass": "cell-light", "may": "−$4,200",  "valStyle": "", "valClass": "cell-light", "apr": "−$3,500",  "aprClass": "cell-light", "ytd": "−$16,800",  "ytdClass": "cell-light", "pct": "3%",  "pctStyle": "", "pctClass": "cell-light", "rowStyle": "" },
      { "label": "Operating expenses", "labelStyle": "font-weight:600;", "labelClass": "", "may": "−$7,350",  "valStyle": "font-weight:600;color:var(--bad);", "valClass": "", "apr": "−$6,900", "aprClass": "", "ytd": "−$32,200", "ytdClass": "", "pct": "6%", "pctStyle": "", "pctClass": "", "rowStyle": "" },
      { "label": "Net profit",         "labelStyle": "font-weight:700;", "labelClass": "", "may": "$78,250",  "valStyle": "font-weight:700;color:var(--ok);",   "valClass": "", "apr": "$67,000",  "aprClass": "", "ytd": "$326,400",  "ytdClass": "", "pct": "61%", "pctStyle": "font-weight:700;color:var(--ok);", "pctClass": "", "rowStyle": "background:var(--surface-2);" }
    ],
    "receivables": [
      { "avInitials": "RM", "avColor": "--bad",  "name": "Rosa Martinez",  "ref": "INV-2308", "amount": "$1,840", "due": "14d late",    "dueStyle": "color:var(--bad);font-weight:600;",  "dueClass": "" },
      { "avInitials": "TA", "avColor": "--warn", "name": "Tao Anand",      "ref": "INV-2306", "amount": "$2,210", "due": "6d late",     "dueStyle": "color:var(--bad);font-weight:600;",  "dueClass": "" },
      { "avInitials": "NS", "avColor": "--teal", "name": "Northside Co.",  "ref": "INV-2304", "amount": "$2,100", "due": "Due May 18",  "dueStyle": "color:var(--warn);",                  "dueClass": "" },
      { "avInitials": "JM", "avColor": "--info", "name": "Jordan Murphy",  "ref": "INV-2310", "amount": "$1,420", "due": "Due May 22",  "dueStyle": "",                                    "dueClass": "cell-light" },
      { "avInitials": "RC", "avColor": "--plum", "name": "Rebecca Chen",   "ref": "INV-2311", "amount": "$850",   "due": "Due May 26",  "dueStyle": "",                                    "dueClass": "cell-light" }
    ],
    "payables": [
      { "avInitials": "FE", "name": "Fleet Energy Co.",     "ref": "B-1827",        "amount": "$2,640", "due": "Due May 18",    "dueStyle": "color:var(--warn);font-weight:600;", "dueClass": "" },
      { "avInitials": "UH", "name": "U-Haul Toronto East",  "ref": "B-1828",        "amount": "$680",   "due": "Due May 21",    "dueStyle": "",                                    "dueClass": "cell-light" },
      { "avInitials": "PE", "name": "Penske Mississauga",   "ref": "B-1829",        "amount": "$1,540", "due": "Due May 25",    "dueStyle": "",                                    "dueClass": "cell-light" },
      { "avInitials": "SP", "name": "Stripe fees",          "ref": "May statement", "amount": "$1,820", "due": "Auto · May 31", "dueStyle": "",                                    "dueClass": "cell-light" }
    ],
    "transactions": [
      { "date": "May 16", "desc": "Stripe deposit · 14 transactions", "cat": "Revenue",   "catClass": "ok",   "account": "Operating", "amount": "+$8,420",  "amountStyle": "color:var(--ok);font-weight:600;" },
      { "date": "May 15", "desc": "A. Johnson · move deposit",        "cat": "Revenue",   "catClass": "ok",   "account": "Operating", "amount": "+$2,768",  "amountStyle": "color:var(--ok);" },
      { "date": "May 15", "desc": "Fleet Energy · weekly fuel",       "cat": "Vehicle",   "catClass": "",     "account": "Operating", "amount": "−$1,240",  "amountStyle": "" },
      { "date": "May 14", "desc": "Northside Co. · wire",             "cat": "Revenue",   "catClass": "ok",   "account": "Operating", "amount": "+$8,420",  "amountStyle": "color:var(--ok);" },
      { "date": "May 14", "desc": "Payroll · bi-weekly",              "cat": "Wages",     "catClass": "plum", "account": "Payroll",   "amount": "−$14,200", "amountStyle": "" },
      { "date": "May 13", "desc": "Box wholesale",                    "cat": "Materials", "catClass": "",     "account": "Operating", "amount": "−$2,140",  "amountStyle": "" },
      { "date": "May 12", "desc": "Insurance premium",                "cat": "Insurance", "catClass": "info", "account": "Operating", "amount": "−$1,860",  "amountStyle": "" }
    ]
  };
  F["jobCalendar"] = {
  selectedDay: {
    header: "Selected day",
    date:   "Sat, May 16",
    booked: {
      count: 3,
      items: [
        { time: "07:00", title: "Johnson — 3BR move",       sub: "Toronto → Hamilton · Team Alpha", pillKind: "job", pillLabel: "Booked", href: "#" },
        { time: "11:00", title: "Patel — Box delivery",      sub: "Mississauga · Team Blue",         pillKind: "job", pillLabel: "Booked", href: "#" },
        { time: "14:00", title: "Northside Co. — Commercial",sub: "Yorkville · Team Teal",           pillKind: "job", pillLabel: "Booked", href: "#" }
      ]
    },
    meetings: {
      count: 2,
      items: [
        { time: "09:00", title: "In-person estimate — K. Roberts", sub: "Vancouver · John Sales", pillKind: "meet", pillLabel: "In-person", href: "#" },
        { time: "13:00", title: "Virtual estimate — J. Lopez",     sub: "Zoom · John Sales",      pillKind: "meet", pillLabel: "Virtual",   href: "#" }
      ]
    },
    followups: {
      count: 2,
      items: [
        { time: "10:00", title: "Call back — H. Sandhu",  sub: "3-day lead follow-up · Priya Shah", pillKind: "fu", pillLabel: "Follow-up", href: "#" },
        { time: "16:00", title: "Send quote — D. Melnyk", sub: "Calgary lead · Jane Finance",        pillKind: "fu", pillLabel: "Task",      href: "#" }
      ]
    }
  },
  estimateTypeOptions: [{"value": "all", "label": "All"}, {"value": "in_person", "label": "In-person"}, {"value": "virtual", "label": "Virtual"}, {"value": "none", "label": "None"}],
  days: [
  {
    "num": "27",
    "class": "other",
    "kind": "none",
    "label": ""
  },
  {
    "num": "28",
    "class": "other",
    "kind": "none",
    "label": ""
  },
  {
    "num": "29",
    "class": "other",
    "kind": "none",
    "label": ""
  },
  {
    "num": "30",
    "class": "other",
    "kind": "none",
    "label": ""
  },
  {
    "num": "1",
    "class": "",
    "kind": "in-person",
    "label": "9a \u00b7 Johnson in-person",
    "assignedTo": "me",
    "overdue": false
  },
  {
    "num": "2",
    "class": "",
    "kind": "virtual",
    "label": "10a \u00b7 Chen virtual",
    "assignedTo": "unassigned",
    "overdue": false
  },
  {
    "num": "3",
    "class": "other",
    "kind": "in-person",
    "label": "8a \u00b7 Garcia in-person",
    "assignedTo": "me",
    "overdue": true
  },
  {
    "num": "5",
    "class": "",
    "kind": "job",
    "label": "10a \u00b7 Northside \u00b7 commercial",
    "assignedTo": "me",
    "overdue": false
  },
  {
    "num": "6",
    "class": "",
    "kind": "in-person",
    "label": "7a \u00b7 Clark in-person",
    "assignedTo": "unassigned",
    "overdue": false
  },
  {
    "num": "7",
    "class": "",
    "kind": "virtual",
    "label": "9a \u00b7 Reed virtual",
    "assignedTo": "unassigned",
    "overdue": true
  },
  {
    "num": "8",
    "class": "",
    "kind": "in-person",
    "label": "11a \u00b7 Mason in-person"
  },
  {
    "num": "9",
    "class": "",
    "kind": "job",
    "label": "7a \u00b7 Cox \u00b7 move"
  },
  {
    "num": "10",
    "class": "",
    "kind": "in-person",
    "label": "8a \u00b7 Ortiz in-person"
  },
  {
    "num": "12",
    "class": "",
    "kind": "virtual",
    "label": "11a \u00b7 Brown virtual"
  },
  {
    "num": "13",
    "class": "",
    "kind": "in-person",
    "label": "10a \u00b7 Khan in-person"
  },
  {
    "num": "14",
    "class": "",
    "kind": "virtual",
    "label": "9a \u00b7 Lee virtual"
  },
  {
    "num": "15",
    "class": "",
    "kind": "job",
    "label": "8a \u00b7 Foundry \u00b7 commercial"
  },
  {
    "num": "",
    "class": "",
    "kind": "job",
    "label": "7a \u00b7 Johnson \u00b7 move"
  },
  {
    "num": "17",
    "class": "",
    "kind": "virtual",
    "label": "10a \u00b7 Lee virtual"
  },
  {
    "num": "19",
    "class": "",
    "kind": "job",
    "label": "7a \u00b7 Chen \u00b7 long dist"
  },
  {
    "num": "20",
    "class": "",
    "kind": "job",
    "label": "8a \u00b7 Chen \u00b7 long dist"
  },
  {
    "num": "21",
    "class": "",
    "kind": "in-person",
    "label": "2p \u00b7 Mendez in-person"
  },
  {
    "num": "22",
    "class": "",
    "kind": "job",
    "label": "9a \u00b7 Diaz \u00b7 move"
  },
  {
    "num": "23",
    "class": "",
    "kind": "job",
    "label": "7a \u00b7 Park \u00b7 move"
  },
  {
    "num": "24",
    "class": "",
    "kind": "job",
    "label": "8a \u00b7 HQ Logistics"
  },
  {
    "num": "26",
    "class": "",
    "kind": "job",
    "label": "7a \u00b7 Singh \u00b7 move"
  },
  {
    "num": "27",
    "class": "",
    "kind": "job",
    "label": "9a \u00b7 Roy \u00b7 move"
  },
  {
    "num": "28",
    "class": "",
    "kind": "job",
    "label": "8a \u00b7 White \u00b7 move"
  },
  {
    "num": "29",
    "class": "",
    "kind": "job",
    "label": "11a \u00b7 Green \u00b7 boxes"
  },
  {
    "num": "30",
    "class": "",
    "kind": "job",
    "label": "7a \u00b7 Hall \u00b7 move"
  },
  {
    "num": "31",
    "class": "",
    "kind": "none",
    "label": ""
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "May 2026 · 48 jobs scheduled",
    "counts": { "all": 48, "surveys": 8, "moves": 32, "boxes": 6, "service": 2 },
    "legend": [
      { "color": "--terra", "label": "Move",         "count": 32 },
      { "color": "--warn",  "label": "Survey",       "count": 8 },
      { "color": "--info",  "label": "Box delivery", "count": 6 },
      { "color": "--plum",  "label": "Packing",      "count": 3 },
      { "color": "--teal",  "label": "Commercial",   "count": 4 }
    ],
    "upcoming": [
      { "dn": "Sat", "dd": "16", "title": "Alice Johnson · 3BR move",       "sub": "7:00 AM · Truck 1 · Toronto → Hamilton" },
      { "dn": "Sat", "dd": "16", "title": "Sara Patel · 30 boxes",          "sub": "11:00 AM · Van 1 · Mississauga" },
      { "dn": "Sat", "dd": "16", "title": "Joaquin Lopez · in-home survey", "sub": "1:00 PM · North York" },
      { "dn": "Sun", "dd": "17", "title": "No jobs scheduled",              "sub": "Quiet day" }
    ],
    "cells": {
      "d9pm": "3p Acme Co · commercial"
    }
  };
  F["jobDetail"] = {
  templates: {
    email: [
      { id: "1", name: "Initial outreach",         hotkey: "⌘1", category: "Outreach",
        subject: "Following up on your @ServiceType estimate",
        body: "Hi @Name,\nThanks for reaching out about your @ServiceType…",
        isDefault: true },
      { id: "2", name: "Follow-up after estimate", hotkey: "⌘2", category: "Follow-up",
        subject: "Quick follow-up on your estimate",
        body: "Hi @Name,\nJust checking in on the estimate I sent on @Date…",
        isDefault: false },
      { id: "3", name: "Booking confirmation",     hotkey: "⌘3", category: "Booking",
        subject: "Your booking is confirmed — @Date",
        body: "Hi @Name,\nYou're booked for @Date with @CrewSize movers…",
        isDefault: false },
      { id: "4", name: "Post-job thank you",       hotkey: "⌘4", category: "Closeout",
        subject: "Thanks for choosing us, @Name",
        body: "Hi @Name,\nThank you for trusting us with your move…",
        isDefault: false }
    ],
    text: [
      { id: "5", name: "Quick callback request", hotkey: "", category: "",
        subject: "", body: "Hi @Name — got a sec to chat about your @ServiceType? — @RepName",
        isDefault: false },
      { id: "6", name: "On-my-way", hotkey: "", category: "",
        subject: "", body: "Hi @Name, @RepName here — on my way, ETA @Time.",
        isDefault: false },
      { id: "7", name: "Booking confirmation", hotkey: "", category: "",
        subject: "", body: "Booked @Date · @CrewSize crew · @TruckSize truck · @HourlyRate/hr.",
        isDefault: false }
    ],
    callEmail: [
      { id: "1", name: "Initial outreach" },
      { id: "2", name: "Follow-up after estimate" },
      { id: "3", name: "Booking confirmation" }
    ],
    callText: [
      { id: "5", name: "Quick callback request" },
      { id: "6", name: "On-my-way" }
    ]
  },
  route: {
    origin: {
      city: "Toronto",
      addr: "142 King St W",
      addrShort: "142 King St W, Toronto, ON",
      addrFull:  "142 King St W, Toronto, ON M5H 1J9",
      cityAddr:  "Toronto · 142 King St W",
      heading:   "Origin · Toronto",
      access: { elevator: "—", floor: "—", longWalk: "No", stairs: "—" }
    },
    destination: {
      city: "Hamilton",
      addr: "88 James St N",
      addrShort: "88 James St N, Hamilton, ON",
      addrFull:  "88 James St N, Hamilton, ON L8R 2K3",
      cityAddr:  "Hamilton · 88 James St N",
      heading:   "Destination · Hamilton",
      access: { elevator: "—", floor: "—", longWalk: "No", stairs: "—" }
    },
    billing: "Same as origin",
    summary: "Local move · Toronto → Hamilton",
    totalDistance: "68 mi",
    travelHours:   "1h 25m",
    officeToOrigin: "8 mi · 18m",
    originToDest:   "52 mi · 56m",
    destToOffice:   "60 mi · 1h 10m"
  },
  metrics: {
  "kpi_cents": [
    ".50",
    ".00",
    ".00",
    ".50"
  ],
  "kpi_foot": [
    "Finalized",
    "Materials + fuel",
    "2 employees \u00b7 10h",
    "61.7% margin"
  ],
  "pay_amt": [
    "$10,850.00"
  ],
  "count": [
    "12",
    "7"
  ]
},
  kpis: [
  {
    "value": "1",
    "label": "Lifetime value"
  },
  {
    "value": "12",
    "label": "Deals"
  }
],
  jobDates: ["Jan 4, 2026"],
  headings: {
  "1": "Deal 17712-1 \u00b7 Rosa Martinez"
},
  matched: [],
  mutedCounts: {"0": "12"},
  preferredContactOptions2: [{"value": "phone", "label": "Phone"}, {"value": "email", "label": "Email"}, {"value": "sms", "label": "SMS"}],
  basisOptions: [{"value": "hard", "label": "Hard cap"}, {"value": "soft", "label": "Soft cap"}],
  statusOptions: [{"value": "hold", "label": "On hold"}],
  languageOptions: [{"value": "English", "label": "English"}, {"value": "French", "label": "French"}, {"value": "Spanish", "label": "Spanish"}, {"value": "Mandarin", "label": "Mandarin"}],
  preferredContactOptions: [{"value": "SMS", "label": "SMS"}, {"value": "Email", "label": "Email"}, {"value": "Phone call", "label": "Phone call"}],
  sourceOptions: [{"value": "Public Booking", "label": "Public Booking"}, {"value": "Google", "label": "Google"}, {"value": "Referral", "label": "Referral"}, {"value": "Repeat customer", "label": "Repeat customer"}, {"value": "Other", "label": "Other"}],
  moveSizeOptions: [{"value": "Studio", "label": "Studio"}, {"value": "1 Bedroom", "label": "1 Bedroom"}, {"value": "2 Bedroom", "label": "2 Bedroom"}, {"value": "3 Bedroom", "label": "3 Bedroom"}, {"value": "4+ Bedroom", "label": "4+ Bedroom"}, {"value": "Office", "label": "Office"}],
  assignedToOptions: [{"value": "Alex Morgan", "label": "Alex Morgan"}, {"value": "Vartan Mazdak", "label": "Vartan Mazdak"}, {"value": "Ryan Sinclair", "label": "Ryan Sinclair"}, {"value": "Jamie Liu", "label": "Jamie Liu"}],
  branchOptions: [{"value": "Toronto HQ", "label": "Toronto HQ"}, {"value": "Mississauga", "label": "Mississauga"}, {"value": "Hamilton", "label": "Hamilton"}, {"value": "Vancouver", "label": "Vancouver"}],
  typeOptions: [{"value": "Local", "label": "Local"}, {"value": "Long distance", "label": "Long distance"}, {"value": "Commercial", "label": "Commercial"}, {"value": "Box delivery", "label": "Box delivery"}, {"value": "Packing only", "label": "Packing only"}],
  dealSizeOptions: [{"value": "Medium", "label": "Medium"}, {"value": "Large", "label": "Large"}, {"value": "XL", "label": "XL"}],
  discoveryCallOptions: [{"value": "Email", "label": "Email"}, {"value": "Web form", "label": "Web form"}, {"value": "In-person", "label": "In-person"}, {"value": "Referral", "label": "Referral"}],
  applyToOptions: [{"value": "Order subtotal", "label": "Order subtotal"}, {"value": "Labour charges only", "label": "Labour charges only"}, {"value": "Materials only", "label": "Materials only"}, {"value": "Specific line item\u2026", "label": "Specific line item\u2026"}],
  reasonForLosingThisDealOptions: [{"value": "Price too high", "label": "Price too high"}, {"value": "Went with competitor", "label": "Went with competitor"}, {"value": "Date no longer works", "label": "Date no longer works"}, {"value": "Plans cancelled / no move", "label": "Plans cancelled / no move"}, {"value": "Unresponsive", "label": "Unresponsive"}, {"value": "Duplicate lead", "label": "Duplicate lead"}, {"value": "Not in service area", "label": "Not in service area"}, {"value": "Other", "label": "Other"}],
  roleOptions: [{"value": "Primary", "label": "Primary"}, {"value": "Secondary", "label": "Secondary"}, {"value": "Spouse / Partner", "label": "Spouse / Partner"}, {"value": "Referrer", "label": "Referrer"}, {"value": "Property manager", "label": "Property manager"}, {"value": "Other", "label": "Other"}],
  categoryOptions: [{"value": "Revenue", "label": "Revenue"}, {"value": "Discount", "label": "Discount"}, {"value": "Tax-exempt", "label": "Tax-exempt"}],
  chargeTypeOptions: [{"value": "Labor", "label": "Labor"}, {"value": "Travel", "label": "Travel"}, {"value": "Packing", "label": "Packing"}, {"value": "Material", "label": "Material"}, {"value": "Specialty", "label": "Specialty"}, {"value": "Other", "label": "Other"}],
  presetOptions: [{"value": "Standard 2-Man Hourly \u00b7 $140 / hr", "label": "Standard 2-Man Hourly \u00b7 $140 / hr"}, {"value": "Standard 3-Man Hourly \u00b7 $185 / hr", "label": "Standard 3-Man Hourly \u00b7 $185 / hr"}, {"value": "Travel Fee \u2014 Local \u00b7 $95", "label": "Travel Fee \u2014 Local \u00b7 $95"}, {"value": "Stairs (per flight) \u00b7 $25", "label": "Stairs (per flight) \u00b7 $25"}, {"value": "Long walk (&gt; 75 ft) \u00b7 $40", "label": "Long walk (&gt; 75 ft) \u00b7 $40"}, {"value": "Heavy item \u00b7 $75", "label": "Heavy item \u00b7 $75"}, {"value": "Piano Move \u00b7 $180", "label": "Piano Move \u00b7 $180"}],
  longCarryOptions: [{"value": "No", "label": "No"}, {"value": "Yes", "label": "Yes"}],
  elevatorOptions: [{"value": "Yes \u00b7 reservation required", "label": "Yes \u00b7 reservation required"}, {"value": "Yes", "label": "Yes"}, {"value": "No \u2014 stairs only", "label": "No \u2014 stairs only"}],
  propertyTypeOptions: [{"value": "House", "label": "House"}, {"value": "Apartment", "label": "Apartment"}, {"value": "Condo", "label": "Condo"}, {"value": "Storage unit", "label": "Storage unit"}, {"value": "Office", "label": "Office"}],
  optionsOptions6: [{"value": "Pickup", "label": "Pickup"}, {"value": "Drop-off", "label": "Drop-off"}, {"value": "Storage", "label": "Storage"}, {"value": "Halt / Break", "label": "Halt / Break"}],
  roleOnJobOptions: [{"value": "Team Leader", "label": "Team Leader"}, {"value": "Driver", "label": "Driver"}, {"value": "Mover", "label": "Mover"}, {"value": "Helper", "label": "Helper"}, {"value": "Packer", "label": "Packer"}],
  optionsOptions5: [{"value": "Ravi Patel \u00b7 Team Leader", "label": "Ravi Patel \u00b7 Team Leader"}, {"value": "Maya Chen \u00b7 Driver", "label": "Maya Chen \u00b7 Driver"}, {"value": "Tom Riley \u00b7 Mover", "label": "Tom Riley \u00b7 Mover"}, {"value": "Ben Foster \u00b7 Helper", "label": "Ben Foster \u00b7 Helper"}, {"value": "Sara Kim \u00b7 Mover", "label": "Sara Kim \u00b7 Mover"}],
  optionsOptions4: [{"value": "Toronto", "label": "Toronto"}, {"value": "Hamilton", "label": "Hamilton"}],
  optionsOptions3: [{"value": "Local", "label": "Local"}, {"value": "Long Distance", "label": "Long Distance"}, {"value": "Commercial", "label": "Commercial"}, {"value": "Labor Only", "label": "Labor Only"}, {"value": "Packing Only", "label": "Packing Only"}],
  optionsOptions2: [{"value": "Medium", "label": "Medium"}, {"value": "Large", "label": "Large"}, {"value": "Extra Large", "label": "Extra Large"}],
  optionsOptions: [{"value": "New lead", "label": "New lead"}, {"value": "Opportunity", "label": "Opportunity"}, {"value": "Tentative", "label": "Tentative"}, {"value": "Booked", "label": "Booked"}, {"value": "Confirmed", "label": "Confirmed"}, {"value": "Closed", "label": "Closed"}],
  rows: [
  {
    "c1_text": "Local move \u00b7 2 movers, 1 truck",
    "c2_text": "Jan 12, 2026",
    "c3_text": "$2,400.00",
    "c4_text": "$312.00",
    "c0_dotBg": "var(--terra)",
    "c0_text": "Labor"
  },
  {
    "c1_text": "Box delivery \u2014 30 boxes",
    "c2_text": "Jan 10, 2026",
    "c3_text": "$150.00",
    "c4_text": "$19.50",
    "c0_dotBg": "var(--info)",
    "c0_text": "Materials"
  },
  {
    "c1_text": "Wardrobe boxes \u00d74",
    "c2_text": "Jan 12, 2026",
    "c3_text": "$100.00",
    "c4_text": "$13.00",
    "c0_dotBg": "var(--info)",
    "c0_text": "Rentals"
  },
  {
    "c1_text": "Tim Walsh referral",
    "c2_text": "Jan 7, 2026",
    "c3_text": "\u2212$200.00",
    "c4_text": "\u2014",
    "c0_dotBg": "var(--bad)",
    "c0_text": "Discount"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, deal: {
  "customer": "Alice Johnson",
  "id": "17826-1",
  "sub": "Created Jan 4 \u00b7 Jan 12, 2026",
  "totalPays": "$2,768.50",
  "totalShort": "$2,768",
  "quoteTotal": "$2,450.00",
  "balanceAtJob": "$2,568.50",
  "deposit": "$200.00"
},
    customer: {
      name: "Alice Johnson",
      initials: "AJ",
      phone: "(555) 987-6543",
      email: "alice@techstartup.com",
      source: "Tim Walsh referral",
      referrer: "Tim Walsh",
      created: "Jan 4, 2026",
      lastContact: "Today · 9:43 AM",
      sinceLine: "Customer since Jan 4, 2026 · Referred by Tim Walsh",
      lifetimeValue: "$2,768",
      dealCount: "1",
      touchpoints: 12,
      firstJobNote: "No earlier deals — this is Alice's first job.",
      internalNote: "Referred by Tim Walsh (job #16204). 3-bedroom downtown apartment, no elevator on origin side. Sensitive about timing — needs to be out by 11 AM for landlord walkthrough.",
      statusPill: "Active customer",
      tags: ["VIP", "Downtown", "Referral"],
      availableTags: [
        { name: "VIP" }, { name: "Downtown" }, { name: "Referral" },
        { name: "First-time" }, { name: "Repeat" }, { name: "Commercial" },
        { name: "Long-distance" }, { name: "Storage" }, { name: "Packing-only" }
      ]
    },
    counts: { communication: "12", files: "7" },
    files: {
      photos: [
        { name: "Living room — survey",     sub: "Jan 6 · John Sales · 2.4 MB", gradient: "linear-gradient(135deg,#A8C0BB,#6E8B85)" },
        { name: "Master bedroom",           sub: "Jan 6 · John Sales · 1.9 MB", gradient: "linear-gradient(135deg,#D4C3A1,#A88E5E)" },
        { name: "Kitchen — fridge to move", sub: "Jan 6 · John Sales · 3.1 MB", gradient: "linear-gradient(135deg,#C9D3CB,#7E9389)" },
        { name: "Building entrance",        sub: "Jan 6 · John Sales · 1.6 MB", gradient: "linear-gradient(135deg,#8FA39A,#4E6A5F)" }
      ],
      pdfs: [
        { name: "Growth Plan #17826-1.pdf", sub: "Jan 7 · sent to customer · 412 KB" },
        { name: "Insurance certificate",    sub: "Jan 5 · Admin · 220 KB" }
      ],
      signed: [
        { name: "Service contract — signed", sub: "Jan 7 · signed by Alice J. · 380 KB" }
      ]
    },
    financials: {
      revenue: "$2,768", revenueCents: ".50", revenueNote: "Finalized",
      cost: "$640", costCents: ".00", costNote: "Materials + fuel",
      wages: "$420", wagesCents: ".00", wagesNote: "2 employees · 10h",
      margin: "$1,708", marginCents: ".50", marginNote: "61.7% margin"
    },
    accountingRows: [
      { rowClass: "",            catColor: "var(--terra)", category: "Labor",     description: "Local move · 2 movers, 1 truck", date: "Jan 12, 2026", amount: "$2,400.00", tax: "$312.00" },
      { rowClass: "",            catColor: "var(--info)",  category: "Materials", description: "Box delivery — 30 boxes",         date: "Jan 10, 2026", amount: "$150.00",   tax: "$19.50"  },
      { rowClass: "",            catColor: "var(--info)",  category: "Rentals",   description: "Wardrobe boxes ×4",               date: "Jan 12, 2026", amount: "$100.00",   tax: "$13.00"  },
      { rowClass: "gp-discount", catColor: "var(--bad)",   category: "Discount",  description: "Tim Walsh referral",              date: "Jan 7, 2026",  amount: "−$200.00",  tax: "—"       }
    ],
    accountingTotals: {
      subtotal: "$2,450.00",
      tax: "$344.50",
      customerPays: "$2,768.50"
    },
    payment: {
      sub: "May 1, 2026 · 3:23 AM · ch_1234567890abcdef",
      amount: "$10,850.00"
    },
    payments: [
      { method: "Credit card", kind: "Deposit", sub: "May 1, 2026 · 3:23 AM · ch_1234567890abcdef", amount: 10850 }
    ],
    paymentsEmpty: "No payments yet.",
    timeline: {
      salesRep: "John Sales",
      composerPlaceholder: "Reply to Alice — she'll get this as an SMS from (555) 200-0143.",
      noteAuthor: "John Sales · Jan 4, 11:02 AM",
      callOutboundBy: "John Sales called Alice",
      smsInboundBy: "Alice → John Sales",
      smsOutboundBy: "John Sales → Alice",
      noteBy: "John Sales",
      leadAssignedTo: "John Sales",
      filterCalls: "Calls 3",
      filterSms: "SMS 5",
      filterEmail: "Email 2",
      filterNotes: "Notes 2",
      daySections: [
        {
          label: "Today · Jan 8, 2026",
          items: [
            { kind: "call",    kindLabel: "Outbound call", arrow: "→", by: "John Sales called Alice", body: "Confirmed Jan 12 7:00 AM window. Customer asked about packing add-on — sent her the box delivery FAQ. Will follow up Wednesday.", time: "9:43 AM" },
            { kind: "sms",     kindLabel: "SMS",           arrow: "←", by: "Alice → John Sales",        body: "Sounds good. Tim said you guys were great with his move last fall — looking forward to it.", time: "9:38 AM" },
            { kind: "sms",     kindLabel: "SMS",           arrow: "→", by: "John Sales → Alice",        body: "Hi Alice — just confirming your move for Jan 12 at 7 AM. Two movers, one truck.", time: "9:35 AM" }
          ]
        },
        {
          label: "Wed · Jan 7, 2026",
          items: [
            { kind: "mail", kindLabel: "Email sent", arrow: "→", by: "Discovery call confirmation", body: "Your move with Service1 — Jan 12 7:00 AM", time: "2:20 PM" },
            { kind: "note", kindLabel: "Note",      arrow: "",  by: "John Sales",                   body: "Referred by Tim Walsh (job #16204). 3-bedroom downtown apartment.", time: "11:02 AM" }
          ]
        }
      ],
      callDuration: "4m 12s",
      callTime: "9:43 AM",
      callText: "Confirmed Jan 12 7:00 AM window. Customer asked about packing add-on — sent her the box delivery FAQ. Will follow up Wednesday.",
      smsInTime: "9:38 AM",
      smsInText: "Sounds good. Tim said you guys were great with his move last fall — looking forward to it. One quick Q: do you bring wardrobe boxes or do I need to grab my own?",
      smsOutTime: "9:35 AM",
      smsOutText: "Hi Alice — just confirming your move for Jan 12 at 7 AM. Two movers, one truck. We'll text 30 min before arrival. Reply Y to confirm 👍",
      emailTime: "2:20 PM",
      emailSubject: "Your move with Service1 — Jan 12 7:00 AM",
      emailPreview: "Hi Alice, looking forward to helping with your move. Attached is your growth plan and a checklist of everything to have ready the morning of…",
      emailAttach1: "📎 Growth Plan #17826-1.pdf",
      emailAttach2: "📎 Move-day checklist.pdf",
      noteTime: "11:02 AM",
      systemLeadText: "Lead created from website form · assigned to ",
      systemLeadAt: "Jan 4 · 10:00 AM"
    },
    user: { name: "Admin user", initials: "A" },
    header: {
      dealLabel: "Deal · 17826-1",
      statusPill: "Scheduled",
      claimPill: "Unclaimed",
      serviceDateTime: "Mon, Jan 12, 2026 · 7:00 AM EST",
      followupCta: "+ Set follow-up"
    },
    claim: {
      title: "This lead isn't claimed yet.",
      sub: "Follow-up reminders won't show in anyone's bell until claimed."
    },
    contacts: {
      primaryInitials: "AJ",
      primaryRole: "Primary",
      referrerInitials: "TW",
      referrerRole: "Referrer"
    },
    jobInfo: {
      fileNumber: "17826-1",
      serviceDateShort: "Mon, Jan 12 · 7:00 AM",
      discoveryCall: "Phone call",
      dealSize: "Small",
      sqFootage: "—",
      type: "Local",
      branch: "Unassigned",
      assignedTo: "Unassigned",
      estimatedHours: 2,
      serviceDateInput: "2026-01-12T07:00"
    },
    schedule: {
      bookedTime: "Mon, Jan 12 · 7:00 AM EST"
    },
    payment2: {
      sub: "May 1, 2026 · 3:23 AM · ch_1234567890abcdef"
    },
    finalize: {
      discountsApplied: "−$200.00",
      taxLabel: "Tax (HST 13%)",
      taxAmount: "$344.50",
      depositLabel: "Deposit (Jan 7)",
      balanceLabel: "Balance at job (Jan 12)",
      materials: "$250.00",
      fuel: "$98.00",
      wagesLine: "$420.00",
      wagesDesc: "Wages (2 movers · 5h each)",
      totalCost: "$768.00",
      netMargin: "$1,708.50 (61.7%)",
      photosCheck: "All photos uploaded (12 of 12)"
    },
    inboxItems: [
      { t: "New email from Vishal persaud", s: "Re: We received your quote request", m: "1 d ago" },
      { t: "New email from Namwon", s: "Re: We received your quote request", m: "1 d ago" },
      { t: "New SMS from Saw Yu Nandar", s: "It was a bit urgent", m: "5/1/2026" },
      { t: "New SMS from Saw Yu Nandar", s: "I moved yesterday", m: "5/1/2026" },
      { t: "New SMS from Saw Yu Nandar", s: "Ooh it is okay now", m: "5/1/2026" },
      { t: "New SMS from Jaiden Bryant", s: "i just wanted to look into a quote but…", m: "5/1/2026" },
      { t: "New SMS from Jaiden Bryant", s: "hey there! sorry i was busy and couldn't…", m: "5/1/2026" },
      { t: "New SMS from Christy L", s: "Hi Ryan! Sorry I'm at work right now …", m: "4/30/2026" },
      { t: "New email from Shelise Woods", s: "Re: We received your booking request", m: "4/30/2026" }
    ],
    leadFeed: [
      { claimSym: "", t: "Deposit received: $100.00 from Kimberly Jung", s: "$100.00 deposit paid · Invoice DEP-00128", m: "7 h ago" },
      { claimSym: "", t: "Estimate accepted by Kimberly Jung", s: "Estimate QT-00375 accepted · $718.00", m: "7 h ago" },
      { claimSym: "+", t: "New Lead", s: "Kathryn Hepburn (calgarykathryn@gmail.com)", m: "7 h ago" },
      { claimSym: "+", t: "New Lead", s: "Hilary O (hils.mims@gmail.com) submitted a quote request", m: "8 h ago" },
      { claimSym: "+", t: "New Lead", s: "Joyleez Lopez peters (joyleezpeters@…)", m: "8 h ago" },
      { claimSym: "+", t: "New Lead", s: "Priscila Vega (priscilavega2100@gmail.com)", m: "8 h ago" },
      { claimSym: "+", t: "New Lead", s: "Russ Uschakov (uschakovruslan@gmail.com)", m: "9 h ago" },
      { claimSym: "+", t: "New Lead", s: "Richard Petersen (crona21@shaw.ca)", m: "9 h ago" }
    ],
    reminders: {
      followups: [
        { title: "Urgent: Lead not called", tag: "Reminder", tagCls: "warn", scope: "Lead J2026-0549", due: "Today", sub: "hasn't been called after 573 minutes" },
        { title: "Urgent: Lead not called", tag: "Reminder", tagCls: "warn", scope: "Lead J2026-0550", due: "Today", sub: "hasn't been called after 412 minutes" },
        { title: "Send follow-up · Arlyn", tag: "Follow-up", tagCls: "", scope: "Estimate QT-00377", due: "Tomorrow · 9:00 AM", sub: "Estimate sent May 21 — no response in 24h." },
        { title: "Check deposit · Kimberly", tag: "Follow-up", tagCls: "", scope: "Booking BK-00091", due: "May 23", sub: "Confirm crew & assigned vehicle." }
      ],
      remList: [
        { title: "Call back · Hilary O", scope: "Lead J2026-0561", due: "Today 4:30 PM" },
        { title: "Review crew handoff", scope: "Job J2026-0540", due: "Today 5:00 PM" }
      ],
      tickets: [
        { title: "Damaged item · Hess move", tagCls: "err", scope: "Ticket #4429", due: "Open · 2d", sub: "Customer reports a scratched dresser. Awaiting photos." },
        { title: "Late arrival · Mungai crew", tagCls: "warn", scope: "Ticket #4431", due: "Open · 4h", sub: "" }
      ]
    },
    financials2: {
      costValue: "$640",
      wagesValue: "$420",
      marginValue: "$1,708",
      taxAmount: "$344.50"
    }
  };
  F["preOfficeSubmissions"] = {
  rows: [{"id": 1, "who": "Andrew Haylton", "role": "Team Lead", "tpl": "Standard End-of-Day", "submitted": "Today 5:48 PM", "items": "22/22", "gps": "On site", "status": "submitted", "flagged": false}, {"id": 2, "who": "Donald James", "role": "Team Lead", "tpl": "Standard End-of-Day", "submitted": "Today 5:52 PM", "items": "22/22", "gps": "On site", "status": "reviewed", "flagged": false}, {"id": 3, "who": "Fred Waite", "role": "Team Lead", "tpl": "Standard End-of-Day", "submitted": "Today 4:58 PM", "items": "22/22", "gps": "On site", "status": "submitted", "flagged": false}, {"id": 4, "who": "Paul Rai", "role": "Driver", "tpl": "Standard End-of-Day", "submitted": "Today 5:01 PM", "items": "14/14", "gps": "2.4 km from yard", "status": "flagged", "flagged": true}, {"id": 5, "who": "Alex Zu", "role": "Driver", "tpl": "Standard End-of-Day", "submitted": "Today 5:14 PM", "items": "17/18", "gps": "On site", "status": "flagged", "flagged": true}, {"id": 6, "who": "Jackson Mungai", "role": "Mover", "tpl": "Standard End-of-Day", "submitted": "Today 5:22 PM", "items": "14/14", "gps": "On site", "status": "submitted", "flagged": false}, {"id": 7, "who": "Gurtsik Ann", "role": "Helper", "tpl": "Standard End-of-Day", "submitted": "Today 5:38 PM", "items": "13/14", "gps": "On site", "status": "reviewed", "flagged": false}, {"id": 8, "who": "Maya Kapoor", "role": "Driver", "tpl": "Standard End-of-Day", "submitted": "Yesterday", "items": "17/18", "gps": "On site", "status": "rejected", "flagged": false}],
  statusOptions: [{"value": "Submitted", "label": "Submitted"}, {"value": "Reviewed", "label": "Reviewed"}, {"value": "Flagged", "label": "Flagged"}, {"value": "Rejected", "label": "Rejected"}],
  summary: "Pre-Office Submissions",
  subtitle: "Review crew pre-office-leaving checklist submissions",
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "header": { "subtitle": "Submissions · today", "range": "Today" },
    "tabs": { "templates": 6, "submissions": 142, "flagged": 3 },
    "stats": {
      "submitted": { "value": 11, "suffix": "/12", "delta": "92% on time" },
      "flagged":   { "value": 3, "delta": "need review" },
      "avgTime":   { "value": 4, "unit": "m", "delta": "all roles" },
      "late":      { "value": 5, "delta": "2 from same person" }
    },
    "chips": [
      { "label": "All",          "count": 11, "active": "active" },
      { "label": "Movers",       "count": 4,  "active": "" },
      { "label": "Drivers",      "count": 2,  "active": "" },
      { "label": "Team Leaders", "count": 3,  "active": "" },
      { "label": "Sales",        "count": 1,  "active": "" },
      { "label": "Admin",        "count": 1,  "active": "" }
    ],
    "submissions": [
      { "initials": "AH", "avColor": "terra", "name": "Andrew Haylton", "role": "Team Leader", "template": "Team Leader pre-shift", "submitted": "6:48 AM", "submittedStyle": "", "duration": "3m 42s", "status": "Complete", "statusPill": "ok", "items": "22/22" },
      { "initials": "DJ", "avColor": "info", "name": "Donald James", "role": "Team Leader", "template": "Team Leader pre-shift", "submitted": "6:52 AM", "submittedStyle": "", "duration": "3m 18s", "status": "Complete", "statusPill": "ok", "items": "22/22" },
      { "initials": "JM", "avColor": "teal", "name": "Jackson Mungai", "role": "Mover", "template": "Mover daily check-in", "submitted": "6:42 AM", "submittedStyle": "", "duration": "2m 04s", "status": "Complete", "statusPill": "ok", "items": "14/14" },
      { "initials": "PR", "avColor": "plum", "name": "Paul Rai", "role": "Mover", "template": "Mover daily check-in", "submitted": "6:39 AM", "submittedStyle": "", "duration": "2m 32s", "status": "Flagged · sleep", "statusPill": "warn", "items": "14/14" },
      { "initials": "AZ", "avColor": "info", "name": "Alex Zu", "role": "Driver", "template": "Driver vehicle inspection", "submitted": "6:51 AM", "submittedStyle": "", "duration": "5m 08s", "status": "Flagged · tire pressure", "statusPill": "warn", "items": "17/18" },
      { "initials": "JS", "avColor": "gold", "name": "John Sales", "role": "Sales", "template": "Sales rep morning standup", "submitted": "8:52 AM", "submittedStyle": "", "duration": "1m 48s", "status": "Complete", "statusPill": "ok", "items": "8/8" },
      { "initials": "GA", "avColor": "ink-3", "name": "Gurtsik Ann", "role": "Helper", "template": "Mover daily check-in", "submitted": "7:32 AM · late", "submittedStyle": "color:var(--bad);font-weight:600;", "duration": "2m 11s", "status": "Late", "statusPill": "bad", "items": "14/14" },
      { "initials": "A",  "avColor": "plum", "name": "Admin User", "role": "Office", "template": "Office reception opening", "submitted": "7:58 AM", "submittedStyle": "", "duration": "3m 24s", "status": "Complete", "statusPill": "ok", "items": "10/10" },
      { "initials": "FW", "avColor": "teal", "name": "Fred Waite", "role": "Team Leader", "template": "Team Leader pre-shift", "submitted": "6:58 AM", "submittedStyle": "", "duration": "3m 56s", "status": "Complete", "statusPill": "ok", "items": "22/22" }
    ]
  };
  F["preOfficeTemplates"] = {
  summary: "Pre-Office Templates",
  subtitle: "Configure checklists crew members must complete before leaving the office",
  rows: [
  {
    "c1_text": "22",
    "c3_text": "Yes",
    "c6_text": "May 15, 2026",
    "c0_name": "Standard End-of-Day",
    "c0_subCls": "pofc-muted",
    "c0_sub": "Default pre-office-leaving checklist for all crew"
  },
  {
    "c1_text": "18",
    "c3_text": "Yes",
    "c6_text": "May 09, 2026",
    "c0_name": "Driver vehicle inspection",
    "c0_subCls": "pofc-muted",
    "c0_sub": "Detailed pre-shift vehicle check for drivers"
  },
  {
    "c1_text": "22",
    "c3_text": "Yes",
    "c6_text": "May 02, 2026",
    "c0_name": "Team Lead end-of-day",
    "c0_subCls": "pofc-muted",
    "c0_sub": "Crew status sign-off, truck inventory, photos"
  },
  {
    "c1_text": "10",
    "c3_text": "Yes",
    "c6_text": "Apr 22, 2026",
    "c0_name": "Office reception opening",
    "c0_subCls": "pofc-muted",
    "c0_sub": "Daily morning checklist for the office team"
  },
  {
    "c1_text": "14",
    "c3_text": "Yes",
    "c6_text": "Apr 18, 2026",
    "c0_name": "Helper / mover daily check-in",
    "c0_subCls": "pofc-muted",
    "c0_sub": "Sleep, fitness, gear ready"
  },
  {
    "c1_text": "8",
    "c3_text": "Yes",
    "c6_text": "Apr 04, 2026",
    "c0_name": "Sales rep morning standup",
    "c0_subCls": "pofc-muted",
    "c0_sub": "Lead reviews, day plan, follow-ups"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "header": { "activeCount": 6 },
    "tabs": { "templates": 6, "submissions": 142 },
    "stats": {
      "active":     { "value": 6, "delta": "across 4 roles" },
      "weekSubs":   { "value": 42, "pct": "12%", "delta": "vs last week" },
      "compliance": { "value": 98, "unit": "%", "delta": "all teams reporting" }
    },
    "templates": [
      { "name": "Mover daily check-in",       "meta": "v4.2 · updated May 8", "role": "Mover",       "rolePill": "terra", "frequency": "Daily · before 7 AM",       "items": 14, "lastSubmission": "Today 6:42 AM", "compliance": "99%",  "complianceColor": "ok" },
      { "name": "Team Leader pre-shift",      "meta": "v3.0",                  "role": "Team Leader", "rolePill": "terra", "frequency": "Daily · before 7 AM",       "items": 22, "lastSubmission": "Today 6:48 AM", "compliance": "98%",  "complianceColor": "ok" },
      { "name": "Driver vehicle inspection",  "meta": "v2.1",                  "role": "Driver",      "rolePill": "info",  "frequency": "Daily · before each shift", "items": 18, "lastSubmission": "Today 6:51 AM", "compliance": "100%", "complianceColor": "ok" },
      { "name": "Sales rep morning standup",  "meta": "v1.4",                  "role": "Sales",       "rolePill": "info",  "frequency": "Daily · before 9 AM",       "items": 8,  "lastSubmission": "Today 8:52 AM", "compliance": "87%",  "complianceColor": "warn" },
      { "name": "Office reception opening",   "meta": "v2.0",                  "role": "Admin",       "rolePill": "plum",  "frequency": "Daily · before 8 AM",       "items": 10, "lastSubmission": "Today 7:58 AM", "compliance": "100%", "complianceColor": "ok" },
      { "name": "Weekly safety review",       "meta": "v1.2",                  "role": "Manager",     "rolePill": "warn",  "frequency": "Weekly · Monday",           "items": 12, "lastSubmission": "Mon May 11",    "compliance": "100%", "complianceColor": "ok" }
    ]
  };
  F["qualityControl"] = {
  metrics: {
  "qc_kpi_val": [
    "142",
    "11",
    "4",
    "4.6",
    "7"
  ]
},
  rows: [
  {
    "c0_name": "Alice Johnson",
    "c0_extra": "3BR move",
    "c1_text": "John Sales",
    "c2_text": "96",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "Today 11:18 AM"
  },
  {
    "c0_name": "Northside Co.",
    "c0_extra": "commercial",
    "c1_text": "Jane Finance",
    "c2_text": "94",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "Today 9:42 AM"
  },
  {
    "c0_name": "Rebecca Chen",
    "c0_extra": "long distance",
    "c1_text": "John Sales",
    "c2_text": "78",
    "c3_cls": "warn",
    "c3_label": "At Risk",
    "c4_text": "Yesterday"
  },
  {
    "c0_name": "Tao Anand",
    "c0_extra": "packing",
    "c1_text": "Andrew Haylton",
    "c2_text": "62",
    "c3_cls": "bad",
    "c3_label": "Non-compliant",
    "c4_text": "Yesterday"
  },
  {
    "c0_name": "Maple Court Condos",
    "c0_extra": "",
    "c1_text": "Paul Rai",
    "c2_text": "98",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "2 days ago"
  }
],
  optionsOptions5: [{"value": "This month", "label": "This month"}, {"value": "This week", "label": "This week"}, {"value": "YTD", "label": "YTD"}],
  optionsOptions4: [{"value": "Status: Open", "label": "Status: Open"}, {"value": "Resolved", "label": "Resolved"}, {"value": "All", "label": "All"}],
  optionsOptions3: [{"value": "High", "label": "High"}, {"value": "Med", "label": "Med"}, {"value": "Low", "label": "Low"}],
  optionsOptions2: [{"value": "Compliant", "label": "Compliant"}, {"value": "At Risk", "label": "At Risk"}, {"value": "Non-compliant", "label": "Non-compliant"}],
  optionsOptions: [{"value": "John Sales", "label": "John Sales"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Paul Rai", "label": "Paul Rai"}],
  summary: "Quality Control",
  subtitle: "Sales call &amp; lead-handling compliance \u00b7 last 30 days",
  rows6: [
  {
    "c1_text": "38",
    "c2_text": "36 / 38",
    "c3_text": "94",
    "c4_text": "2",
    "c5_text": "4.8",
    "c6_text": "96%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--terra)",
    "c0_avInitials": "JS",
    "c0_name": "John Sales",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "28",
    "c2_text": "27 / 28",
    "c3_text": "96",
    "c4_text": "1",
    "c5_text": "4.7",
    "c6_text": "94%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--info)",
    "c0_avInitials": "JF",
    "c0_name": "Jane Finance",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "22",
    "c2_text": "18 / 22",
    "c3_text": "82",
    "c4_text": "3",
    "c5_text": "4.4",
    "c6_text": "88%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--teal)",
    "c0_avInitials": "AH",
    "c0_name": "Andrew Haylton",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "14",
    "c2_text": "12 / 14",
    "c3_text": "88",
    "c4_text": "1",
    "c5_text": "4.5",
    "c6_text": "92%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--plum)",
    "c0_avInitials": "PR",
    "c0_name": "Paul Rai",
    "c0_sub": "",
    "c0_dotCls": ""
  }
],
  rows5: [
  {
    "c0_name": "Missed 24h follow-up",
    "c1_text": "Cedar Lane HOA",
    "c2_text": "John Sales",
    "c4_text": "2h ago"
  },
  {
    "c0_name": "Discount &gt; 15% without manager approval",
    "c1_text": "Tao Anand",
    "c2_text": "Andrew Haylton",
    "c4_text": "Yesterday"
  },
  {
    "c0_name": "Required questions skipped (3 of 5)",
    "c1_text": "Rebecca Chen",
    "c2_text": "John Sales",
    "c4_text": "Yesterday"
  },
  {
    "c0_name": "No quote sent within SLA",
    "c1_text": "Pinewood Estates",
    "c2_text": "Paul Rai",
    "c4_text": "2 days ago"
  },
  {
    "c0_name": "Customer hung up &lt; 60s",
    "c1_text": "Sara Patel",
    "c2_text": "John Sales",
    "c4_text": "3 days ago"
  }
],
  rows4: [
  {
    "c0_name": "Alice Johnson",
    "c0_extra": "3BR move",
    "c1_text": "John Sales",
    "c2_text": "96",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "Standard sales call",
    "c5_text": "Today 11:18 AM",
    "c6_label": "View"
  },
  {
    "c0_name": "Northside Co.",
    "c0_extra": "commercial",
    "c1_text": "Jane Finance",
    "c2_text": "94",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "Commercial discovery",
    "c5_text": "Today 9:42 AM",
    "c6_label": "View"
  },
  {
    "c0_name": "Sara Patel",
    "c0_extra": "box delivery",
    "c1_text": "John Sales",
    "c2_text": "92",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "Standard sales call",
    "c5_text": "Today 9:14 AM",
    "c6_label": "View"
  },
  {
    "c0_name": "Joaquin Lopez",
    "c0_extra": "move",
    "c1_text": "John Sales",
    "c2_text": "90",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "Standard sales call",
    "c5_text": "Yesterday",
    "c6_label": "View"
  },
  {
    "c0_name": "Rebecca Chen",
    "c0_extra": "long distance",
    "c1_text": "John Sales",
    "c2_text": "78",
    "c3_cls": "warn",
    "c3_label": "At Risk",
    "c4_text": "Long distance specialty",
    "c5_text": "Yesterday",
    "c6_label": "View"
  },
  {
    "c0_name": "Tao Anand",
    "c0_extra": "packing",
    "c1_text": "Andrew Haylton",
    "c2_text": "62",
    "c3_cls": "bad",
    "c3_label": "Non-compliant",
    "c4_text": "Standard sales call",
    "c5_text": "Yesterday",
    "c6_label": "View"
  },
  {
    "c0_name": "Maple Court Condos",
    "c0_extra": "",
    "c1_text": "Paul Rai",
    "c2_text": "98",
    "c3_cls": "ok",
    "c3_label": "Compliant",
    "c4_text": "Commercial discovery",
    "c5_text": "2 days ago",
    "c6_label": "View"
  }
],
  rows3: [
  {
    "c1_text": "38",
    "c2_text": "36 / 38",
    "c3_text": "94",
    "c4_text": "2",
    "c5_text": "4.8",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--terra)",
    "c0_avInitials": "JS",
    "c0_name": "John Sales",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "28",
    "c2_text": "27 / 28",
    "c3_text": "96",
    "c4_text": "1",
    "c5_text": "4.7",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--info)",
    "c0_avInitials": "JF",
    "c0_name": "Jane Finance",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "22",
    "c2_text": "18 / 22",
    "c3_text": "82",
    "c4_text": "3",
    "c5_text": "4.4",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--teal)",
    "c0_avInitials": "AH",
    "c0_name": "Andrew Haylton",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "14",
    "c2_text": "12 / 14",
    "c3_text": "88",
    "c4_text": "1",
    "c5_text": "4.5",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--plum)",
    "c0_avInitials": "PR",
    "c0_name": "Paul Rai",
    "c0_sub": "",
    "c0_dotCls": ""
  }
],
  rows2: [
  {
    "c0_name": "Missed 24h follow-up",
    "c0_sub": "Lead: Cedar Lane HOA",
    "c1_text": "John Sales",
    "c2_text": "2h ago"
  },
  {
    "c0_name": "Discount &gt; 15% without manager approval",
    "c0_sub": "Lead: Tao Anand",
    "c1_text": "Andrew Haylton",
    "c2_text": "Yesterday"
  },
  {
    "c0_name": "Required questions skipped (3 of 5)",
    "c0_sub": "Call: Rebecca Chen",
    "c1_text": "John Sales",
    "c2_text": "Yesterday"
  },
  {
    "c0_name": "No quote sent within SLA",
    "c0_sub": "Lead: Pinewood Estates",
    "c1_text": "Paul Rai",
    "c2_text": "2 days ago"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "header": { "subtitle": "42 inspections · last 30 days", "range": "Last 30 days" },
    "tabs": { "inspections": 42, "issues": 4 },
    "stats": {
      "score":  { "value": 96, "unit": "%", "pct": "2 pts", "delta": "vs last month" },
      "passed": { "value": 38, "suffix": "/42", "delta": "90% pass rate" },
      "open":   { "value": 4, "delta": "2 require re-inspection" },
      "csat":   { "value": 4.8, "unit": "/ 5", "delta": "38 of 42 responses" }
    },
    "inspections": [
      { "job": "A. Johnson · 3BR move",       "deal": "Deal 17826-1", "team": "Truck 1", "teamPill": "terra", "inspector": "Jane F.",    "inspectorInitials": "JF", "inspectorColor": "info",  "score": "100%", "scoreColor": "ok",   "status": "Passed", "statusPill": "ok",   "date": "May 12" },
      { "job": "Northside Co. · commercial",  "deal": "Deal 17821-1", "team": "Truck 3", "teamPill": "teal",  "inspector": "Jane F.",    "inspectorInitials": "JF", "inspectorColor": "info",  "score": "98%",  "scoreColor": "ok",   "status": "Passed", "statusPill": "ok",   "date": "May 14" },
      { "job": "S. Patel · box delivery",     "deal": "Deal 17870-1", "team": "Van 1",   "teamPill": "info",  "inspector": "A. Haylton", "inspectorInitials": "AH", "inspectorColor": "terra", "score": "84%",  "scoreColor": "warn", "status": "Issues", "statusPill": "warn", "date": "May 11" },
      { "job": "T. Anand · packing",          "deal": "Deal 17800-1", "team": "Van 1",   "teamPill": "plum",  "inspector": "Jane F.",    "inspectorInitials": "JF", "inspectorColor": "info",  "score": "72%",  "scoreColor": "bad",  "status": "Failed", "statusPill": "bad",  "date": "May 8" },
      { "job": "R. Chen · long distance",     "deal": "Deal 17878-1", "team": "Truck 2", "teamPill": "terra", "inspector": "A. Haylton", "inspectorInitials": "AH", "inspectorColor": "terra", "score": "96%",  "scoreColor": "ok",   "status": "Passed", "statusPill": "ok",   "date": "May 6" },
      { "job": "M. Lee · packing prep",       "deal": "Deal 17880-1", "team": "Van 1",   "teamPill": "plum",  "inspector": "Jane F.",    "inspectorInitials": "JF", "inspectorColor": "info",  "score": "94%",  "scoreColor": "ok",   "status": "Passed", "statusPill": "ok",   "date": "May 4" }
    ],
    "issues": [
      { "issue": "Missing wardrobe boxes return", "count": 3, "pct": "7%" },
      { "issue": "Late arrival (> 15 min)",       "count": 2, "pct": "5%" },
      { "issue": "Minor furniture scuff",         "count": 2, "pct": "5%" },
      { "issue": "Incomplete packing inventory",  "count": 1, "pct": "2%" },
      { "issue": "Box count mismatch",            "count": 1, "pct": "2%" }
    ],
    "teams": [
      { "teamCode": "T1", "teamColor": "terra", "teamName": "Truck 1", "inspections": 12, "score": "98%", "scoreStyle": "color:var(--ok);font-weight:600;", "issues": 1 },
      { "teamCode": "T2", "teamColor": "info",  "teamName": "Truck 2", "inspections": 9,  "score": "96%", "scoreStyle": "color:var(--ok);font-weight:600;", "issues": 0 },
      { "teamCode": "T3", "teamColor": "teal",  "teamName": "Truck 3", "inspections": 10, "score": "94%", "scoreStyle": "",                                  "issues": 1 },
      { "teamCode": "V1", "teamColor": "plum",  "teamName": "Van 1",   "inspections": 11, "score": "88%", "scoreStyle": "color:var(--warn);font-weight:600;","issues": 2 }
    ]
  };
  F["reports"] = {
  formatOptions: [],
  subtitle: "27 reports across Sales \u00b7 Operations \u00b7 Accounting \u00b7 Marketing",
  rows: [
  {
    "name": "Daily revenue summary \u00b7 30d \u00b7 last run 9:00 AM"
  },
  {
    "name": "Crew utilization \u00b7 this week \u00b7 last run 6:00 AM"
  },
  {
    "name": "Customer NPS \u00b7 monthly \u00b7 scheduled tomorrow"
  },
  {
    "name": "Damage claims \u00b7 open \u00b7 last run yesterday"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "38 reports · 6 pinned",
    "counts": { "all": "38", "pinned": "6" },
    "reports": [
      { "iconBg": "var(--terra-soft)", "iconColor": "var(--terra)", "starColor": "var(--terra)", "starDisplay": "inline-block", "title": "Booked jobs by date", "desc": "Daily breakdown of confirmed bookings", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "pillLabel": "Sales" },
      { "iconBg": "var(--warn-soft)", "iconColor": "var(--warn)", "starColor": "var(--warn)", "starDisplay": "inline-block", "title": "Stale opportunities", "desc": "No activity in 7+ days, ranked by deal value", "pillBg": "var(--warn-soft)", "pillColor": "var(--warn)", "pillLabel": "Sales" },
      { "iconBg": "var(--bad-soft)", "iconColor": "var(--bad)", "starColor": "var(--bad)", "starDisplay": "none", "title": "Cancellations & lost deals", "desc": "Reasons and recovery opportunities", "pillBg": "var(--bad-soft)", "pillColor": "var(--bad)", "pillLabel": "Sales" },
      { "iconBg": "var(--info-soft)", "iconColor": "var(--info)", "starColor": "var(--info)", "starDisplay": "inline-block", "title": "Revenue by source", "desc": "Referral, web, ads, repeat breakdown", "pillBg": "var(--info-soft)", "pillColor": "var(--info)", "pillLabel": "Sales" },
      { "iconBg": "var(--plum-soft)", "iconColor": "var(--plum)", "starColor": "var(--plum)", "starDisplay": "none", "title": "Avg deal value trend", "desc": "Rolling 90-day with segment splits", "pillBg": "var(--plum-soft)", "pillColor": "var(--plum)", "pillLabel": "Sales" },
      { "iconBg": "var(--teal-soft)", "iconColor": "var(--teal)", "starColor": "var(--teal)", "starDisplay": "inline-block", "title": "Crew utilization", "desc": "Hours scheduled vs available per team", "pillBg": "var(--teal-soft)", "pillColor": "var(--teal)", "pillLabel": "Ops" },
      { "iconBg": "var(--ok-soft)", "iconColor": "var(--ok)", "starColor": "var(--ok)", "starDisplay": "none", "title": "On-time arrival rate", "desc": "% within 15 min of scheduled window", "pillBg": "var(--ok-soft)", "pillColor": "var(--ok)", "pillLabel": "Ops" },
      { "iconBg": "var(--warn-soft)", "iconColor": "var(--warn)", "starColor": "var(--warn)", "starDisplay": "none", "title": "Fuel & vehicle costs", "desc": "Per truck and per job cost analysis", "pillBg": "var(--warn-soft)", "pillColor": "var(--warn)", "pillLabel": "Ops" },
      { "iconBg": "var(--terra-soft)", "iconColor": "var(--terra)", "starColor": "var(--terra)", "starDisplay": "inline-block", "title": "P&L summary", "desc": "Revenue, COGS, opex, net by month", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "pillLabel": "Finance" },
      { "iconBg": "var(--bad-soft)", "iconColor": "var(--bad)", "starColor": "var(--bad)", "starDisplay": "none", "title": "A/R aging", "desc": "Receivables by 0-30, 30-60, 60-90, 90+", "pillBg": "var(--bad-soft)", "pillColor": "var(--bad)", "pillLabel": "Finance" },
      { "iconBg": "var(--plum-soft)", "iconColor": "var(--plum)", "starColor": "var(--plum)", "starDisplay": "none", "title": "Wages by employee", "desc": "Hourly, commission, overtime", "pillBg": "var(--plum-soft)", "pillColor": "var(--plum)", "pillLabel": "Finance" },
      { "iconBg": "var(--info-soft)", "iconColor": "var(--info)", "starColor": "var(--info)", "starDisplay": "inline-block", "title": "Sales tax remitted", "desc": "By province, jurisdiction, period", "pillBg": "var(--info-soft)", "pillColor": "var(--info)", "pillLabel": "Finance" }
    ]
  };
  F["safetyDashboard"] = {
  metrics: {
  "stat_delta": [
    "21 certs / 18 docs / 14 maint."
  ]
},
  severityOptions: [],
  optionsOptions4: [{"value": "Hard brake", "label": "Hard brake"}, {"value": "Speeding", "label": "Speeding"}],
  optionsOptions3: [{"value": "Truck 14", "label": "Truck 14"}, {"value": "Truck 09", "label": "Truck 09"}],
  optionsOptions2: [{"value": "Red", "label": "Red"}, {"value": "Amber", "label": "Amber"}, {"value": "Yellow", "label": "Yellow"}],
  optionsOptions: [{"value": "Hard brake", "label": "Hard brake"}, {"value": "Speeding", "label": "Speeding"}, {"value": "Lane departure", "label": "Lane departure"}, {"value": "Following distance", "label": "Following distance"}],
  summary: "Safety Dashboard",
  subtitle: "Fleet, drivers &amp; HOS compliance \u00b7 last 30 days",
  rows11: [
  {
    "c0_text": "Truck 09",
    "c1_text": "Alex Zu",
    "c2_text": "Toronto \u2192 Mississauga via QEW",
    "c3_text": "via Lakeshore",
    "c4_text": "+6 mi",
    "c5_text": "+22 min",
    "c6_text": "Today"
  },
  {
    "c0_text": "Truck 14",
    "c1_text": "Andrew Haylton",
    "c2_text": "Toronto \u2192 Hamilton via QEW",
    "c3_text": "via Hwy 403",
    "c4_text": "+2 mi",
    "c5_text": "+4 min",
    "c6_text": "Yesterday"
  },
  {
    "c0_text": "Van 03",
    "c1_text": "Paul Rai",
    "c2_text": "North York \u2192 Mississauga",
    "c3_text": "+1 unscheduled stop",
    "c4_text": "+11 mi",
    "c5_text": "+38 min",
    "c6_text": "2 days ago"
  },
  {
    "c0_text": "Truck 02",
    "c1_text": "Fred Waite",
    "c2_text": "Hamilton \u2192 Vaughan",
    "c3_text": "+1 unscheduled stop",
    "c4_text": "+4 mi",
    "c5_text": "+12 min",
    "c6_text": "3 days ago"
  }
],
  rows10: [
  {
    "c0_text": "Admin",
    "c1_text": "Alex Zu",
    "c2_text": "Speeding alert \u00b7 Today",
    "c3_text": "0:48",
    "c4_text": "10 min ago"
  },
  {
    "c0_text": "Admin",
    "c1_text": "Jackson Mungai",
    "c2_text": "HOS over cycle",
    "c3_text": "1:12",
    "c4_text": "1 hr ago"
  },
  {
    "c0_text": "Admin",
    "c1_text": "Paul Rai",
    "c2_text": "Following distance coaching",
    "c3_text": "0:34",
    "c4_text": "Yesterday"
  },
  {
    "c0_text": "Admin",
    "c1_text": "Andrew Haylton",
    "c2_text": "Recognition \u00b7 0 alerts streak",
    "c3_text": "0:22",
    "c4_text": "Yesterday"
  }
],
  rows9: [
  {
    "c0_text": "Andrew Haylton",
    "c1_text": "Truck 14",
    "c2_text": "7:14 AM",
    "c3_text": "In progress",
    "c4_text": "42 mi",
    "c5_text": "38 mph",
    "c6_text": "99"
  },
  {
    "c0_text": "Donald James",
    "c1_text": "Truck 09",
    "c2_text": "7:18 AM",
    "c3_text": "In progress",
    "c4_text": "38 mi",
    "c5_text": "42 mph",
    "c6_text": "96"
  },
  {
    "c0_text": "Alex Zu",
    "c1_text": "Truck 09",
    "c2_text": "6:51 AM",
    "c3_text": "In progress",
    "c4_text": "68 mi",
    "c5_text": "56 mph",
    "c6_text": "71"
  },
  {
    "c0_text": "Fred Waite",
    "c1_text": "Truck 02",
    "c2_text": "7:02 AM",
    "c3_text": "11:48 AM",
    "c4_text": "32 mi",
    "c5_text": "34 mph",
    "c6_text": "98"
  },
  {
    "c0_text": "Paul Rai",
    "c1_text": "Van 03",
    "c2_text": "6:42 AM",
    "c3_text": "In progress",
    "c4_text": "28 mi",
    "c5_text": "31 mph",
    "c6_text": "88"
  }
],
  rows8: [
  {
    "c1_text": "CAYK 421",
    "c4_text": "Sep 2026",
    "c0_name": "Truck 14",
    "c0_extra": "Ford F-450"
  },
  {
    "c1_text": "BTZN 884",
    "c4_text": "Aug 2026",
    "c0_name": "Truck 09",
    "c0_extra": "Ram 3500"
  },
  {
    "c1_text": "BBZR 110",
    "c4_text": "Jul 2026",
    "c0_name": "Van 03",
    "c0_extra": "Ford Transit"
  },
  {
    "c1_text": "AVTM 339",
    "c4_text": "Dec 2026",
    "c0_name": "Truck 02",
    "c0_extra": "Chevy"
  },
  {
    "c1_text": "CPNX 552",
    "c4_text": "Nov 2026",
    "c0_name": "Van 11",
    "c0_extra": "Mercedes Sprinter"
  },
  {
    "c1_text": "RNTM 248",
    "c4_text": "Jun 2026",
    "c0_name": "Truck 05",
    "c0_extra": "Service truck"
  }
],
  rows7: [
  {
    "c0_text": "RSI-2026-08",
    "c1_text": "May 11",
    "c2_text": "Truck 09",
    "c3_text": "Alex Zu",
    "c4_text": "MTO",
    "c6_text": "Tire pressure"
  },
  {
    "c0_text": "RSI-2026-07",
    "c1_text": "Apr 28",
    "c2_text": "Truck 14",
    "c3_text": "Andrew Haylton",
    "c4_text": "MTO",
    "c6_text": "\u2014"
  },
  {
    "c0_text": "RSI-2026-06",
    "c1_text": "Apr 14",
    "c2_text": "Van 03",
    "c3_text": "Paul Rai",
    "c4_text": "MTO",
    "c6_text": "\u2014"
  },
  {
    "c0_text": "RSI-2026-05",
    "c1_text": "Mar 22",
    "c2_text": "Truck 02",
    "c3_text": "Fred Waite",
    "c4_text": "WSIB",
    "c6_text": "\u2014"
  },
  {
    "c0_text": "RSI-2026-04",
    "c1_text": "Feb 18",
    "c2_text": "Truck 09",
    "c3_text": "Alex Zu",
    "c4_text": "MTO",
    "c6_text": "Brake pad wear"
  }
],
  rows6: [
  {
    "c0_text": "INC-2026-014",
    "c1_text": "May 12",
    "c2_text": "Strained back lifting upright piano",
    "c4_text": "Truck 1"
  },
  {
    "c0_text": "INC-2026-013",
    "c1_text": "May 08",
    "c2_text": "Minor finger laceration \u00b7 packing",
    "c4_text": "Van 1"
  },
  {
    "c0_text": "INC-2026-012",
    "c1_text": "May 02",
    "c2_text": "Slip on stairs (no injury)",
    "c4_text": "Truck 2"
  },
  {
    "c0_text": "INC-2026-011",
    "c1_text": "Apr 19",
    "c2_text": "Customer property scuff \u00b7 dining table",
    "c4_text": "Van 1"
  },
  {
    "c0_text": "INC-2026-010",
    "c1_text": "Apr 04",
    "c2_text": "Vehicle minor collision \u00b7 loading dock",
    "c4_text": "Truck 3"
  },
  {
    "c0_text": "INC-2026-009",
    "c1_text": "Mar 22",
    "c2_text": "Heat exhaustion \u00b7 break extended",
    "c4_text": "Truck 1"
  }
],
  rows5: [
  {
    "c0_name": "Andrew Haylton",
    "c2_text": "4h 22m / 11h",
    "c3_text": "8h 12m / 14h",
    "c4_text": "52h / 70h",
    "c5_dotBg": "var(--ok)",
    "c5_text": "Compliant"
  },
  {
    "c0_name": "Donald James",
    "c2_text": "5h 04m / 11h",
    "c3_text": "7h 48m / 14h",
    "c4_text": "48h / 70h",
    "c5_dotBg": "var(--ok)",
    "c5_text": "Compliant"
  },
  {
    "c0_name": "Alex Zu",
    "c2_text": "6h 18m / 11h",
    "c3_text": "9h 21m / 14h",
    "c4_text": "62h / 70h",
    "c5_dotBg": "var(--warn)",
    "c5_text": "Warning"
  },
  {
    "c0_name": "Jackson Mungai",
    "c2_text": "11h 40m / 11h",
    "c3_text": "14h 22m / 14h",
    "c4_text": "71h / 70h",
    "c5_dotBg": "var(--bad)",
    "c5_text": "Over cycle"
  },
  {
    "c0_name": "Paul Rai",
    "c2_text": "4h 11m / 11h",
    "c3_text": "8h 04m / 14h",
    "c4_text": "36h / 70h",
    "c5_dotBg": "var(--ok)",
    "c5_text": "Compliant"
  },
  {
    "c0_name": "Fred Waite",
    "c2_text": "3h 02m / 11h",
    "c3_text": "6h 14m / 14h",
    "c4_text": "28h / 70h",
    "c5_dotBg": "var(--ok)",
    "c5_text": "Compliant"
  }
],
  rows4: [
  {
    "c0_name": "1",
    "c1_name": "Andrew Haylton",
    "c2_text": "98",
    "c3_text": "58",
    "c4_text": "1,840",
    "c5_text": "0",
    "c6_text": "0",
    "c7_text": "0"
  },
  {
    "c0_name": "2",
    "c1_name": "Donald James",
    "c2_text": "96",
    "c3_text": "52",
    "c4_text": "1,620",
    "c5_text": "2",
    "c6_text": "0",
    "c7_text": "0"
  },
  {
    "c0_name": "3",
    "c1_name": "Fred Waite",
    "c2_text": "94",
    "c3_text": "44",
    "c4_text": "1,210",
    "c5_text": "3",
    "c6_text": "1",
    "c7_text": "0"
  },
  {
    "c0_name": "4",
    "c1_name": "Maya Kapoor",
    "c2_text": "91",
    "c3_text": "32",
    "c4_text": "848",
    "c5_text": "2",
    "c6_text": "1",
    "c7_text": "0"
  },
  {
    "c0_name": "5",
    "c1_name": "Jackson Mungai",
    "c2_text": "88",
    "c3_text": "26",
    "c4_text": "612",
    "c5_text": "4",
    "c6_text": "2",
    "c7_text": "0"
  },
  {
    "c0_name": "6",
    "c1_name": "Paul Rai",
    "c2_text": "82",
    "c3_text": "38",
    "c4_text": "1,104",
    "c5_text": "6",
    "c6_text": "2",
    "c7_text": "1"
  },
  {
    "c0_name": "7",
    "c1_name": "Alex Zu",
    "c2_text": "71",
    "c3_text": "42",
    "c4_text": "1,318",
    "c5_text": "11",
    "c6_text": "5",
    "c7_text": "2"
  }
],
  rows3: [
  {
    "c0_text": "Hard brake",
    "c1_text": "Alex Zu",
    "c2_text": "Truck 09",
    "c3_text": "Today 9:02 AM",
    "c4_text": "401 EB \u00b7 Pickering"
  },
  {
    "c0_text": "Speeding \u00b7 74/60 mph",
    "c1_text": "Alex Zu",
    "c2_text": "Truck 09",
    "c3_text": "Today 9:02 AM",
    "c4_text": "401 EB \u00b7 Pickering"
  },
  {
    "c0_text": "Lane departure",
    "c1_text": "Jackson Mungai",
    "c2_text": "Truck 14",
    "c3_text": "Yesterday 4:12 PM",
    "c4_text": "Yonge \u00b7 Vaughan"
  },
  {
    "c0_text": "Following distance",
    "c1_text": "Paul Rai",
    "c2_text": "Van 03",
    "c3_text": "Yesterday 2:34 PM",
    "c4_text": "Lakeshore \u00b7 Mississauga"
  },
  {
    "c0_text": "Phone use",
    "c1_text": "Alex Zu",
    "c2_text": "Truck 09",
    "c3_text": "2 days ago",
    "c4_text": "Eglinton \u00b7 Toronto"
  },
  {
    "c0_text": "Speeding \u00b7 68/60 mph",
    "c1_text": "Alex Zu",
    "c2_text": "Truck 09",
    "c3_text": "2 days ago",
    "c4_text": "427 NB \u00b7 Toronto"
  }
],
  rows2: [
  {
    "c0_name": "Andrew Haylton",
    "c1_text": "98",
    "c2_text": "14",
    "c3_text": "0",
    "c4_text": "0",
    "c5_text": "+2"
  },
  {
    "c0_name": "Donald James",
    "c1_text": "96",
    "c2_text": "12",
    "c3_text": "1",
    "c4_text": "0",
    "c5_text": "+1"
  },
  {
    "c0_name": "Fred Waite",
    "c1_text": "94",
    "c2_text": "11",
    "c3_text": "2",
    "c4_text": "0",
    "c5_text": "\u00b10"
  },
  {
    "c0_name": "Paul Rai",
    "c1_text": "82",
    "c2_text": "9",
    "c3_text": "3",
    "c4_text": "1",
    "c5_text": "\u22124"
  },
  {
    "c0_name": "Alex Zu",
    "c1_text": "71",
    "c2_text": "10",
    "c3_text": "4",
    "c4_text": "3",
    "c5_text": "\u22128"
  }
],
  kpis: [
  {
    "label": "Total alerts (30d)",
    "value": "42",
    "delta": "8 red / 34 amber"
  },
  {
    "label": "HOS violations",
    "value": "3",
    "delta": "2 unresolved"
  },
  {
    "label": "Open incidents",
    "value": "3",
    "delta": "12 total incidents"
  },
  {
    "label": "Fleet compliance",
    "value": "",
    "delta": ""
  }
],
  rows: [
  {
    "c0_text": "Hard brake",
    "c1_text": "Alex Zu",
    "c2_text": "Truck 09",
    "c3_text": "Today 9:02 AM"
  },
  {
    "c0_text": "Speeding \u00b7 +14 mph",
    "c1_text": "Alex Zu",
    "c2_text": "Truck 09",
    "c3_text": "Today 9:02 AM"
  },
  {
    "c0_text": "Lane departure",
    "c1_text": "Jackson Mungai",
    "c2_text": "Truck 14",
    "c3_text": "Yesterday"
  },
  {
    "c0_text": "Following distance",
    "c1_text": "Paul Rai",
    "c2_text": "Van 03",
    "c3_text": "Yesterday"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "header": { "subtitle": "Q2 2026 · 47 days incident-free", "range": "Last 90 days" },
    "tabs": { "incidents": 3, "nearMisses": 8 },
    "stats": {
      "daysFree":   { "value": 47, "delta": "Best streak this year" },
      "incidents":  { "value": 3, "pct": "40%", "delta": "vs previous 90d" },
      "nearMisses": { "value": 8, "delta": "all logged & reviewed" },
      "training":   { "value": 96, "unit": "%", "delta": "11 of 11 movers current" }
    },
    "incidents": [
      { "title": "Box dropped, broke fragile item",     "meta": "Truck 1 · Deal 17712-1",      "severity": "Minor",    "severityPill": "warn", "when": "Mar 28" },
      { "title": "Mover slipped on wet stairs",         "meta": "Truck 3 · no injury reported","severity": "Moderate", "severityPill": "bad",  "when": "Mar 12" },
      { "title": "Vehicle scrape — parking garage",     "meta": "Van 1 · no other vehicles",   "severity": "Minor",    "severityPill": "warn", "when": "Feb 19" }
    ],
    "teams": [
      { "teamCode": "T1", "teamColor": "terra", "teamName": "Truck 1", "incidents": 1, "nearMisses": 2, "score": "A", "scoreColor": "ok" },
      { "teamCode": "T3", "teamColor": "info",  "teamName": "Truck 3", "incidents": 1, "nearMisses": 3, "score": "B", "scoreColor": "warn" },
      { "teamCode": "V1", "teamColor": "plum",  "teamName": "Van 1",   "incidents": 1, "nearMisses": 1, "score": "A", "scoreColor": "ok" },
      { "teamCode": "T2", "teamColor": "teal",  "teamName": "Truck 2", "incidents": 0, "nearMisses": 2, "score": "A", "scoreColor": "ok" }
    ],
    "training": [
      { "initials": "AH", "avColor": "terra", "name": "Andrew Haylton", "role": "Team Leader", "moverCertPill": "ok",   "moverCertText": "Current", "liftingPill": "ok",   "liftingText": "Current",      "drivingPill": "ok",  "drivingText": "Current", "expires": "Sep 2026",      "expiresStyle": "" },
      { "initials": "DJ", "avColor": "info",  "name": "Donald James",   "role": "Team Leader", "moverCertPill": "ok",   "moverCertText": "Current", "liftingPill": "ok",   "liftingText": "Current",      "drivingPill": "ok",  "drivingText": "Current", "expires": "Nov 2026",      "expiresStyle": "" },
      { "initials": "JM", "avColor": "teal",  "name": "Jackson Mungai", "role": "Mover",       "moverCertPill": "ok",   "moverCertText": "Current", "liftingPill": "warn", "liftingText": "Expires 30d",  "drivingPill": "ok",  "drivingText": "Current", "expires": "Jun 16, 2026",  "expiresStyle": "" },
      { "initials": "PR", "avColor": "plum",  "name": "Paul Rai",       "role": "Mover",       "moverCertPill": "ok",   "moverCertText": "Current", "liftingPill": "ok",   "liftingText": "Current",      "drivingPill": "ok",  "drivingText": "Current", "expires": "Jan 2027",      "expiresStyle": "" },
      { "initials": "AZ", "avColor": "info",  "name": "Alex Zu",        "role": "Driver",      "moverCertPill": "off",  "moverCertText": "—",       "liftingPill": "ok",   "liftingText": "Current",      "drivingPill": "bad", "drivingText": "Expired", "expires": "Apr 22, 2026",  "expiresStyle": "color:var(--bad);" }
    ]
  };
  F["salesDashboard"] = {
  metrics: {
  "fn_count": [
    "8",
    "6",
    "5",
    "3",
    "1"
  ],
  "amt": [
    "{{amount}}"
  ]
},
  amounts: ["$42,640", "$0", "$42,640"],
  upcoming: [
  {
    "name": "Northside Co. \u00b7 commercial",
    "date": "May 24, 2026",
    "amount": "$8,420"
  },
  {
    "name": "Rebecca Chen \u00b7 long dist.",
    "date": "May 28, 2026",
    "amount": "$3,140"
  },
  {
    "name": "Tao Anand \u00b7 packing",
    "date": "May 30, 2026",
    "amount": "$1,890"
  },
  {
    "name": "Joaquin Lopez \u00b7 move",
    "date": "Jun 02, 2026",
    "amount": "$2,420"
  }
],
  kanban4: [
  {
    "cls": "",
    "name": "M. Tran",
    "sub": "",
    "value": ""
  }
],
  kanban3: [
  {
    "cls": "",
    "name": "Pinewood Estates",
    "sub": "",
    "value": ""
  },
  {
    "cls": "",
    "name": "Cedar Lane HOA",
    "sub": "",
    "value": ""
  },
  {
    "cls": "muted",
    "name": "+ 1 more",
    "sub": "",
    "value": ""
  }
],
  kanban2: [
  {
    "cls": "",
    "name": "Northridge Retail",
    "sub": "",
    "value": ""
  },
  {
    "cls": "",
    "name": "Daniel Park",
    "sub": "",
    "value": ""
  },
  {
    "cls": "muted",
    "name": "+ 3 more",
    "sub": "",
    "value": ""
  }
],
  kanban1: [
  {
    "cls": "",
    "name": "Beachway HOA",
    "sub": "",
    "value": ""
  },
  {
    "cls": "",
    "name": "Linwood Plaza",
    "sub": "",
    "value": ""
  },
  {
    "cls": "muted",
    "name": "+ 4 more",
    "sub": "",
    "value": ""
  }
],
  kanban0: [
  {
    "cls": "",
    "name": "Maple Court Condos",
    "sub": "",
    "value": ""
  },
  {
    "cls": "",
    "name": "Sarah Patel",
    "sub": "",
    "value": ""
  },
  {
    "cls": "",
    "name": "Yorkdale Properties",
    "sub": "",
    "value": ""
  },
  {
    "cls": "muted",
    "name": "+ 5 more",
    "sub": "",
    "value": ""
  }
],
  chartCols: [
  {
    "cls": "",
    "height": "57%;",
    "tip": "$28,400",
    "label": "Dec"
  },
  {
    "cls": "",
    "height": "62%;",
    "tip": "$31,020",
    "label": "Jan"
  },
  {
    "cls": "",
    "height": "67%;",
    "tip": "$33,700",
    "label": "Feb"
  },
  {
    "cls": "",
    "height": "76%;",
    "tip": "$38,200",
    "label": "Mar"
  },
  {
    "cls": "",
    "height": "80%;",
    "tip": "$40,100",
    "label": "Apr"
  }
],
  optionsOptions: [{"value": "Daily", "label": "Daily"}, {"value": "Weekly", "label": "Weekly"}, {"value": "Monthly", "label": "Monthly"}, {"value": "Yearly", "label": "Yearly"}],
  summary: "Sales Dashboard",
  subtitle: "John Sales \u00b7 May performance",
  rows4: [
  {
    "c0_text": "Q2 2026 (in progress)",
    "c1_text": "$150,000",
    "c2_text": "$94,210",
    "c3_text": "$61,200",
    "c4_name": "$155,400",
    "c5_text": "+$5.4k"
  },
  {
    "c0_text": "Q1 2026",
    "c1_text": "$135,000",
    "c2_text": "$142,800",
    "c3_text": "\u2014",
    "c4_name": "\u2014",
    "c5_text": "+$7.8k"
  },
  {
    "c0_text": "Q4 2025",
    "c1_text": "$120,000",
    "c2_text": "$118,400",
    "c3_text": "\u2014",
    "c4_name": "\u2014",
    "c5_text": "\u2212$1.6k"
  }
],
  rows3: [
  {
    "c0_text": "John Sales",
    "c1_text": "$28.4k",
    "c2_text": "$31.0k",
    "c3_text": "$33.7k",
    "c4_text": "$38.2k",
    "c5_text": "$40.1k",
    "c6_name": "$42.6k"
  },
  {
    "c0_text": "Jane Finance",
    "c1_text": "$22.1k",
    "c2_text": "$25.8k",
    "c3_text": "$24.4k",
    "c4_text": "$28.9k",
    "c5_text": "$30.5k",
    "c6_name": "$31.2k"
  },
  {
    "c0_text": "Andrew Haylton",
    "c1_text": "$18.0k",
    "c2_text": "$19.2k",
    "c3_text": "$20.5k",
    "c4_text": "$22.1k",
    "c5_text": "$23.4k",
    "c6_name": "$24.8k"
  },
  {
    "c0_text": "Paul Rai",
    "c1_text": "$11.2k",
    "c2_text": "$12.4k",
    "c3_text": "$14.1k",
    "c4_text": "$15.8k",
    "c5_text": "$17.3k",
    "c6_name": "$18.4k"
  }
],
  rows2: [
  {
    "c1_text": "82",
    "c2_text": "21",
    "c3_text": "14",
    "c4_text": "$42,640",
    "c5_text": "92%",
    "c6_text": "85%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--terra)",
    "c0_avInitials": "JS",
    "c0_name": "John Sales",
    "c0_sub": "You",
    "c0_dotCls": ""
  },
  {
    "c1_text": "71",
    "c2_text": "18",
    "c3_text": "11",
    "c4_text": "$31,210",
    "c5_text": "78%",
    "c6_text": "62%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--info)",
    "c0_avInitials": "JF",
    "c0_name": "Jane Finance",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "58",
    "c2_text": "14",
    "c3_text": "9",
    "c4_text": "$24,810",
    "c5_text": "71%",
    "c6_text": "50%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--teal)",
    "c0_avInitials": "AH",
    "c0_name": "Andrew Haylton",
    "c0_sub": "",
    "c0_dotCls": ""
  },
  {
    "c1_text": "42",
    "c2_text": "11",
    "c3_text": "8",
    "c4_text": "$18,400",
    "c5_text": "64%",
    "c6_text": "37%",
    "c0_wrapCls": "who",
    "c0_avBg": "var(--plum)",
    "c0_avInitials": "PR",
    "c0_name": "Paul Rai",
    "c0_sub": "",
    "c0_dotCls": ""
  }
],
  rows: [
  {
    "c0_text": "Leads",
    "c1_text": "8",
    "c2_text": "34",
    "c3_text": "112"
  },
  {
    "c0_text": "Calls logged",
    "c1_text": "12",
    "c2_text": "67",
    "c3_text": "248"
  },
  {
    "c0_text": "Estimates sent",
    "c1_text": "3",
    "c2_text": "11",
    "c3_text": "42"
  },
  {
    "c0_text": "Moves booked",
    "c1_text": "2",
    "c2_text": "5",
    "c3_text": "14"
  },
  {
    "c0_text": "Revenue",
    "c1_text": "$1,840",
    "c2_text": "$9,420",
    "c3_text": "$42,640"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "header": { "subtitle": "John Sales · MTD performance", "range": "May 2026" },
    "tabs": { "pipeline": 23 },
    "stats": {
      "booked":    { "value": "$42,640", "pct": "22%", "delta": "vs last month" },
      "deals":     { "value": 14, "delta": "2 today" },
      "closeRate": { "value": 92, "unit": "%", "delta": "team avg 64%" },
      "goal":      { "value": 85, "unit": "%", "delta": "$42.6k of $50k" }
    },
    "pipelineSummary": "$61.2k across 23 opportunities",
    "pipeline": [
      { "color": "ink-3", "label": "New leads",        "count": 8, "value": "$21.4k" },
      { "color": "info",  "label": "Discovery",        "count": 6, "value": "$18.2k" },
      { "color": "plum",  "label": "Growth Plan sent", "count": 5, "value": "$14.6k" },
      { "color": "warn",  "label": "Negotiation",      "count": 3, "value": "$5.8k" },
      { "color": "ok",    "label": "Booked",           "count": 1, "value": "$1.2k" }
    ],
    "topDeals": [
      { "initials": "NS", "avColor": "teal",  "customer": "Northside Co.", "type": "Commercial",    "value": "$8,420", "booked": "May 14" },
      { "initials": "AJ", "avColor": "terra", "customer": "Alice Johnson", "type": "Local move",    "value": "$2,768", "booked": "May 8" },
      { "initials": "RC", "avColor": "info",  "customer": "Rebecca Chen",  "type": "Long distance", "value": "$3,140", "booked": "May 6" },
      { "initials": "TA", "avColor": "plum",  "customer": "Tao Anand",     "type": "Packing only",  "value": "$1,890", "booked": "May 4" },
      { "initials": "JL", "avColor": "gold",  "customer": "Joaquin Lopez", "type": "Local move",    "value": "$2,420", "booked": "May 2" }
    ],
    "activity": [
      { "day": "Today · Sat 16", "calls": 12, "quotes": 3, "booked": 2 },
      { "day": "Fri 15",         "calls": 14, "quotes": 4, "booked": 3 },
      { "day": "Thu 14",         "calls": 9,  "quotes": 2, "booked": 2 },
      { "day": "Wed 13",         "calls": 11, "quotes": 3, "booked": 1 },
      { "day": "Tue 12",         "calls": 8,  "quotes": 2, "booked": 2 },
      { "day": "Mon 11",         "calls": 10, "quotes": 3, "booked": 2 },
      { "day": "Sun 10",         "calls": 3,  "quotes": 1, "booked": 1 }
    ],
    "leaderboard": [
      { "initials": "JS", "avColor": "terra", "name": "John Sales",     "sub": "You", "calls": 82, "quotes": 21, "booked": 14, "revenue": "$42,640", "revenueStyle": "font-weight:600;", "closeRate": "92%", "closeColor": "ok", "goal": "85%" },
      { "initials": "JF", "avColor": "info",  "name": "Jane Finance",   "sub": "",    "calls": 71, "quotes": 18, "booked": 11, "revenue": "$31,210", "revenueStyle": "",                  "closeRate": "78%", "closeColor": "ok", "goal": "62%" },
      { "initials": "AH", "avColor": "teal",  "name": "Andrew Haylton", "sub": "",    "calls": 58, "quotes": 14, "booked": 9,  "revenue": "$24,810", "revenueStyle": "",                  "closeRate": "71%", "closeColor": "",   "goal": "50%" },
      { "initials": "PR", "avColor": "plum",  "name": "Paul Rai",       "sub": "",    "calls": 42, "quotes": 11, "booked": 8,  "revenue": "$18,400", "revenueStyle": "",                  "closeRate": "64%", "closeColor": "",   "goal": "37%" }
    ]
  };
  F["scheduling"] = {
  metrics: {
  "fcount": [
    "12",
    "2",
    "8",
    "1",
    "11",
    "1",
    "1",
    "4",
    "2",
    "1",
    "1"
  ],
  "ct_count": [
    "4",
    "2"
  ],
  "res_mo_num": [
    "27",
    "28",
    "29",
    "30",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31"
  ],
  "res_mo_pct": [
    "50% capacity",
    "83% capacity",
    "33% capacity",
    "67% capacity",
    "83% capacity",
    "50% capacity",
    "100% capacity",
    "67% capacity",
    "83% capacity",
    "33% capacity",
    "50% capacity",
    "67% capacity",
    "83% capacity",
    "100% capacity",
    "67% capacity",
    "67% capacity \u00b7 today",
    "50% capacity",
    "83% capacity",
    "100% capacity",
    "83% capacity",
    "67% capacity",
    "50% capacity",
    "83% capacity",
    "33% capacity",
    "67% capacity",
    "83% capacity",
    "83% capacity",
    "67% capacity",
    "50% capacity",
    "67% capacity",
    "33% capacity"
  ],
  "day_num": [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17"
  ],
  "tr_value": [
    "May 14 \u2013 May 16",
    "Truck 5 \u00b7 A. Haylton",
    "May 15 \u2013 May 22",
    "Truck 6 \u00b7 F. Waite",
    "May 12 \u2013 May 15",
    "Backup \u00b7 D. James",
    "May 19 \u2013 May 21",
    "Unassigned"
  ],
  "amt": [
    "$480",
    "$3,140"
  ],
  "count": [
    "4",
    "2",
    "1",
    "3"
  ],
  "jobs_subtab_count": ["3", "12"],
  "section_counts": ["5", "7", "6"],
  "cal_toolbar_range": ["May 11 – May 17, 2026"],
  "res_mo_title": ["Resource utilisation · May 2026", "May 2026"],
  "pending_changes": ["2 pending changes"],
  "legend_now": ["Now · 2:18 PM"]
},
  customers: [
  "Johnson",
  "Patel",
  "Northside Co.",
  "Johnson",
  "Patel",
  "Patel",
  "Patel",
  "Patel",
  "Johnson"
],
  rows2: [
  {
    "c1_text": "Move + survey",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Message</button></div>",
    "c3_when": "Sat, May 16 \u00b7 7:00 AM \u2013 5:00 PM",
    "c3_sub": "",
    "c0_avBg": "var(--terra)",
    "c0_avInitials": "AH",
    "c0_name": "Andrew Haylton",
    "c0_sub": "Team Leader"
  },
  {
    "c1_text": "Move",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Message</button></div>",
    "c3_when": "Sat, May 16 \u00b7 7:00 AM \u2013 12:00 PM",
    "c3_sub": "",
    "c0_avBg": "var(--teal)",
    "c0_avInitials": "JM",
    "c0_name": "Jackson Mungai",
    "c0_sub": "Mover"
  },
  {
    "c1_text": "Box delivery",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Message</button></div>",
    "c3_when": "Sat, May 16 \u00b7 8:00 AM \u2013 11:00 AM",
    "c3_sub": "",
    "c0_avBg": "var(--info)",
    "c0_avInitials": "DJ",
    "c0_name": "Donald James",
    "c0_sub": "Team Leader"
  },
  {
    "c1_text": "Move + packing",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-ghost btn-sm\">Nudge</button><button class=\"btn btn-secondary btn-sm\">Reassign</button></div>",
    "c3_when": "Sat, May 16 \u00b7 1:00 PM \u2013 6:00 PM",
    "c3_sub": "",
    "c0_avBg": "var(--teal)",
    "c0_avInitials": "PR",
    "c0_name": "Paul Rai",
    "c0_sub": "Mover"
  },
  {
    "c1_text": "Packing only \u00b7 Lee",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Find cover</button></div>",
    "c3_when": "Sat, May 16 \u00b7 2:00 PM \u2013 4:00 PM",
    "c3_sub": "",
    "c0_avBg": "var(--plum)",
    "c0_avInitials": "GA",
    "c0_name": "Gurtsik Ann",
    "c0_sub": "Helper"
  },
  {
    "c1_text": "Commercial",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Message</button></div>",
    "c3_when": "Sat, May 16 \u00b7 9:00 AM \u2013 3:00 PM",
    "c3_sub": "",
    "c0_avBg": "var(--terra)",
    "c0_avInitials": "FW",
    "c0_name": "Fred Waite",
    "c0_sub": "Team Leader"
  }
],
  rows: [
  {
    "c1_text": "Move day",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Open deal</button></div>",
    "c2_when": "Sat, May 16 \u00b7 7:00 AM",
    "c2_sub": "in 16h",
    "c0_avBg": "var(--terra)",
    "c0_avInitials": "AJ",
    "c0_name": "Alice Johnson",
    "c0_sub": "Deal \u00b7 17826-1 \u00b7 Toronto \u2192 Hamilton"
  },
  {
    "c1_text": "Long distance walkthrough",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-ghost btn-sm\">Nudge</button><button class=\"btn btn-secondary btn-sm\">Call</button></div>",
    "c2_when": "Tue, May 19 \u00b7 2:00 PM",
    "c2_sub": "in 3 days",
    "c0_avBg": "var(--info)",
    "c0_avInitials": "RC",
    "c0_name": "Rebecca Chen",
    "c0_sub": "Deal \u00b7 17878-1 \u00b7 Toronto \u2192 Ottawa"
  },
  {
    "c1_text": "Packing prep call",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-danger-text btn-sm\">Auto-call</button><button class=\"btn btn-secondary btn-sm\">Reschedule</button></div>",
    "c2_when": "Mon, May 18 \u00b7 10:00 AM",
    "c2_sub": "in 2 days",
    "c0_avBg": "var(--plum)",
    "c0_avInitials": "ML",
    "c0_name": "Marcus Lee",
    "c0_sub": "Deal \u00b7 17880-1 \u00b7 Packing only"
  },
  {
    "c1_text": "Site survey",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Open deal</button></div>",
    "c2_when": "Sat, May 16 \u00b7 9:00 AM",
    "c2_sub": "in 19h",
    "c0_avBg": "var(--teal)",
    "c0_avInitials": "NS",
    "c0_name": "Northside Co. \u00b7 Pat S.",
    "c0_sub": "Deal \u00b7 17821-1 \u00b7 Commercial"
  },
  {
    "c1_text": "In-home survey",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-ghost btn-sm\">Nudge</button><button class=\"btn btn-secondary btn-sm\">Call</button></div>",
    "c2_when": "Sat, May 16 \u00b7 1:00 PM",
    "c2_sub": "in 23h",
    "c0_avBg": "var(--warn)",
    "c0_avInitials": "JL",
    "c0_name": "Joaquin Lopez",
    "c0_sub": "Deal \u00b7 17872-1 \u00b7 3BR survey"
  },
  {
    "c1_text": "Delivery window",
    "c5": "<div class=\"tv-actions\"><button class=\"btn btn-secondary btn-sm\">Open deal</button></div>",
    "c2_when": "Sat, May 16 \u00b7 11:00 AM",
    "c2_sub": "in 21h",
    "c0_avBg": "var(--rose)",
    "c0_avInitials": "SP",
    "c0_name": "Sara Patel",
    "c0_sub": "Deal \u00b7 17870-1 \u00b7 Box delivery"
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, resources: {
      ah: { initials: "AH", name: "Andrew Haylton", role: "Team Leader · Truck 1", roleShort: "Team Leader" },
      dj: { initials: "DJ", name: "Donald James",   role: "Team Leader · Van 1",   roleShort: "Team Leader" },
      fw: { initials: "FW", name: "Fred Waite",     role: "Team Leader",           roleShort: "Team Leader" },
      gs1:{ initials: "GS", name: "Gerald Sabados", role: "Team Leader",           roleShort: "Team Leader" },
      gs2:{ initials: "GS", name: "Gurstuik Sigh",  role: "Team Leader",           roleShort: "Team Leader" },
      jm: { initials: "JM", name: "Jackson Mungai", role: "Mover · Truck 1",       roleShort: "Mover" },
      pr: { initials: "PR", name: "Paul Rai",       role: "Mover",                 roleShort: "Mover" },
      az: { initials: "AZ", name: "Alex Zu",        role: "Driver",                roleShort: "Driver" },
      ga: { initials: "GA", name: "Gurtsik Ann",    role: "Helper",                roleShort: "Helper" }
    },
    header: {
      date: "Sat · May 16, 2026",
      nowTime: "2:18 PM",
      now: "2026-05-16T18:18:00Z",          // 2:18 PM Toronto / 11:18 AM Vancouver
      companyTz: "America/Toronto",
      companyTzAbbr: "EDT",
      dateIso: "2026-05-16",
      locationTz: null,
      locationLabel: "All locations",
      allLocationsCount: "13"
    },
    locations: [
      { id: "tor", name: "Toronto",      count: "6", tz: "America/Toronto"   },
      { id: "ham", name: "Hamilton",     count: "2", tz: "America/Toronto"   },
      { id: "mis", name: "Mississauga",  count: "2", tz: "America/Toronto"   },
      { id: "ott", name: "Ottawa",       count: "1", tz: "America/Toronto"   },
      { id: "etb", name: "Etobicoke",    count: "1", tz: "America/Toronto"   },
      { id: "yvr", name: "Vancouver",    count: "1", tz: "America/Vancouver" }
    ],
    tabCounts: { scheduling: "4", customer: "2", team: "1", dayOff: "3" },
    unscheduledDeals: [
      { id: 17880, customer: "M. Lee",   dealId: "17880-1", route: "Etobicoke → Mississauga",     pillClass: "",     pillLabel: "Packing only", duration: "~2h",            amount: "$480",   location: "Etobicoke" },
      { id: 17878, customer: "R. Chen",  dealId: "17878-1", route: "Toronto → Ottawa",            pillClass: "warn", pillLabel: "Tentative",    duration: "Long dist · 1d", amount: "$3,140", location: "Toronto"   },
      { id: 17872, customer: "J. Lopez", dealId: "17872-1", route: "North York · in-home survey", pillClass: "info", pillLabel: "Survey",       duration: "1h",             amount: "—",      location: "Toronto"   }
    ],
    closedDeals: [
      { id: 17801, customer: "P. Singh",  dealId: "17801-1", route: "Toronto → Toronto",          pillClass: "ok",   pillLabel: "Paid",      duration: "5h",  amount: "$2,140", location: "Toronto"     },
      { id: 17799, customer: "A. Diaz",   dealId: "17799-1", route: "Hamilton → Burlington",      pillClass: "ok",   pillLabel: "Paid",      duration: "4h",  amount: "$1,820", location: "Hamilton"    },
      { id: 17795, customer: "K. Patel",  dealId: "17795-1", route: "Mississauga · packing",      pillClass: "ok",   pillLabel: "Paid",      duration: "3h",  amount: "$960",   location: "Mississauga" },
      { id: 17791, customer: "S. Brown",  dealId: "17791-1", route: "Toronto → Markham",          pillClass: "ok",   pillLabel: "Paid",      duration: "6h",  amount: "$3,210", location: "Toronto"     },
      { id: 17786, customer: "L. Cheng",  dealId: "17786-1", route: "Vancouver → Richmond",       pillClass: "ok",   pillLabel: "Paid",      duration: "4h",  amount: "$2,540", location: "Vancouver"   }
    ],
    custKpis: {
      confirmed: "8", confirmedSub: "of 12 upcoming",
      awaiting: "2", awaitingSub: "last nudged 4h ago",
      noResponse: "1", noResponseSub: "Auto-call queued",
      total: "12", totalSub: "Jobs & surveys"
    },
    customerConfirmations: [
      { avColor: "var(--terra)", initials: "AJ", name: "Alice Johnson",        sub: "Deal · 17826-1 · Toronto → Hamilton", meeting: "Move day",                  when: "Sat, May 16 · 7:00 AM",  whenSub: "in 16h",   channelPill: "info", channel: "SMS",   statusPill: "ok",   status: "Confirmed",             action: "Open deal" },
      { avColor: "var(--info)",  initials: "RC", name: "Rebecca Chen",          sub: "Deal · 17878-1 · Toronto → Ottawa",   meeting: "Long distance walkthrough", when: "Tue, May 19 · 2:00 PM",  whenSub: "in 3 days", channelPill: "info", channel: "Email", statusPill: "warn", status: "Awaiting reply",        action: "Call" },
      { avColor: "var(--plum)",  initials: "ML", name: "Marcus Lee",            sub: "Deal · 17880-1 · Packing only",       meeting: "Packing prep call",         when: "Mon, May 18 · 10:00 AM", whenSub: "in 2 days", channelPill: "",    channel: "Phone", statusPill: "bad",  status: "No response · 28h",     action: "Reschedule" },
      { avColor: "var(--teal)",  initials: "NS", name: "Northside Co. · Pat S.", sub: "Deal · 17821-1 · Commercial",         meeting: "Site survey",                when: "Sat, May 16 · 9:00 AM",  whenSub: "in 19h",   channelPill: "info", channel: "Email", statusPill: "ok",   status: "Confirmed",             action: "Open deal" },
      { avColor: "var(--warn)",  initials: "JL", name: "Joaquin Lopez",          sub: "Deal · 17872-1 · 3BR survey",         meeting: "In-home survey",             when: "Sat, May 16 · 1:00 PM",  whenSub: "in 23h",   channelPill: "info", channel: "SMS",   statusPill: "warn", status: "Awaiting reply",        action: "Call" },
      { avColor: "var(--rose)",  initials: "SP", name: "Sara Patel",             sub: "Deal · 17870-1 · Box delivery",       meeting: "Delivery window",            when: "Sat, May 16 · 11:00 AM", whenSub: "in 21h",   channelPill: "info", channel: "SMS",   statusPill: "ok",   status: "Confirmed",             action: "Open deal" }
    ],
    teamConfirmations: [
      { avColor: "var(--terra)", initials: "AH", name: "Andrew Haylton",  role: "Team Leader", shift: "Move + survey",     crewColor: "var(--terra)", crew: "Truck 1", when: "Sat, May 16 · 7:00 AM – 5:00 PM",  statusPill: "ok",   status: "Confirmed",      action: "Message"    },
      { avColor: "var(--teal)",  initials: "JM", name: "Jackson Mungai",  role: "Mover",       shift: "Move",              crewColor: "var(--terra)", crew: "Truck 1", when: "Sat, May 16 · 7:00 AM – 12:00 PM", statusPill: "ok",   status: "Confirmed",      action: "Message"    },
      { avColor: "var(--info)",  initials: "DJ", name: "Donald James",    role: "Team Leader", shift: "Box delivery",      crewColor: "var(--info)",  crew: "Van 1",   when: "Sat, May 16 · 8:00 AM – 11:00 AM", statusPill: "ok",   status: "Confirmed",      action: "Message"    },
      { avColor: "var(--teal)",  initials: "PR", name: "Paul Rai",        role: "Mover",       shift: "Move + packing",    crewColor: "var(--info)",  crew: "Van 1",   when: "Sat, May 16 · 1:00 PM – 6:00 PM",  statusPill: "warn", status: "Awaiting · 12h", action: "Reassign"   },
      { avColor: "var(--plum)",  initials: "GA", name: "Gurtsik Ann",     role: "Helper",      shift: "Packing only · Lee", crewColor: "var(--info)",  crew: "Van 1",   when: "Sat, May 16 · 2:00 PM – 4:00 PM",  statusPill: "bad",  status: "Declined",       action: "Find cover" },
      { avColor: "var(--terra)", initials: "FW", name: "Fred Waite",      role: "Team Leader", shift: "Commercial",        crewColor: "var(--teal)",  crew: "Truck 3", when: "Sat, May 16 · 9:00 AM – 3:00 PM",  statusPill: "ok",   status: "Confirmed",      action: "Message"    }
    ],
    dayOff: {
      pendingCount: "3", approvedCount: "5", deniedCount: "1",
      pending: [
        { avColor: "var(--info)", initials: "AZ", name: "Alex Zu",        role: "Driver", dates: "May 13 – May 14", duration: "2 days", reason: "Family event in Oshawa. Can swap with Paul if needed." },
        { avColor: "var(--teal)", initials: "JM", name: "Jackson Mungai", role: "Mover",  dates: "May 22",          duration: "1 day",  reason: "Doctor's appointment, half-day morning would also work." },
        { avColor: "var(--plum)", initials: "GA", name: "Gurtsik Ann",    role: "Helper", dates: "May 24 – May 30", duration: "1 week", reason: "Vacation. Submitted 6 weeks in advance." }
      ],
      approved: [
        { avColor: "var(--terra)", initials: "AH", name: "Andrew Haylton", role: "Team Leader", dates: "May 13",          duration: "1 day",  reason: "Approved by Admin · May 8"  },
        { avColor: "var(--info)",  initials: "DJ", name: "Donald James",   role: "Team Leader", dates: "May 18 – May 20", duration: "3 days", reason: "Approved by Admin · May 10" },
        { avColor: "var(--teal)",  initials: "PR", name: "Paul Rai",       role: "Mover",       dates: "Jun 2",           duration: "1 day",  reason: "Approved by Admin · May 11" }
      ],
      denied: [
        { avColor: "var(--rose)", initials: "GS", name: "Gerald Sabados", role: "Team Leader", dates: "May 16", duration: "1 day", reason: "Denied · Saturday peak day, no coverage available. Suggest May 23 instead." }
      ]
    },
    truckRentals: [
      { name: "U-Haul · 26 ft",     sub: "Vendor: U-Haul Toronto East",         period: "May 14 – May 16", assigned: "Truck 5 · A. Haylton", cost: "$680",   days: "3 days", statusPill: "warn", status: "Returning today" },
      { name: "Penske · 22 ft",     sub: "Vendor: Penske Mississauga",          period: "May 15 – May 22", assigned: "Truck 6 · F. Waite",   cost: "$1,540", days: "7 days", statusPill: "ok",   status: "Active"          },
      { name: "Enterprise · 16 ft", sub: "Vendor: Enterprise Truck Rental",     period: "May 12 – May 15", assigned: "Backup · D. James",     cost: "$420",   days: "3 days", statusPill: "ok",   status: "Active"          },
      { name: "U-Haul · 26 ft",     sub: "Reserved for · Chen long-distance",   period: "May 19 – May 21", assigned: "Unassigned",            cost: "$540",   days: "2 days", statusPill: "info", status: "Upcoming"        }
    ],
    teamConfirmationsKpis: {
      confirmed: "9",  confirmedSub: "of 11 assignments",
      awaiting: "1",   awaitingSub: "Paul Rai",
      declined: "1",   declinedSub: "needs replacement",
      coverage: "82%", coverageSub: "across this week"
    },
    truckRentalsKpis: {
      active: "2",     activeSub: "on the road",
      returning: "1",  returningSub: "Truck 5 · U-Haul",
      cost: "$3,420",  costSub: "vs $4,100 last month",
      overdue: "0",    overdueSub: "All on schedule"
    },
    timeline: {
      lane0: [
        { color: "terra", left: "7",  width: "4.5", title: "Alice Johnson · 3BR move", sub: "Toronto → Hamilton · 4h · $2,768", confDisplay: "inline-flex", confStroke: "var(--terra)" },
        { color: "warn",  left: "13", width: "3",   title: "Survey · J. Lopez",        sub: "North York · 1h estimate",         confDisplay: "none",        confStroke: "var(--warn)"  }
      ],
      lane1: [
        { color: "info",  left: "8",  width: "2.5", title: "Box delivery · Patel",     sub: "Mississauga · 30 boxes",           confDisplay: "inline-flex", confStroke: "var(--info)" },
        { color: "plum",  left: "14", width: "2",   title: "Packing only · M. Lee",    sub: "Etobicoke · 2 packers",            confDisplay: "none",        confStroke: "var(--plum)" }
      ],
      lane2: [
        { color: "gold",  left: "10", width: "5",   title: "Long distance · D. Wong",  sub: "Vancouver → Burnaby · 5h · $4,200", confDisplay: "none",        confStroke: "var(--gold)" }
      ],
      lane3: [
        { color: "teal",  left: "9",  width: "6",   title: "Commercial · Northside Co.", sub: "Downtown · office relocation · 6h", confDisplay: "inline-flex", confStroke: "var(--teal)" }
      ]
    },
    // ── Resources column (left panel) ──
    rLeaders: [
      { initials: "AH", name: "Andrew Haylton", role: "Team Leader · Truck 1", assigned: " assigned",  badgeDisplay: "inline-flex" },
      { initials: "DJ", name: "Donald James",   role: "Team Leader · Van 1",   assigned: " assigned",  badgeDisplay: "inline-flex" },
      { initials: "FW", name: "Fred Waite",     role: "Team Leader",           assigned: "",            badgeDisplay: "none" },
      { initials: "GS", name: "Gerald Sabados", role: "Team Leader",           assigned: "",            badgeDisplay: "none" },
      { initials: "GS", name: "Gurstuik Sigh",  role: "Team Leader",           assigned: "",            badgeDisplay: "none" }
    ],
    rMembers: [
      { initials: "JM", name: "Jackson Mungai", role: "Mover · Truck 1", avCls: "mover",  assigned: " assigned", badgeDisplay: "inline-flex" },
      { initials: "PR", name: "Paul Rai",       role: "Mover",           avCls: "mover",  assigned: "",            badgeDisplay: "none" },
      { initials: "AZ", name: "Alex Zu",        role: "Driver",          avCls: "driver", assigned: "",            badgeDisplay: "none" },
      { initials: "GA", name: "Gurtsik Ann",    role: "Helper",          avCls: "helper", assigned: "",            badgeDisplay: "none" }
    ],
    rFleet: [
      { initials: "T1", name: "Truck 1",   sub: "Truck",   cap: "26 ft", assigned: " assigned" },
      { initials: "T2", name: "Truck 2",   sub: "Truck",   cap: "22 ft", assigned: "" },
      { initials: "T3", name: "Truck 3",   sub: "Truck",   cap: "26 ft", assigned: "" },
      { initials: "V1", name: "Van 1",     sub: "Van",     cap: "14 ft", assigned: " assigned" },
      { initials: "V2", name: "Van 2",     sub: "Van",     cap: "14 ft", assigned: "" },
      { initials: "Tr", name: "Trailer 1", sub: "Trailer", cap: "16 ft", assigned: "" }
    ],
    // ── Calendar tab cells (per resource × per day) ──
    // Each day uses two slots (label1/style1, label2/style2). Empty strings hide the chip.
    calRows: [
      {
        avBg: "var(--terra)", avRadius: "999px", initials: "AH", name: "Andrew Haylton", role: "Team Leader", location: "Toronto", kind: "team",
        d0a_lbl: "Truck 1 · 2 jobs", d0a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d0a_disp: "block", d0b_disp: "none", d0b_lbl: "", d0b_style: "", d0off_disp: "none", d0off_lbl: "",
        d1a_lbl: "Truck 1 · 3 jobs", d1a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d1a_disp: "block", d1b_disp: "none", d1b_lbl: "", d1b_style: "", d1off_disp: "none", d1off_lbl: "",
        d2a_lbl: "", d2a_style: "", d2a_disp: "none", d2b_disp: "none", d2b_lbl: "", d2b_style: "", d2off_disp: "flex", d2off_lbl: "Day off",
        d3a_lbl: "Truck 1 · 2 jobs", d3a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d3a_disp: "block", d3b_disp: "none", d3b_lbl: "", d3b_style: "", d3off_disp: "none", d3off_lbl: "",
        d4a_lbl: "Truck 1 · 1 job",  d4a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d4a_disp: "block", d4b_disp: "none", d4b_lbl: "", d4b_style: "", d4off_disp: "none", d4off_lbl: "",
        d5a_lbl: "Truck 1 · Johnson", d5a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d5a_disp: "block", d5b_lbl: "Survey · Lopez", d5b_style: "border-color:var(--warn);color:var(--warn);background:var(--warn-bg);", d5b_disp: "block", d5off_disp: "none", d5off_lbl: "",
        d6a_lbl: "", d6a_style: "", d6a_disp: "none", d6b_disp: "none", d6b_lbl: "", d6b_style: "", d6off_disp: "none", d6off_lbl: ""
      },
      {
        avBg: "var(--terra)", avRadius: "999px", initials: "DJ", name: "Donald James", role: "Team Leader", location: "Mississauga", kind: "team",
        d0a_lbl: "Van 1 · 1 job", d0a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d0a_disp: "block", d0b_disp: "none", d0b_lbl: "", d0b_style: "", d0off_disp: "none", d0off_lbl: "",
        d1a_lbl: "", d1a_style: "", d1a_disp: "none", d1b_disp: "none", d1b_lbl: "", d1b_style: "", d1off_disp: "none", d1off_lbl: "",
        d2a_lbl: "Van 1 · Patel", d2a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d2a_disp: "block", d2b_disp: "none", d2b_lbl: "", d2b_style: "", d2off_disp: "none", d2off_lbl: "",
        d3a_lbl: "Van 1 · 2 jobs", d3a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d3a_disp: "block", d3b_disp: "none", d3b_lbl: "", d3b_style: "", d3off_disp: "none", d3off_lbl: "",
        d4a_lbl: "Van 1 · 3 jobs", d4a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d4a_disp: "block", d4b_disp: "none", d4b_lbl: "", d4b_style: "", d4off_disp: "none", d4off_lbl: "",
        d5a_lbl: "Van 1 · Patel", d5a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d5a_disp: "block", d5b_lbl: "Packing · Lee", d5b_style: "border-color:var(--plum);color:var(--plum);background:var(--plum-bg);", d5b_disp: "block", d5off_disp: "none", d5off_lbl: "",
        d6a_lbl: "", d6a_style: "", d6a_disp: "none", d6b_disp: "none", d6b_lbl: "", d6b_style: "", d6off_disp: "none", d6off_lbl: ""
      },
      {
        avBg: "var(--info)", avRadius: "999px", initials: "AZ", name: "Alex Zu", role: "Driver", location: "Hamilton", kind: "team",
        d0a_lbl: "", d0a_style: "", d0a_disp: "none", d0b_disp: "none", d0b_lbl: "", d0b_style: "", d0off_disp: "none", d0off_lbl: "",
        d1a_lbl: "Van 1 backup", d1a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d1a_disp: "block", d1b_disp: "none", d1b_lbl: "", d1b_style: "", d1off_disp: "none", d1off_lbl: "",
        d2a_lbl: "", d2a_style: "", d2a_disp: "none", d2b_disp: "none", d2b_lbl: "", d2b_style: "", d2off_disp: "flex", d2off_lbl: "Requested",
        d3a_lbl: "", d3a_style: "", d3a_disp: "none", d3b_disp: "none", d3b_lbl: "", d3b_style: "", d3off_disp: "flex", d3off_lbl: "Requested",
        d4a_lbl: "", d4a_style: "", d4a_disp: "none", d4b_disp: "none", d4b_lbl: "", d4b_style: "", d4off_disp: "none", d4off_lbl: "",
        d5a_lbl: "", d5a_style: "", d5a_disp: "none", d5b_disp: "none", d5b_lbl: "", d5b_style: "", d5off_disp: "none", d5off_lbl: "",
        d6a_lbl: "", d6a_style: "", d6a_disp: "none", d6b_disp: "none", d6b_lbl: "", d6b_style: "", d6off_disp: "none", d6off_lbl: ""
      },
      {
        avBg: "var(--slate)", avRadius: "6px", initials: "T1", name: "Truck 1", role: "26 ft", location: "Toronto", kind: "vehicle",
        d0a_lbl: "2 bookings", d0a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d0a_disp: "block", d0b_disp: "none", d0b_lbl: "", d0b_style: "", d0off_disp: "none", d0off_lbl: "",
        d1a_lbl: "3 bookings", d1a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d1a_disp: "block", d1b_disp: "none", d1b_lbl: "", d1b_style: "", d1off_disp: "none", d1off_lbl: "",
        d2a_lbl: "Service · 9am", d2a_style: "border-color:var(--ink-3);color:var(--ink-2);background:var(--surface-2);", d2a_disp: "block", d2b_disp: "none", d2b_lbl: "", d2b_style: "", d2off_disp: "none", d2off_lbl: "",
        d3a_lbl: "2 bookings", d3a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d3a_disp: "block", d3b_disp: "none", d3b_lbl: "", d3b_style: "", d3off_disp: "none", d3off_lbl: "",
        d4a_lbl: "1 booking", d4a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d4a_disp: "block", d4b_disp: "none", d4b_lbl: "", d4b_style: "", d4off_disp: "none", d4off_lbl: "",
        d5a_lbl: "Johnson", d5a_style: "border-color:var(--terra);color:var(--terra);background:var(--terra-soft);", d5a_disp: "block", d5b_disp: "none", d5b_lbl: "", d5b_style: "", d5off_disp: "none", d5off_lbl: "",
        d6a_lbl: "", d6a_style: "", d6a_disp: "none", d6b_disp: "none", d6b_lbl: "", d6b_style: "", d6off_disp: "none", d6off_lbl: ""
      },
      {
        avBg: "var(--slate)", avRadius: "6px", initials: "T2", name: "Truck 2", role: "22 ft", location: "Ottawa", kind: "vehicle",
        d0a_lbl: "", d0a_style: "", d0a_disp: "none", d0b_disp: "none", d0b_lbl: "", d0b_style: "", d0off_disp: "none", d0off_lbl: "",
        d1a_lbl: "Tentative · Chen", d1a_style: "border-color:var(--gold);color:#8B6324;background:var(--gold-soft);", d1a_disp: "block", d1b_disp: "none", d1b_lbl: "", d1b_style: "", d1off_disp: "none", d1off_lbl: "",
        d2a_lbl: "", d2a_style: "", d2a_disp: "none", d2b_disp: "none", d2b_lbl: "", d2b_style: "", d2off_disp: "none", d2off_lbl: "",
        d3a_lbl: "", d3a_style: "", d3a_disp: "none", d3b_disp: "none", d3b_lbl: "", d3b_style: "", d3off_disp: "none", d3off_lbl: "",
        d4a_lbl: "", d4a_style: "", d4a_disp: "none", d4b_disp: "none", d4b_lbl: "", d4b_style: "", d4off_disp: "none", d4off_lbl: "",
        d5a_lbl: "Tentative · Chen", d5a_style: "border-color:var(--gold);color:#8B6324;background:var(--gold-soft);", d5a_disp: "block", d5b_disp: "none", d5b_lbl: "", d5b_style: "", d5off_disp: "none", d5off_lbl: "",
        d6a_lbl: "", d6a_style: "", d6a_disp: "none", d6b_disp: "none", d6b_lbl: "", d6b_style: "", d6off_disp: "none", d6off_lbl: ""
      },
      {
        avBg: "var(--slate)", avRadius: "6px", initials: "V1", name: "Van 1", role: "14 ft", location: "Mississauga", kind: "vehicle",
        d0a_lbl: "1 booking", d0a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d0a_disp: "block", d0b_disp: "none", d0b_lbl: "", d0b_style: "", d0off_disp: "none", d0off_lbl: "",
        d1a_lbl: "", d1a_style: "", d1a_disp: "none", d1b_disp: "none", d1b_lbl: "", d1b_style: "", d1off_disp: "none", d1off_lbl: "",
        d2a_lbl: "Patel", d2a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d2a_disp: "block", d2b_disp: "none", d2b_lbl: "", d2b_style: "", d2off_disp: "none", d2off_lbl: "",
        d3a_lbl: "2 bookings", d3a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d3a_disp: "block", d3b_disp: "none", d3b_lbl: "", d3b_style: "", d3off_disp: "none", d3off_lbl: "",
        d4a_lbl: "3 bookings", d4a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d4a_disp: "block", d4b_disp: "none", d4b_lbl: "", d4b_style: "", d4off_disp: "none", d4off_lbl: "",
        d5a_lbl: "Patel", d5a_style: "border-color:var(--info);color:var(--info);background:var(--info-bg);", d5a_disp: "block", d5b_disp: "none", d5b_lbl: "", d5b_style: "", d5off_disp: "none", d5off_lbl: "",
        d6a_lbl: "", d6a_style: "", d6a_disp: "none", d6b_disp: "none", d6b_lbl: "", d6b_style: "", d6off_disp: "none", d6off_lbl: ""
      },
      {
        avBg: "var(--slate)", avRadius: "6px", initials: "VW", name: "Van YVR-1", role: "16 ft · Vancouver", location: "Vancouver", kind: "vehicle",
        d0a_lbl: "", d0a_style: "", d0a_disp: "none", d0b_disp: "none", d0b_lbl: "", d0b_style: "", d0off_disp: "none", d0off_lbl: "",
        d1a_lbl: "", d1a_style: "", d1a_disp: "none", d1b_disp: "none", d1b_lbl: "", d1b_style: "", d1off_disp: "none", d1off_lbl: "",
        d2a_lbl: "Wong · LD", d2a_style: "border-color:var(--gold);color:#8B6324;background:var(--gold-soft);", d2a_disp: "block", d2b_disp: "none", d2b_lbl: "", d2b_style: "", d2off_disp: "none", d2off_lbl: "",
        d3a_lbl: "", d3a_style: "", d3a_disp: "none", d3b_disp: "none", d3b_lbl: "", d3b_style: "", d3off_disp: "none", d3off_lbl: "",
        d4a_lbl: "", d4a_style: "", d4a_disp: "none", d4b_disp: "none", d4b_lbl: "", d4b_style: "", d4off_disp: "none", d4off_lbl: "",
        d5a_lbl: "Wong · LD", d5a_style: "border-color:var(--gold);color:#8B6324;background:var(--gold-soft);", d5a_disp: "block", d5b_disp: "none", d5b_lbl: "", d5b_style: "", d5off_disp: "none", d5off_lbl: "",
        d6a_lbl: "", d6a_style: "", d6a_disp: "none", d6b_disp: "none", d6b_lbl: "", d6b_style: "", d6off_disp: "none", d6off_lbl: ""
      }
    ],
    // ── Timeline teams (Daily view) ──
    teams: [
      { name: "Team Alpha", dotColor: "var(--terra)", chip1: "2", chip2: "1", chipCap: "26 ft", chipCapBg: "var(--terra-soft)", chipCapColor: "var(--terra)", warnChip: "" },
      { name: "Team Blue",  dotColor: "var(--info)",  chip1: "2", chip2: "1", chipCap: "14 ft", chipCapBg: "var(--info-bg)",    chipCapColor: "var(--info)",  warnChip: "" },
      { name: "Team Gray",  dotColor: "var(--slate)", chip1: "",  chip2: "",  chipCap: "",      chipCapBg: "",                  chipCapColor: "",             warnChip: "No team assigned" },
      { name: "Team Teal",  dotColor: "var(--teal)",  chip1: "3", chip2: "1", chipCap: "26 ft", chipCapBg: "var(--teal-bg)",    chipCapColor: "var(--teal)",  warnChip: "" }
    ],
    // ── Day-off request templated rows (recordId baked in) ──
    dayOffPending: [
      { recordId: "1", avBg: "var(--info)", initials: "AZ", name: "Alex Zu",        role: "Driver", statusClass: "warn", statusLabel: "Pending", dates: "May 13 – May 14", duration: "2 days", reason: "Family event in Oshawa. Can swap with Paul if needed." },
      { recordId: "2", avBg: "var(--teal)", initials: "JM", name: "Jackson Mungai", role: "Mover",  statusClass: "warn", statusLabel: "Pending", dates: "May 22",          duration: "1 day",  reason: "Doctor's appointment, half-day morning would also work." },
      { recordId: "3", avBg: "var(--plum)", initials: "GA", name: "Gurtsik Ann",    role: "Helper", statusClass: "warn", statusLabel: "Pending", dates: "May 24 – May 30", duration: "1 week", reason: "Vacation. Submitted 6 weeks in advance." }
    ],
    dayOffApproved: [
      { recordId: "4", avBg: "var(--terra)", initials: "AH", name: "Andrew Haylton", role: "Team Leader", statusClass: "ok", statusLabel: "Approved", dates: "May 13",          duration: "1 day",  reason: "Approved by Admin · May 8" },
      { recordId: "5", avBg: "var(--info)",  initials: "DJ", name: "Donald James",   role: "Team Leader", statusClass: "ok", statusLabel: "Approved", dates: "May 18 – May 20", duration: "3 days", reason: "Approved by Admin · May 10" },
      { recordId: "6", avBg: "var(--teal)",  initials: "PR", name: "Paul Rai",       role: "Mover",       statusClass: "ok", statusLabel: "Approved", dates: "Jun 2",           duration: "1 day",  reason: "Approved by Admin · May 11" }
    ],
    dayOffDenied: [
      { recordId: "7", avBg: "var(--rose)", initials: "GS", name: "Gerald Sabados", role: "Team Leader", statusClass: "bad", statusLabel: "Denied", dates: "May 16", duration: "1 day", reason: "Denied · Saturday peak day, no coverage available. Suggest May 23 instead." }
    ],
    // ── Column headers (counts) ──
    dayOffPendingTitle:  "Pending · 3",
    dayOffApprovedTitle: "Approved · 5",
    dayOffDeniedTitle:   "Denied · 1",
    // ── Day-off KPI cards ──
    dayOffKpis: {
      pending: "3",  pendingSub:  "awaiting approval",
      approved: "5", approvedSub: "this month",
      denied: "1",   deniedSub:   "this month",
      risk: "Low",   riskSub:     "All shifts covered"
    },
    // ── Truck rentals cards ──
    truckRentalCards: [
      { name: "U-Haul · 26 ft",     sub: "Vendor: U-Haul Toronto East",       period: "May 14 – May 16", assigned: "Truck 5 · A. Haylton", cost: "$680",   days: "3 days", pillClass: "warn", pillLabel: "Returning today" },
      { name: "Penske · 22 ft",     sub: "Vendor: Penske Mississauga",        period: "May 15 – May 22", assigned: "Truck 6 · F. Waite",   cost: "$1,540", days: "7 days", pillClass: "ok",   pillLabel: "Active"          },
      { name: "Enterprise · 16 ft", sub: "Vendor: Enterprise Truck Rental",   period: "May 12 – May 15", assigned: "Backup · D. James",    cost: "$420",   days: "3 days", pillClass: "ok",   pillLabel: "Active"          },
      { name: "U-Haul · 26 ft",     sub: "Reserved for · Chen long-distance", period: "May 19 – May 21", assigned: "Unassigned",           cost: "$540",   days: "2 days", pillClass: "info", pillLabel: "Upcoming"        }
    ]
  };
  F["settings"] = {
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "pageTitle": "Profile",
    "profile": {
      "avatarLetter": "A",
      "name": "Admin User",
      "email": "admin@service1.com",
      "phone": "(555) 200-0143"
    },
    "roles": ["Admin", "Manager", "Sales", "Driver"],
    "timezones": ["America/Toronto (EDT)", "America/Vancouver"],
    "languages": ["English (US)", "Français"]
  };
  F["storage"] = {
  metrics: {
  "stat_delta": [
    "+$385 vs Apr"
  ]
},
  accounts: [{"id": 101, "name": "Jordan Chen", "units": "A-12 \u00b7 5\u00d710", "monthly": "$165", "balance": "$0", "since": "Apr 2024", "status": "active", "av": "JC", "avc": "var(--terra)"}, {"id": 102, "name": "Sara Foster", "units": "B-04 \u00b7 10\u00d710", "monthly": "$245", "balance": "$0", "since": "Jan 2023", "status": "active", "av": "SF", "avc": "var(--info)"}, {"id": 103, "name": "Northside Co.", "units": "C-12, C-13 \u00b7 2 units", "monthly": "$720", "balance": "$0", "since": "Oct 2022", "status": "active", "av": "NC", "avc": "var(--teal)"}, {"id": 104, "name": "Reed Inc.", "units": "C-14 \u00b7 10\u00d720", "monthly": "$385", "balance": "$0", "since": "Dec 2025", "status": "active", "av": "RI", "avc": "var(--plum)"}, {"id": 105, "name": "M. Parker", "units": "A-22 \u00b7 5\u00d710", "monthly": "$165", "balance": "\u2212$165", "since": "Mar 2025", "status": "suspended", "av": "MP", "avc": "var(--warn)"}, {"id": 106, "name": "Tao Anand", "units": "B-09 \u00b7 10\u00d710", "monthly": "$245", "balance": "$0", "since": "Aug 2024", "status": "active", "av": "TA", "avc": "var(--info)"}, {"id": 107, "name": "L. Dunlop", "units": "A-08 \u00b7 5\u00d710", "monthly": "\u2014", "balance": "$0", "since": "Jan 2021", "status": "closed", "av": "LD", "avc": "var(--ink-3)"}, {"id": 108, "name": "Maple Court Condos", "units": "C-08 \u00b7 10\u00d720", "monthly": "$385", "balance": "$0", "since": "Jun 2025", "status": "active", "av": "MC", "avc": "var(--teal)"}, {"id": 109, "name": "R. Chen", "units": "B-11 \u00b7 10\u00d710", "monthly": "$245", "balance": "\u2212$700", "since": "Feb 2024", "status": "suspended", "av": "RC", "avc": "var(--warn)"}, {"id": 110, "name": "Daniel Park", "units": "A-04 \u00b7 5\u00d75", "monthly": "$120", "balance": "$0", "since": "Mar 2024", "status": "active", "av": "DP", "avc": "var(--terra)"}, {"id": 111, "name": "Old Mill Holdings", "units": "C-01 \u00b7 10\u00d720", "monthly": "\u2014", "balance": "$0", "since": "Nov 2020", "status": "closed", "av": "OM", "avc": "var(--ink-3)"}, {"id": 112, "name": "Pinewood Estates", "units": "C-09, C-10 \u00b7 2 units", "monthly": "$720", "balance": "$0", "since": "Sep 2024", "status": "active", "av": "PE", "avc": "var(--plum)"}],
  mutedCounts: {"0": "32", "1": "28", "2": "3", "3": "1"},
  paymentMethodOptions: [{"value": "Card on file", "label": "Card on file"}, {"value": "Auto-debit (ACH)", "label": "Auto-debit (ACH)"}, {"value": "Invoice", "label": "Invoice"}, {"value": "Cash / cheque", "label": "Cash / cheque"}],
  billingCycleOptions: [{"value": "Monthly (1st)", "label": "Monthly (1st)"}, {"value": "Monthly (15th)", "label": "Monthly (15th)"}, {"value": "Quarterly", "label": "Quarterly"}, {"value": "Annual (prepaid)", "label": "Annual (prepaid)"}],
  climateControlledOptions: [{"value": "No", "label": "No"}, {"value": "Yes", "label": "Yes"}],
  sizeOptions2: [{"value": "5\u00d75", "label": "5\u00d75"}, {"value": "5\u00d710", "label": "5\u00d710"}, {"value": "10\u00d710", "label": "10\u00d710"}, {"value": "10\u00d720", "label": "10\u00d720"}, {"value": "Custom\u2026", "label": "Custom\u2026"}],
  accountTypeOptions: [{"value": "Residential", "label": "Residential"}, {"value": "Commercial", "label": "Commercial"}, {"value": "Long-term", "label": "Long-term"}],
  subtitle: "32",
  kpis: [
  {
    "label": "Total accounts",
    "value": "32",
    "delta": "across 3 buildings"
  },
  {
    "label": "Active",
    "value": "28",
    "delta": "2 past due"
  },
  {
    "label": "Total units",
    "value": "42",
    "delta": "38 occupied \u00b7 90% fill"
  },
  {
    "label": "Monthly revenue",
    "value": "$7,820",
    "delta": ""
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "42 units · 32 occupied · 8 vacant · 2 maintenance",
    "counts": { "units": "42", "customers": "32", "maintenance": "2" },
    "stats": {
      "occupancyPct": "76",
      "occupancyDelta": "32 of 42 units",
      "revenue": "$8,420",
      "revenueDelta": "5%",
      "tenure": "7.4",
      "tenureDelta": "2 over 18 months",
      "pastDue": "2",
      "pastDueDelta": "$640 outstanding"
    },
    "chips": { "all": "42", "s5x5": "12", "s5x10": "14", "s10x10": "10", "s10x20": "6" },
    "units": [
      { "id": "A-101", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "5×5 ft · 5×5 cuft", "customer": "Alice Johnson", "since": "Since Mar 2026", "fillDisplay": "block", "fill": "62", "fillColor": "var(--terra)" },
      { "id": "A-102", "bg": "var(--surface-2)", "idColor": "var(--ink-3)", "pillBg": "var(--surface-3)", "pillColor": "var(--ink-3)", "status": "Vacant", "dims": "5×5 ft · 5×5 cuft", "customer": "—", "since": "Available", "fillDisplay": "none", "fill": "0", "fillColor": "var(--terra)" },
      { "id": "A-103", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "5×5 ft · 5×5 cuft", "customer": "R. Patel", "since": "Since Jan 2026", "fillDisplay": "block", "fill": "88", "fillColor": "var(--warn)" },
      { "id": "A-104", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "5×5 ft · 5×5 cuft", "customer": "M. Khan", "since": "Since Sep 2025", "fillDisplay": "block", "fill": "45", "fillColor": "var(--terra)" },
      { "id": "B-201", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "5×10 ft · 10×10 cuft", "customer": "Tao Anand", "since": "Since Nov 2025", "fillDisplay": "block", "fill": "78", "fillColor": "var(--terra)" },
      { "id": "B-202", "bg": "var(--surface-2)", "idColor": "var(--ink-3)", "pillBg": "var(--surface-3)", "pillColor": "var(--ink-3)", "status": "Vacant", "dims": "5×10 ft · 10×10 cuft", "customer": "—", "since": "Available", "fillDisplay": "none", "fill": "0", "fillColor": "var(--terra)" },
      { "id": "B-203", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "5×10 ft · 10×10 cuft", "customer": "Northside Co.", "since": "Since Feb 2026", "fillDisplay": "block", "fill": "92", "fillColor": "var(--warn)" },
      { "id": "C-301", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "10×10 ft · 20×20 cuft", "customer": "Cox Family", "since": "Since Aug 2025", "fillDisplay": "block", "fill": "71", "fillColor": "var(--terra)" },
      { "id": "C-302", "bg": "var(--warn-soft)", "idColor": "var(--warn)", "pillBg": "var(--warn-soft)", "pillColor": "var(--warn)", "status": "Maintenance", "dims": "10×10 ft · 20×20 cuft", "customer": "—", "since": "Maintenance", "fillDisplay": "none", "fill": "0", "fillColor": "var(--terra)" },
      { "id": "C-303", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "10×10 ft · 20×20 cuft", "customer": "P. Adams", "since": "Since Apr 2026", "fillDisplay": "block", "fill": "54", "fillColor": "var(--terra)" },
      { "id": "C-304", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "10×10 ft · 20×20 cuft", "customer": "Hill Estate", "since": "Since Oct 2025", "fillDisplay": "block", "fill": "96", "fillColor": "var(--warn)" },
      { "id": "D-401", "bg": "#fff", "idColor": "var(--terra)", "pillBg": "var(--terra-soft)", "pillColor": "var(--terra)", "status": "Occupied", "dims": "10×20 ft · 40×40 cuft", "customer": "Reed Inc.", "since": "Since Dec 2025", "fillDisplay": "block", "fill": "83", "fillColor": "var(--terra)" }
    ]
  };
  F["tasks"] = {
  metrics: {
  "count": [
    "8",
    "6",
    "3",
    "12"
  ]
},
  tasks: [{"id": 1, "title": "Send Q3 quote to Northside Co.", "project": "Sales pipeline", "assignee": "John Sales", "av": "JS", "avc": "var(--terra)", "priority": "High", "due": "Today", "overdue": false, "status": "ToDo"}, {"id": 2, "title": "Follow up on stalled deal \u00b7 Cedar Lane HOA", "project": "Sales pipeline", "assignee": "John Sales", "av": "JS", "avc": "var(--terra)", "priority": "Medium", "due": "Tomorrow", "overdue": false, "status": "ToDo"}, {"id": 3, "title": "Update vehicle inspection SOP", "project": "Operations Q2", "assignee": "Andrew Haylton", "av": "AH", "avc": "var(--info)", "priority": "Medium", "due": "Fri May 23", "overdue": false, "status": "ToDo"}, {"id": 4, "title": "Onboard new hire \u00b7 Diego Romero", "project": "HR \u2014 onboarding", "assignee": "Admin User", "av": "A", "avc": "var(--plum)", "priority": "Low", "due": "May 27", "overdue": false, "status": "ToDo"}, {"id": 5, "title": "Refresh Google Ads campaign copy", "project": "Marketing campaign", "assignee": "Jane Finance", "av": "JF", "avc": "var(--teal)", "priority": "Low", "due": "May 28", "overdue": false, "status": "ToDo"}, {"id": 6, "title": "Replace 2 dollies (Van 03)", "project": "Operations Q2", "assignee": "Andrew Haylton", "av": "AH", "avc": "var(--info)", "priority": "Urgent", "due": "Yesterday", "overdue": true, "status": "ToDo"}, {"id": 7, "title": "Schedule quarterly safety review", "project": "Operations Q2", "assignee": "Donald James", "av": "DJ", "avc": "var(--info)", "priority": "Medium", "due": "Jun 02", "overdue": false, "status": "ToDo"}, {"id": 8, "title": "Review crew bonus structure", "project": "HR \u2014 onboarding", "assignee": "Jane Finance", "av": "JF", "avc": "var(--teal)", "priority": "Low", "due": "Jun 10", "overdue": false, "status": "ToDo"}, {"id": 9, "title": "Reconcile April Stripe payouts", "project": "Operations Q2", "assignee": "Jane Finance", "av": "JF", "avc": "var(--teal)", "priority": "High", "due": "Today", "overdue": false, "status": "InProgress"}, {"id": 10, "title": "Draft Northside Co. contract v3", "project": "Sales pipeline", "assignee": "John Sales", "av": "JS", "avc": "var(--terra)", "priority": "High", "due": "Tomorrow", "overdue": false, "status": "InProgress"}, {"id": 11, "title": "Coaching session \u00b7 Alex Zu (HOS)", "project": "Operations Q2", "assignee": "Admin User", "av": "A", "avc": "var(--plum)", "priority": "Urgent", "due": "Today 3 PM", "overdue": false, "status": "InProgress"}, {"id": 12, "title": "Photo audit \u00b7 Truck 14 May loads", "project": "Operations Q2", "assignee": "Fred Waite", "av": "FW", "avc": "var(--teal)", "priority": "Medium", "due": "This week", "overdue": false, "status": "InProgress"}, {"id": 13, "title": "New customer survey \u00b7 post-move", "project": "Marketing campaign", "assignee": "Jane Finance", "av": "JF", "avc": "var(--teal)", "priority": "Low", "due": "May 24", "overdue": false, "status": "InProgress"}, {"id": 14, "title": "Migrate dashcam footage Q1", "project": "Operations Q2", "assignee": "Admin User", "av": "A", "avc": "var(--plum)", "priority": "Low", "due": "May 30", "overdue": false, "status": "InProgress"}, {"id": 15, "title": "P&L close \u00b7 April", "project": "Operations Q2", "assignee": "Jane Finance", "av": "JF", "avc": "var(--teal)", "priority": "High", "due": "May 03", "overdue": true, "status": "Review"}, {"id": 16, "title": "Driver training video \u2014 final cut", "project": "Marketing campaign", "assignee": "Paul Rai", "av": "PR", "avc": "var(--plum)", "priority": "Medium", "due": "This week", "overdue": false, "status": "Review"}, {"id": 17, "title": "Update employee handbook v4", "project": "HR \u2014 onboarding", "assignee": "Admin User", "av": "A", "avc": "var(--plum)", "priority": "Low", "due": "May 22", "overdue": false, "status": "Review"}, {"id": 18, "title": "Q1 tax filing \u00b7 HST", "project": "Operations Q2", "assignee": "Jane Finance", "av": "JF", "avc": "var(--teal)", "priority": "High", "due": "Apr 30", "overdue": false, "status": "Done"}, {"id": 19, "title": "Renew Truck 14 annual inspection", "project": "Operations Q2", "assignee": "Andrew Haylton", "av": "AH", "avc": "var(--info)", "priority": "Medium", "due": "Apr 28", "overdue": false, "status": "Done"}, {"id": 20, "title": "Hire Diego Romero (dispatcher)", "project": "HR \u2014 onboarding", "assignee": "Admin User", "av": "A", "avc": "var(--plum)", "priority": "High", "due": "Apr 20", "overdue": false, "status": "Done"}, {"id": 21, "title": "Spring sale email campaign", "project": "Marketing campaign", "assignee": "Jane Finance", "av": "JF", "avc": "var(--teal)", "priority": "Low", "due": "Apr 12", "overdue": false, "status": "Done"}],
  recurrenceOptions: [{"value": "Daily", "label": "Daily"}, {"value": "Weekly", "label": "Weekly"}, {"value": "Bi-weekly", "label": "Bi-weekly"}, {"value": "Monthly", "label": "Monthly"}],
  linkedToOptions: [{"value": "Customer", "label": "Customer"}, {"value": "Job", "label": "Job"}, {"value": "Ticket", "label": "Ticket"}, {"value": "Invoice", "label": "Invoice"}],
  projectOptions: [{"value": "Sales pipeline", "label": "Sales pipeline"}, {"value": "Operations Q2", "label": "Operations Q2"}, {"value": "Marketing campaign", "label": "Marketing campaign"}, {"value": "HR \u2014 onboarding", "label": "HR \u2014 onboarding"}],
  assigneeOptions: [{"value": "Admin User", "label": "Admin User"}, {"value": "John Sales", "label": "John Sales"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Donald James", "label": "Donald James"}, {"value": "Paul Rai", "label": "Paul Rai"}],
  priorityOptions: [{"value": "Low", "label": "Low"}, {"value": "Medium", "label": "Medium"}, {"value": "High", "label": "High"}, {"value": "Urgent", "label": "Urgent"}],
  statusOptions: [{"value": "To Do", "label": "To Do"}, {"value": "In Progress", "label": "In Progress"}, {"value": "Review", "label": "Review"}, {"value": "Done", "label": "Done"}],
  fpriorityOptions: [{"value": "Urgent", "label": "Urgent"}, {"value": "High", "label": "High"}, {"value": "Medium", "label": "Medium"}, {"value": "Low", "label": "Low"}],
  fassigneeOptions: [{"value": "Admin User", "label": "Admin User"}, {"value": "Alex Zu", "label": "Alex Zu"}, {"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Donald James", "label": "Donald James"}, {"value": "Fred Waite", "label": "Fred Waite"}, {"value": "Jackson Mungai", "label": "Jackson Mungai"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "John Sales", "label": "John Sales"}, {"value": "Paul Rai", "label": "Paul Rai"}],
  fprojectOptions: [{"value": "Sales pipeline", "label": "Sales pipeline"}, {"value": "Operations Q2", "label": "Operations Q2"}, {"value": "Marketing campaign", "label": "Marketing campaign"}, {"value": "HR \u2014 onboarding", "label": "HR \u2014 onboarding"}],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "12 open · 4 due today",
    "counts": { "all": 28, "mine": 7, "dueToday": 4, "overdue": 2, "thisWeek": 6, "completedToday": 5 },
    "stats": {
      "open": 12, "openSub": "across 8 jobs",
      "overdue": 2, "overdueSub": "requires escalation",
      "completedWeek": 38, "completedDelta": "12%",
      "avgDays": "2.3"
    },
    "overdue": [
      { "name": "Follow up with R. Chen on long-distance quote", "tag": "Sales", "deal": "Deal · 17878-1", "priority": "High", "priorityClass": "high", "due": "3 days late", "assignee": "John Sales",   "avInitials": "JS", "avBg": "var(--terra)" },
      { "name": "Send insurance certificate to Northside Co.",   "tag": "Ops",   "deal": "Deal · 17821-1", "priority": "Med",  "priorityClass": "med",  "due": "1 day late",  "assignee": "Donald James", "avInitials": "DJ", "avBg": "var(--info)" }
    ],
    "dueToday": [
      { "name": "Confirm survey time with J. Lopez",          "tag": "Sales",   "deal": "Deal · 17872-1", "priority": "High", "priorityClass": "high", "due": "Today · 1:00 PM", "assignee": "John Sales",   "avInitials": "JS", "avBg": "var(--terra)" },
      { "name": "Prepare Growth Plan for M. Lee packing job", "tag": "Sales",   "deal": "Deal · 17880-1", "priority": "Med",  "priorityClass": "med",  "due": "Today",           "assignee": "Jane Finance", "avInitials": "JF", "avBg": "var(--info)" },
      { "name": "Inspect Truck 5 — return from maintenance",  "tag": "Ops",     "deal": "",               "priority": "Low",  "priorityClass": "low",  "due": "Today · 4:00 PM", "assignee": "A. Haylton",   "avInitials": "AH", "avBg": "var(--teal)" },
      { "name": "Reconcile May Stripe payouts",               "tag": "Finance", "deal": "",               "priority": "Med",  "priorityClass": "med",  "due": "Today · EOD",     "assignee": "Jane Finance", "avInitials": "JF", "avBg": "var(--info)" }
    ],
    "thisWeek": [
      { "name": "Schedule packing materials delivery",  "tag": "Ops",     "deal": "Deal · 17880-1", "priority": "Low", "priorityClass": "low", "due": "Mon · May 18", "assignee": "Paul Rai",     "avInitials": "PR", "avBg": "var(--plum)" },
      { "name": "Review Q2 KPIs with leadership",       "tag": "Admin",   "deal": "",               "priority": "Med", "priorityClass": "med", "due": "Tue · May 19", "assignee": "Admin",        "avInitials": "A",  "avBg": "var(--terra)" },
      { "name": "Follow up — A. Johnson move review",   "tag": "Service", "deal": "Deal · 17826-1", "priority": "Low", "priorityClass": "low", "due": "Wed · May 20", "assignee": "John Sales",   "avInitials": "JS", "avBg": "var(--terra)" },
      { "name": "Update employee training records",     "tag": "HR",      "deal": "",               "priority": "Low", "priorityClass": "low", "due": "Fri · May 22", "assignee": "Jane Finance", "avInitials": "JF", "avBg": "var(--info)" }
    ],
    "completed": [
      { "name": "Send portal link to A. Johnson",            "tag": "Sales", "deal": "Deal · 17826-1", "priority": "Low", "priorityClass": "low", "due": "Today · 9:38 AM", "assignee": "John Sales",   "avInitials": "JS", "avBg": "var(--terra)" },
      { "name": "Confirm box delivery window with S. Patel", "tag": "Ops",   "deal": "Deal · 17870-1", "priority": "Low", "priorityClass": "low", "due": "Today · 8:14 AM", "assignee": "Donald James", "avInitials": "DJ", "avBg": "var(--info)" }
    ]
  };
  F["tickets"] = {
  metrics: {
  "stat_delta": [
    "CSAT 94%"
  ]
},
  tickets: [{"id": "CL-2418", "customer": "Aurora Properties", "priority": "High", "type": "Monthly Budget Increase", "created": "May 18", "last": "2h ago", "assignee": "John Sales", "status": "In Progress", "bucket": "active", "st": "ip"}, {"id": "CL-2417", "customer": "Northside Co.", "priority": "Med", "type": "Ad Copy", "created": "May 17", "last": "5h ago", "assignee": "Jane Finance", "status": "Working - Account Manager", "bucket": "active", "st": "am"}, {"id": "CL-2416", "customer": "Pinewood Estates", "priority": "High", "type": "Pause Specific Platform", "created": "May 17", "last": "1d ago", "assignee": "Andrew Haylton", "status": "Not Started", "bucket": "active", "st": "ns"}, {"id": "CL-2415", "customer": "Cedar Lane HOA", "priority": "Med", "type": "Location Targeting", "created": "May 16", "last": "4h ago", "assignee": "John Sales", "status": "Negotiating", "bucket": "active", "st": "neg"}, {"id": "CL-2414", "customer": "Maple Court Condos", "priority": "Low", "type": "Ad Schedule", "created": "May 15", "last": "Yesterday", "assignee": "Paul Rai", "status": "In Progress", "bucket": "active", "st": "ip"}, {"id": "CL-2413", "customer": "Foundry Co.", "priority": "High", "type": "Monthly Budget Decrease", "created": "May 15", "last": "Yesterday", "assignee": "Jane Finance", "status": "Working - Delivery", "bucket": "active", "st": "del"}, {"id": "CL-2412", "customer": "Linwood Plaza", "priority": "Med", "type": "Additional Service", "created": "May 14", "last": "2d ago", "assignee": "John Sales", "status": "Negotiating", "bucket": "active", "st": "neg"}, {"id": "CL-2411", "customer": "Greenfield Apts", "priority": "Low", "type": "Ring-To Phone Number", "created": "May 13", "last": "3d ago", "assignee": "Andrew Haylton", "status": "In Progress", "bucket": "active", "st": "ip"}, {"id": "CL-2410", "customer": "Hillside Realty", "priority": "Med", "type": "Pause Service", "created": "May 10", "last": "May 13", "assignee": "John Sales", "status": "Resolved", "bucket": "completed", "st": "res"}, {"id": "CL-2409", "customer": "Beachway HOA", "priority": "Low", "type": "Common Change Requests", "created": "May 09", "last": "May 12", "assignee": "Paul Rai", "status": "Resolved", "bucket": "completed", "st": "res"}, {"id": "CL-2408", "customer": "Yorkdale Properties", "priority": "High", "type": "Monthly Budget Increase", "created": "May 04", "last": "May 11", "assignee": "Jane Finance", "status": "Closed", "bucket": "completed", "st": "closed"}, {"id": "CL-2407", "customer": "Riverside Centre", "priority": "Med", "type": "Ad Copy", "created": "Apr 28", "last": "May 02", "assignee": "John Sales", "status": "Resolved", "bucket": "completed", "st": "res"}, {"id": "CL-2406", "customer": "Old Mill Condos", "priority": "Low", "type": "Pause Service", "created": "Apr 12", "last": "Apr 18", "assignee": "\u2014", "status": "Closed", "bucket": "inactive", "st": "closed"}, {"id": "CL-2405", "customer": "Northpoint Plaza", "priority": "Low", "type": "Ad Schedule", "created": "Apr 02", "last": "Apr 04", "assignee": "\u2014", "status": "Closed", "bucket": "inactive", "st": "closed"}],
  assignedToOptions2: [{"value": "John Sales", "label": "John Sales"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Paul Rai", "label": "Paul Rai"}],
  statusOptions2: [{"value": "Not Started", "label": "Not Started"}, {"value": "In Progress", "label": "In Progress"}, {"value": "Negotiating", "label": "Negotiating"}, {"value": "Working - Delivery", "label": "Working - Delivery"}, {"value": "Working - Account Manager", "label": "Working - Account Manager"}, {"value": "Resolved", "label": "Resolved"}, {"value": "Closed", "label": "Closed"}],
  priorityOptions: [{"value": "Low", "label": "Low"}, {"value": "Medium", "label": "Medium"}, {"value": "High", "label": "High"}, {"value": "Urgent", "label": "Urgent"}],
  optionsOptions2: [{"value": "Common Change Requests", "label": "Common Change Requests"}, {"value": "Monthly Budget Increase", "label": "Monthly Budget Increase"}, {"value": "Monthly Budget Decrease", "label": "Monthly Budget Decrease"}, {"value": "Location Targeting", "label": "Location Targeting"}, {"value": "Additional Service", "label": "Additional Service"}, {"value": "Pause Service", "label": "Pause Service"}, {"value": "Pause Specific Platform", "label": "Pause Specific Platform"}, {"value": "Ad Schedule", "label": "Ad Schedule"}, {"value": "Ring-To Phone Number", "label": "Ring-To Phone Number"}, {"value": "Ad Copy", "label": "Ad Copy"}],
  optionsOptions: [{"value": "Aurora Properties", "label": "Aurora Properties"}, {"value": "Northside Co.", "label": "Northside Co."}, {"value": "Pinewood Estates", "label": "Pinewood Estates"}, {"value": "Cedar Lane HOA", "label": "Cedar Lane HOA"}, {"value": "Maple Court Condos", "label": "Maple Court Condos"}, {"value": "Foundry Co.", "label": "Foundry Co."}],
  assignedToOptions: [{"value": "John Sales", "label": "John Sales"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Paul Rai", "label": "Paul Rai"}],
  typeOptions: [{"value": "Common Change Requests", "label": "Common Change Requests"}, {"value": "Monthly Budget Increase", "label": "Monthly Budget Increase"}, {"value": "Monthly Budget Decrease", "label": "Monthly Budget Decrease"}, {"value": "Location Targeting", "label": "Location Targeting"}, {"value": "Additional Service", "label": "Additional Service"}, {"value": "Pause Service", "label": "Pause Service"}, {"value": "Pause Specific Platform", "label": "Pause Specific Platform"}, {"value": "Ad Schedule", "label": "Ad Schedule"}, {"value": "Ring-To Phone Number", "label": "Ring-To Phone Number"}, {"value": "Ad Copy", "label": "Ad Copy"}],
  statusOptions: [{"value": "Not Started", "label": "Not Started"}, {"value": "In Progress", "label": "In Progress"}, {"value": "Negotiating", "label": "Negotiating"}, {"value": "Working - Delivery", "label": "Working - Delivery"}, {"value": "Working - Account Manager", "label": "Working - Account Manager"}, {"value": "Resolved", "label": "Resolved"}, {"value": "Closed", "label": "Closed"}],
  subtitle: "Ad campaign change requests &amp; account work",
  kpis: [
  {
    "label": "Active tickets",
    "value": "14",
    "delta": "across 8 clients"
  },
  {
    "label": "Not started",
    "value": "5",
    "delta": "awaiting triage"
  },
  {
    "label": "In progress",
    "value": "6",
    "delta": "active work"
  },
  {
    "label": "Resolved \u00b7 30d",
    "value": "38",
    "delta": ""
  }
],
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "14 open · 3 awaiting reply > 24h",
    "counts": { "open": 14, "awaiting": 5, "pending": 3 },
    "stats": {
      "open": 14, "openSub": "5 unassigned",
      "awaiting": 3, "awaitingSub": "needs escalation",
      "avgResp": 42, "respDelta": "8m",
      "csat": 94, "csatSub": "38 of 41 responses"
    },
    "chips": { "all": 14, "billing": 4, "damage": 3, "scheduling": 3, "general": 4 },
    "tickets": [
      { "subject": "Damage to dining table — request for repair",        "ref": "#TKT-2418 · Deal 17712-1", "customer": "Rosa Martinez",  "avInitials": "RM", "avBg": "var(--bad)",   "category": "Damage claim", "categoryClass": "bad",   "priority": "High", "priorityClass": "bad",  "status": "Awaiting · 28h", "statusClass": "warn", "updated": "2 days ago" },
      { "subject": "Duplicate charge on invoice 17826-1",                "ref": "#TKT-2417",                "customer": "Alice Johnson",  "avInitials": "AJ", "avBg": "var(--info)",  "category": "Billing",      "categoryClass": "info",  "priority": "Med",  "priorityClass": "warn", "status": "Awaiting · 26h", "statusClass": "warn", "updated": "1 day ago" },
      { "subject": "Need to reschedule move from May 22 to May 24",     "ref": "#TKT-2416 · Deal 17878-1", "customer": "Rebecca Chen",   "avInitials": "RC", "avBg": "var(--terra)", "category": "Scheduling",   "categoryClass": "terra", "priority": "Med",  "priorityClass": "warn", "status": "Replied · 2h",   "statusClass": "info", "updated": "2h ago" },
      { "subject": "Question about insurance coverage for fragile items","ref": "#TKT-2415",                "customer": "Marcus Lee",     "avInitials": "ML", "avBg": "var(--plum)",  "category": "General",      "categoryClass": "",      "priority": "Low",  "priorityClass": "",     "status": "In progress",    "statusClass": "info", "updated": "4h ago" },
      { "subject": "Box delivery missed delivery window",                "ref": "#TKT-2414 · Deal 17870-1", "customer": "Sara Patel",     "avInitials": "SP", "avBg": "var(--gold)",  "category": "Scheduling",   "categoryClass": "terra", "priority": "Med",  "priorityClass": "warn", "status": "Resolved",       "statusClass": "ok",   "updated": "5h ago" },
      { "subject": "Need a receipt PDF for tax purposes",                "ref": "#TKT-2413",                "customer": "Northside Co.",  "avInitials": "NS", "avBg": "var(--teal)",  "category": "Billing",      "categoryClass": "info",  "priority": "Low",  "priorityClass": "",     "status": "In progress",    "statusClass": "info", "updated": "6h ago" },
      { "subject": "Refund request — cancelled within 48h window",       "ref": "#TKT-2412",                "customer": "Jordan Murphy",  "avInitials": "JM", "avBg": "var(--info)",  "category": "Billing",      "categoryClass": "info",  "priority": "High", "priorityClass": "bad",  "status": "Awaiting · 12h", "statusClass": "warn", "updated": "12h ago" },
      { "subject": "Lost a small box during move — looking for compensation","ref": "#TKT-2411 · Deal 17800-1", "customer": "Tao Anand",  "avInitials": "TA", "avBg": "var(--plum)",  "category": "Damage claim", "categoryClass": "bad",   "priority": "Med",  "priorityClass": "warn", "status": "In progress",    "statusClass": "info", "updated": "1 day ago" }
    ]
  };
  F["videosLibrary"] = {
  videos: [{"id": 1, "tag": "intro", "tagLbl": "INTRO", "title": "Hi Alice \u2014 quick intro from John at Service1", "sub": "For: A. Johnson \u00b7 14 views \u00b7 1:42", "dur": "1:42"}, {"id": 2, "tag": "intro", "tagLbl": "INTRO", "title": "Meeting you on Thursday \u2014 what to expect", "sub": "For: Northside Co \u00b7 9 views \u00b7 1:18", "dur": "1:18"}, {"id": 3, "tag": "follow_up", "tagLbl": "FOLLOW-UP", "title": "Hi Rebecca \u2014 checking in on your move quote", "sub": "For: R. Chen \u00b7 4 views \u00b7 0:58", "dur": "0:58"}, {"id": 4, "tag": "follow_up", "tagLbl": "FOLLOW-UP", "title": "Following up \u2014 Maple Court Condos quote", "sub": "For: Maple Court \u00b7 6 views \u00b7 1:24", "dur": "1:24"}, {"id": 5, "tag": "discount_offer", "tagLbl": "DISCOUNT OFFER", "title": "Tao \u2014 a special offer that expires Friday", "sub": "For: T. Anand \u00b7 11 views \u00b7 1:08", "dur": "1:08"}, {"id": 6, "tag": "discount_offer", "tagLbl": "DISCOUNT OFFER", "title": "For Pinewood Estates \u2014 repeat-customer discount", "sub": "For: Pinewood \u00b7 7 views \u00b7 1:32", "dur": "1:32"}, {"id": 7, "tag": "authority", "tagLbl": "AUTHORITY", "title": "Why Service1 \u2014 the difference vs. cheaper movers", "sub": "For: Cedar Lane HOA \u00b7 18 views \u00b7 2:08", "dur": "2:08"}, {"id": 8, "tag": "authority", "tagLbl": "AUTHORITY", "title": "How we handle commercial moves \u2014 Foundry Co. tour", "sub": "For: Foundry \u00b7 22 views \u00b7 2:48", "dur": "2:48"}, {"id": 9, "tag": "breakup", "tagLbl": "BREAKUP", "title": "Yorkdale \u2014 closing the file, last chance", "sub": "For: Yorkdale Properties \u00b7 3 views", "dur": "0:48"}, {"id": 10, "tag": "follow_up", "tagLbl": "FOLLOW-UP", "title": "Sara \u2014 answering your questions about boxes", "sub": "For: S. Patel \u00b7 5 views \u00b7 1:12", "dur": "1:12"}, {"id": 11, "tag": "intro", "tagLbl": "INTRO", "title": "Welcome to Service1 \u2014 your dedicated rep", "sub": "For: J. Lopez \u00b7 8 views \u00b7 1:36", "dur": "1:36"}, {"id": 12, "tag": "discount_offer", "tagLbl": "DISCOUNT OFFER", "title": "Daniel \u2014 early-booking discount for June moves", "sub": "For: D. Park \u00b7 4 views \u00b7 1:04", "dur": "1:04"}],
  mutedCounts: {"0": "24", "1": "8", "2": "7", "3": "4", "4": "3", "5": "2"},
  subtitle: "Personalized sales videos \u00b7 24 in your library",
    "_terms": {"job":"Job","jobs":"Jobs","lead":"Lead","leads":"Leads","estimate":"Estimate","estimates":"Estimates","booked":"Booked","crew":"Crew","crewMember":"Crew member","customer":"Customer","customers":"Customers","meeting":"Meeting","jobSize":"Job size","serviceLocation":"Service location","deliveryLocation":"Delivery location","campaign":"Campaign","campaigns":"Campaigns","modeCode":"default","modeName":"Default"}, "summary": "68 videos · training, ops, safety",
    "counts": { "all": "68", "training": "22", "operations": "18", "safety": "14", "quality": "8", "customer": "6" },
    "videos": [
      { "gradStart": "#A8C0BB", "gradEnd": "#4E6A5F", "duration": "4:32", "newDisplay": "inline-block", "title": "Pre-load truck inspection walkthrough", "category": "Operations", "views": "124 views" },
      { "gradStart": "#D4C3A1", "gradEnd": "#A88E5E", "duration": "8:14", "newDisplay": "none", "title": "Handling fragile items — proper wrapping", "category": "Operations", "views": "218 views" },
      { "gradStart": "#C9D3CB", "gradEnd": "#7E9389", "duration": "3:08", "newDisplay": "none", "title": "How to use the customer portal", "category": "Customer onboarding", "views": "412 views" },
      { "gradStart": "#8FA39A", "gradEnd": "#3E5A4F", "duration": "12:48", "newDisplay": "inline-block", "title": "Long-distance move handoff protocol", "category": "Operations", "views": "64 views" },
      { "gradStart": "#B5BFC9", "gradEnd": "#586976", "duration": "6:22", "newDisplay": "none", "title": "Driver safety: 360 walkaround", "category": "Safety", "views": "188 views" },
      { "gradStart": "#CDB69C", "gradEnd": "#896C4B", "duration": "2:14", "newDisplay": "none", "title": "Submitting your daily check-in", "category": "Training", "views": "512 views" },
      { "gradStart": "#9CB0A8", "gradEnd": "#506660", "duration": "5:46", "newDisplay": "none", "title": "Damage claim photo standards", "category": "Quality", "views": "96 views" },
      { "gradStart": "#BFCBD3", "gradEnd": "#6B7C88", "duration": "18:30", "newDisplay": "none", "title": "Office relocation playbook", "category": "Commercial", "views": "48 views" },
      { "gradStart": "#C0B5A8", "gradEnd": "#86755F", "duration": "3:52", "newDisplay": "none", "title": "How to log a near-miss", "category": "Safety", "views": "142 views" }
    ]
  };

  // v12 modules — demo data so standalone iframe / lab.html renders content.
  F["customers"] = {
  pagination: { currentPage: 1, totalPages: 1, pageSize: 14, shown: 14, total: 14 },
  headings: {
  "1": "Customers"
},
  strategyOptions: [],
  optionsOptions5: [{"value": "Change Status\u2026", "label": "Change Status\u2026"}, {"value": "Lead", "label": "Lead"}, {"value": "Opportunity", "label": "Opportunity"}, {"value": "Booked", "label": "Booked"}, {"value": "Closed", "label": "Closed"}],
  optionsOptions4: [{"value": "VIP", "label": "VIP"}, {"value": "Repeat", "label": "Repeat"}, {"value": "Slow Payer", "label": "Slow Payer"}, {"value": "Referrer", "label": "Referrer"}],
  optionsOptions3: [{"value": "Toronto", "label": "Toronto"}, {"value": "Vancouver", "label": "Vancouver"}, {"value": "Calgary", "label": "Calgary"}, {"value": "Ottawa", "label": "Ottawa"}],
  optionsOptions2: [{"value": "Google", "label": "Google"}, {"value": "Referral", "label": "Referral"}, {"value": "Other", "label": "Other"}],
  optionsOptions: [{"value": "Lead", "label": "Lead"}, {"value": "Opportunity", "label": "Opportunity"}, {"value": "Booked", "label": "Booked"}, {"value": "Closed", "label": "Closed"}, {"value": "Lost", "label": "Lost"}],
    summary: "286 customers · 41 VIP", counts: { total: 286, vip: 41, prospect: 24 },
    rows: [
  {
    "name": "Arpit",
    "subMeta": "",
    "company": "\u2014",
    "email": "arpitgurleen@gmail.com",
    "phone": "2896255033",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "toronto",
    "branchLabel": "TORONTO LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Johanna Kuyvenhoven",
    "subMeta": "Tentative",
    "company": "\u2014",
    "email": "jkuyvenhoven94@gmail.com",
    "phone": "5879204170",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Referral",
    "branchCls": "vancouver",
    "branchLabel": "VANCOUVER LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Keera Roberts",
    "subMeta": "",
    "company": "\u2014",
    "email": "keera.roberts@gmail.com",
    "phone": "6722082675",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "vancouver",
    "branchLabel": "VANCOUVER LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Harman",
    "subMeta": "",
    "company": "\u2014",
    "email": "harmansandhu1309@gmail.com",
    "phone": "7788162400",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "vancouver",
    "branchLabel": "VANCOUVER LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Vicky Milosevic-Hill",
    "subMeta": "",
    "company": "\u2014",
    "email": "milos1@bell.net",
    "phone": "9056163324",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "toronto",
    "branchLabel": "TORONTO LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Danielle Melnyk",
    "subMeta": "",
    "company": "\u2014",
    "email": "danideemelnyk@gmail.com",
    "phone": "4039915973",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "calgary",
    "branchLabel": "CALGARY LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "emily",
    "subMeta": "",
    "company": "\u2014",
    "email": "emilymkami@gmail.com",
    "phone": "5195773870",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "ottawa",
    "branchLabel": "OTTAWA LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Emma P",
    "subMeta": "",
    "company": "\u2014",
    "email": "emmapinheiro@hotmail.com",
    "phone": "7052411895",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Other",
    "branchCls": "toronto",
    "branchLabel": "TORONTO LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Frances",
    "subMeta": "",
    "company": "\u2014",
    "email": "ancheddar@hotmail.com",
    "phone": "7783182924",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "vancouver",
    "branchLabel": "VANCOUVER LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Kim Th",
    "subMeta": "",
    "company": "\u2014",
    "email": "thkimmed@gmail.com",
    "phone": "438 866 2737",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Other",
    "branchCls": "toronto",
    "branchLabel": "TORONTO LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Jane Scarffe",
    "subMeta": "",
    "company": "\u2014",
    "email": "jscarffe440@gmail.com",
    "phone": "6478630875",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "toronto",
    "branchLabel": "TORONTO LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Rajib Dey",
    "subMeta": "",
    "company": "\u2014",
    "email": "rajib.dey@mail.mcgill.ca",
    "phone": "9059891133",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "ottawa",
    "branchLabel": "OTTAWA LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "joanna C",
    "subMeta": "",
    "company": "\u2014",
    "email": "joannacaao@gmail.com",
    "phone": "7788356746",
    "statusCls": "lead",
    "statusLabel": "Lead",
    "source": "Google",
    "branchCls": "calgary",
    "branchLabel": "CALGARY LEAD",
    "tags": "\u2014",
    "revenue": "C$0.00"
  },
  {
    "name": "Natalia Kalil Silveira",
    "subMeta": "",
    "company": "\u2014",
    "email": "nkskalil@gmail.com",
    "phone": "6478195253",
    "statusCls": "booked",
    "statusLabel": "Booked",
    "source": "Website",
    "branchCls": "toronto",
    "branchLabel": "TORONTO",
    "tags": "\u2014",
    "revenue": "C$244.00"
  }
],
    emptyMessage: "No customers yet.",
    sources: [{value:"website",label:"Website"},{value:"referral",label:"Referral"},{value:"google",label:"Google"}],
    tags: [{value:"vip",label:"VIP"},{value:"prospect",label:"Prospect"},{value:"archived",label:"Archived"}],
    segments: [{value:"smb",label:"SMB"},{value:"enterprise",label:"Enterprise"}],
    industries: [{value:"residential",label:"Residential"},{value:"commercial",label:"Commercial"}]
  };
  F["createCustomer"] = {
  headings: {
  "1": "Create customer"
},
  locationBranchOptions: [{"value": "TORONTO (HQ)", "label": "TORONTO (HQ)"}, {"value": "MISSISSAUGA", "label": "MISSISSAUGA"}, {"value": "HAMILTON", "label": "HAMILTON"}, {"value": "VANCOUVER", "label": "VANCOUVER"}, {"value": "EDMONTON", "label": "EDMONTON"}, {"value": "CALGARY", "label": "CALGARY"}, {"value": "OTTAWA", "label": "OTTAWA"}],
  typeOptions: [{"value": "Residential", "label": "Residential"}, {"value": "Commercial", "label": "Commercial"}, {"value": "Real Estate Agent", "label": "Real Estate Agent"}, {"value": "Property Manager", "label": "Property Manager"}],
  optionsOptions: [{"value": "Lead", "label": "Lead"}, {"value": "Opportunity", "label": "Opportunity"}, {"value": "Booked", "label": "Booked"}, {"value": "Closed", "label": "Closed"}, {"value": "Lost", "label": "Lost"}],
  jobSizeOptions: [{"value": "Studio / Bachelor", "label": "Studio / Bachelor"}, {"value": "1 Bedroom", "label": "1 Bedroom"}, {"value": "2 Bedroom", "label": "2 Bedroom"}, {"value": "3 Bedroom", "label": "3 Bedroom"}, {"value": "4+ Bedroom / House", "label": "4+ Bedroom / House"}],
    summary: "New customer form", emptyMessage: "Fill the form, then save. Drafts auto-save.",
    rows: [
      { id: 1, name: "Primary contact: (not set)" },
      { id: 2, name: "Address: (not set)" }
    ],
    sourceOptions: [{"value": "Google Ads", "label": "Google Ads"}, {"value": "Organic Search", "label": "Organic Search"}, {"value": "Referral", "label": "Referral"}, {"value": "Facebook", "label": "Facebook"}, {"value": "Yelp", "label": "Yelp"}, {"value": "Walk-in / Call-in", "label": "Walk-in / Call-in"}],
    tagOptions: [{value:"vip",label:"VIP"},{value:"prospect",label:"Prospect"}],
    roleOptions: [{value:"primary",label:"Primary"},{value:"billing",label:"Billing"}],
    addressTypes: [{value:"home",label:"Home"},{value:"office",label:"Office"}]
  };
  F["createDocument"] = {
  headings: {
  "1": "Create document"
},
  autoExpireIfNotSignedInOptions: [{"value": "30 days", "label": "30 days"}, {"value": "14 days", "label": "14 days"}, {"value": "7 days", "label": "7 days"}, {"value": "Never", "label": "Never"}],
  reminderScheduleOptions: [{"value": "Daily until signed", "label": "Daily until signed"}, {"value": "Every 3 days", "label": "Every 3 days"}, {"value": "Weekly", "label": "Weekly"}, {"value": "No reminders", "label": "No reminders"}],
  optionsOptions3: [{"value": "Countersign", "label": "Countersign"}, {"value": "Signer", "label": "Signer"}, {"value": "CC only", "label": "CC only"}],
  optionsOptions2: [{"value": "Signer", "label": "Signer"}, {"value": "Approver", "label": "Approver"}, {"value": "CC only", "label": "CC only"}],
  templateOptions: [{"value": "Standard service contract \u2014 template", "label": "Standard service contract \u2014 template"}, {"value": "Long-distance addendum \u2014 template", "label": "Long-distance addendum \u2014 template"}, {"value": "Packing services rider \u2014 template", "label": "Packing services rider \u2014 template"}, {"value": "Damage waiver \u2014 template", "label": "Damage waiver \u2014 template"}, {"value": "Storage rental agreement \u2014 template", "label": "Storage rental agreement \u2014 template"}],
  branchOptions: [{"value": "Toronto HQ", "label": "Toronto HQ"}, {"value": "Mississauga", "label": "Mississauga"}, {"value": "Hamilton", "label": "Hamilton"}],
  linkedJobOptions: [{"value": "J-2841 \u00b7 Sarah Hess", "label": "J-2841 \u00b7 Sarah Hess"}, {"value": "J-2837 \u00b7 Mark Chen", "label": "J-2837 \u00b7 Mark Chen"}, {"value": "J-2840 \u00b7 Lia Petrov", "label": "J-2840 \u00b7 Lia Petrov"}],
  customerAccountOptions: [{"value": "Alice Johnson", "label": "Alice Johnson"}, {"value": "Northside Co.", "label": "Northside Co."}, {"value": "Sara Patel", "label": "Sara Patel"}, {"value": "Reed Inc.", "label": "Reed Inc."}, {"value": "Tao Anand", "label": "Tao Anand"}],
  recipientTypeOptions: [{"value": "Customer", "label": "Customer"}, {"value": "Vendor", "label": "Vendor"}, {"value": "Internal staff", "label": "Internal staff"}, {"value": "External party", "label": "External party"}],
  optionsOptions: [{"value": "Service Contract", "label": "Service Contract"}, {"value": "Quote", "label": "Quote"}, {"value": "Estimate", "label": "Estimate"}, {"value": "Invoice", "label": "Invoice"}, {"value": "Damage Waiver", "label": "Damage Waiver"}, {"value": "Storage Rental Agreement", "label": "Storage Rental Agreement"}, {"value": "Field Contract", "label": "Field Contract"}, {"value": "Other", "label": "Other"}],
    summary: "New document", emptyMessage: "Choose a template above to start.",
    rows: [
      { id: 1, name: "Template: Moving estimate — local move (3 pages)" },
      { id: 2, name: "Recipient: (not set)" }
    ],
    templates: [{value:"1",label:"Moving estimate"},{value:"2",label:"NDA"},{value:"3",label:"Storage contract"}],
    fieldKinds: [{value:"text",label:"Text"},{value:"signature",label:"Signature"},{value:"date",label:"Date"}],
    signerRoles: [{value:"customer",label:"Customer"},{value:"manager",label:"Manager"}],
    signingOrderOptions: [{value:"sequential",label:"Sequential"},{value:"parallel",label:"Parallel"}]
  };
  F["salesFollowUps"] = {
  pagination: { currentPage: 1, totalPages: 1, pageSize: 14, shown: 12, total: 12 },
  metrics: {
  "stat_delta": [
    "remaining after today"
  ]
},
  optionsOptions2: [{"value": "John Sales", "label": "John Sales"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Paul Rai", "label": "Paul Rai"}],
  optionsOptions: [{"value": "Website", "label": "Website"}, {"value": "Referral", "label": "Referral"}, {"value": "Advertisement", "label": "Advertisement"}, {"value": "Other", "label": "Other"}],
  subtitle: "113 total \u00b7 5 overdue \u00b7 40 due today",
  kpis: [
  {
    "label": "Total follow-ups",
    "value": "113",
    "delta": "across 24 reps"
  },
  {
    "label": "Overdue",
    "value": "5",
    "delta": "needs immediate action"
  },
  {
    "label": "Due today",
    "value": "40",
    "delta": "most before 5 PM"
  },
  {
    "label": "This week",
    "value": "28",
    "delta": ""
  }
],
    summary: "12 follow-ups · 4 overdue", counts: { total: 12, overdue: 4 },
    rows: [{"id": 2316, "customer": "Testpauk", "job": "J2026-0001", "followUp": "May 12, 2026", "overdue": true, "service": "Jun 10, 2026", "status": "booked", "lead": "Hot", "last": "May 09", "owner": "Paul Kihara"}, {"id": 2317, "customer": "Alice Johnson", "job": "J2026-0512", "followUp": "May 16, 2026", "overdue": false, "service": "May 22, 2026", "status": "booked", "lead": "Hot", "last": "Today", "owner": "John Sales"}, {"id": 2318, "customer": "Northside Co.", "job": "J2026-0514", "followUp": "May 16, 2026", "overdue": false, "service": "May 24, 2026", "status": "accepted", "lead": "Hot", "last": "2h ago", "owner": "John Sales"}, {"id": 2319, "customer": "Rebecca Chen", "job": "J2026-0511", "followUp": "May 14, 2026", "overdue": true, "service": "May 28, 2026", "status": "active", "lead": "Follow Up", "last": "2d ago", "owner": "Jane Finance"}, {"id": 2320, "customer": "Tao Anand", "job": "J2026-0509", "followUp": "May 18, 2026", "overdue": false, "service": "May 30, 2026", "status": "active", "lead": "Follow Up", "last": "3d ago", "owner": "John Sales"}, {"id": 2321, "customer": "Sara Patel", "job": "J2026-0508", "followUp": "May 16, 2026", "overdue": false, "service": "May 29, 2026", "status": "new-lead", "lead": "New", "last": "1d ago", "owner": "A. Haylton"}, {"id": 2322, "customer": "Maple Court Condos", "job": "J2026-0505", "followUp": "May 13, 2026", "overdue": true, "service": "Jun 08, 2026", "status": "active", "lead": "Follow Up", "last": "4d ago", "owner": "John Sales"}, {"id": 2323, "customer": "Daniel Park", "job": "J2026-0497", "followUp": "May 19, 2026", "overdue": false, "service": "Jun 12, 2026", "status": "active", "lead": "Follow Up", "last": "1d ago", "owner": "P. Kihara"}, {"id": 2324, "customer": "Cedar Lane HOA", "job": "J2026-0499", "followUp": "May 21, 2026", "overdue": false, "service": "Jun 04, 2026", "status": "active", "lead": "On Ice", "last": "1 wk", "owner": "John Sales"}, {"id": 2325, "customer": "Yorkdale Properties", "job": "J2026-0501", "followUp": "May 02, 2026", "overdue": true, "service": "\u2014", "status": "closed", "lead": "On Ice", "last": "2 wks", "owner": "Unassigned"}, {"id": 2326, "customer": "M. Tran", "job": "J2026-0504", "followUp": "May 20, 2026", "overdue": false, "service": "May 22, 2026", "status": "booked", "lead": "Hot", "last": "Today", "owner": "A. Haylton"}, {"id": 2327, "customer": "Pinewood Estates", "job": "J2026-0498", "followUp": "May 17, 2026", "overdue": false, "service": "Jun 02, 2026", "status": "active", "lead": "Follow Up", "last": "5d ago", "owner": "John Sales"}],
    emptyMessage: "No follow-ups scheduled.",
    followUpReasons: [{value:"quote",label:"Quote sent"},{value:"book",label:"Awaiting booking"}],
    reps: [{value:"1",label:"Sara P."},{value:"2",label:"Jordan M."}],
    contactMethods: [{value:"phone",label:"Phone"},{value:"email",label:"Email"}],
    reasonOptions: [{value:"price",label:"Price"},{value:"timing",label:"Timing"}]
  };
  F["salesMyLeads"] = {
  pagination: { currentPage: 1, totalPages: 1, pageSize: 14, shown: 12, total: 12 },
  metrics: {
  "fc_count": [
    "12"
  ]
},
  leads: [{"id": 2886, "name": "Mendara Chan", "job": "J2026-0516", "status": "booked", "kind": "Booking", "lead": "Hot", "type": "Residential", "rev": "$298", "src": "Advertisement", "last": "\u2014", "av": "MC", "avc": "var(--terra)"}, {"id": 2885, "name": "Northside Co.", "job": "J2026-0514", "status": "accepted", "kind": "Quote", "lead": "Hot", "type": "Commercial", "rev": "$8,420", "src": "Referral", "last": "2h ago", "av": "NC", "avc": "var(--teal)"}, {"id": 2884, "name": "Alice Johnson", "job": "J2026-0512", "status": "booked", "kind": "Booking", "lead": "Hot", "type": "Residential", "rev": "$2,768", "src": "Website", "last": "Yesterday", "av": "AJ", "avc": "var(--terra)"}, {"id": 2883, "name": "Rebecca Chen", "job": "J2026-0511", "status": "opportunity", "kind": "Estimate", "lead": "Follow Up", "type": "Long dist.", "rev": "$3,140", "src": "Referral", "last": "2d ago", "av": "RC", "avc": "var(--info)"}, {"id": 2882, "name": "Tao Anand", "job": "J2026-0509", "status": "opportunity", "kind": "Estimate", "lead": "New", "type": "Packing", "rev": "$1,890", "src": "Website", "last": "3d ago", "av": "TA", "avc": "var(--plum)"}, {"id": 2881, "name": "Sara Patel", "job": "J2026-0508", "status": "new-lead", "kind": "Discovery", "lead": "New", "type": "Box delivery", "rev": "$540", "src": "Advertisement", "last": "1d ago", "av": "SP", "avc": "var(--gold)"}, {"id": 2880, "name": "Joaquin Lopez", "job": "J2026-0506", "status": "accepted", "kind": "Quote", "lead": "Hot", "type": "Residential", "rev": "$2,420", "src": "Referral", "last": "4h ago", "av": "JL", "avc": "var(--info)"}, {"id": 2879, "name": "Maple Court Condos", "job": "J2026-0505", "status": "opportunity", "kind": "Estimate", "lead": "Follow Up", "type": "Commercial", "rev": "$8,200", "src": "Website", "last": "2d ago", "av": "MC", "avc": "var(--teal)"}, {"id": 2878, "name": "M. Tran", "job": "J2026-0504", "status": "booked", "kind": "Booking", "lead": "Hot", "type": "Residential", "rev": "$1,240", "src": "Other", "last": "Today", "av": "MT", "avc": "var(--terra)"}, {"id": 2877, "name": "Yorkdale Properties", "job": "J2026-0501", "status": "closed", "kind": "Lost", "lead": "On Ice", "type": "Commercial", "rev": "\u2014", "src": "Referral", "last": "2 wks ago", "av": "YP", "avc": "var(--ink-3)"}, {"id": 2876, "name": "Cedar Lane HOA", "job": "J2026-0499", "status": "opportunity", "kind": "Negotiation", "lead": "Follow Up", "type": "Commercial", "rev": "$1,950", "src": "Referral", "last": "5d ago", "av": "CL", "avc": "var(--teal)"}, {"id": 2875, "name": "Pinewood Estates", "job": "J2026-0498", "status": "opportunity", "kind": "Negotiation", "lead": "Follow Up", "type": "Commercial", "rev": "$2,400", "src": "Referral", "last": "1 wk ago", "av": "PE", "avc": "var(--plum)"}],
  optionsOptions2: [{"value": "Hot", "label": "Hot"}, {"value": "New", "label": "New"}, {"value": "Follow Up", "label": "Follow Up"}, {"value": "On Ice", "label": "On Ice"}],
  optionsOptions: [{"value": "John Sales", "label": "John Sales"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "Andrew Haylton", "label": "Andrew Haylton"}, {"value": "Paul Rai", "label": "Paul Rai"}],
  subtitle: "12 active \u00b7 4 booked this month",
    summary: "18 active leads · $42,800 in pipeline", counts: { total: 18, won: 3, lost: 2 },
    rows: [
      { id: 201, name: "Brown family · local move · $1,800 · stage: Quoted" },
      { id: 202, name: "Henderson · long-distance · $4,200 · stage: Contacted" }
    ],
    emptyMessage: "No leads yet.",
    stages: [{value:"new",label:"New"},{value:"contacted",label:"Contacted"},{value:"quoted",label:"Quoted"},{value:"won",label:"Won"},{value:"lost",label:"Lost"}],
    lossReasonOptions: [{value:"price",label:"Price"},{value:"competitor",label:"Competitor"},{value:"timing",label:"Timing"}],
    leadSources: [{value:"website",label:"Website"},{value:"google",label:"Google ads"},{value:"referral",label:"Referral"}]
  };
  F["salesNewLeads"] = {
  pagination: { currentPage: 1, totalPages: 1, pageSize: 14, shown: 8, total: 8 },
  metrics: {
  "stat_delta": [
    "across 3 reps"
  ],
  "fc_count": [
    "593",
    "8",
    "412",
    "173"
  ]
},
  leads: [{"id": 1382, "name": "Max Yeh", "phone": "(416) 999-8233", "region": "toronto", "regionLbl": "TORONTO", "status": "hot", "date": "May 30, 2026", "size": "Medium", "from": "Toronto, ON", "to": "Hamilton, ON", "type": "Local", "source": "Advertisement"}, {"id": 1381, "name": "Elisa Gentile", "phone": "(647) 926-1610", "region": "toronto", "regionLbl": "TORONTO", "status": "new", "date": "Jun 4, 2026", "size": "Large", "from": "North York, ON", "to": "Toronto, ON", "type": "Local", "source": "Website"}, {"id": 1380, "name": "Marcus Brown", "phone": "(403) 555-1144", "region": "calgary", "regionLbl": "CALGARY", "status": "new", "date": "May 26, 2026", "size": "Small", "from": "Calgary, AB", "to": "Calgary, AB", "type": "Local", "source": "Referral"}, {"id": 1379, "name": "Aisha Khan", "phone": "(905) 401-8290", "region": "toronto", "regionLbl": "TORONTO", "status": "hot", "date": "May 22, 2026", "size": "Large", "from": "Mississauga, ON", "to": "Vaughan, ON", "type": "Local", "source": "Website"}, {"id": 1378, "name": "Daniel Park", "phone": "(604) 730-2014", "region": "vancouver", "regionLbl": "VANCOUVER", "status": "warm", "date": "Jun 12, 2026", "size": "Medium", "from": "Vancouver, BC", "to": "Burnaby, BC", "type": "Local", "source": "Other"}, {"id": 1377, "name": "Sara Patel", "phone": "(416) 240-1192", "region": "toronto", "regionLbl": "TORONTO", "status": "new", "date": "May 29, 2026", "size": "Small", "from": "Toronto, ON", "to": "Mississauga, ON", "type": "Boxes only", "source": "Website"}, {"id": 1376, "name": "Jordan Chen", "phone": "(587) 226-9128", "region": "calgary", "regionLbl": "CALGARY", "status": "warm", "date": "Jun 18, 2026", "size": "Medium", "from": "Calgary, AB", "to": "Edmonton, AB", "type": "Long distance", "source": "Advertisement"}, {"id": 1375, "name": "Rebecca Chen", "phone": "(416) 808-1245", "region": "toronto", "regionLbl": "TORONTO", "status": "hot", "date": "May 28, 2026", "size": "Large", "from": "Toronto, ON", "to": "Montreal, QC", "type": "Long distance", "source": "Referral"}],
  optionsOptions: [{"value": "Website", "label": "Website"}, {"value": "Referral", "label": "Referral"}, {"value": "Advertisement", "label": "Advertisement"}, {"value": "Other", "label": "Other"}],
  subtitle: "593 total \u00b7 8 hot \u00b7 4 grabbed today",
  kpis: [
  {
    "label": "Total leads",
    "value": "593",
    "delta": "all sources, all statuses"
  },
  {
    "label": "Hot \u00b7 last 15m",
    "value": "8",
    "delta": "need immediate response"
  },
  {
    "label": "Grabbed today",
    "value": "4",
    "delta": ""
  }
],
    summary: "6 unclaimed leads", counts: { total: 6 },
    rows: [
      { id: 301, name: "Webform · Jamie Lee · today 09:14" },
      { id: 302, name: "Webform · Andre Patel · today 10:32" }
    ],
    emptyMessage: "Inbox is clear.",
    owners: [{value:"1",label:"Sara P."},{value:"2",label:"Jordan M."}],
    sources: [{value:"website",label:"Website"},{value:"google",label:"Google ads"}],
    declineReasonOptions: [{value:"capacity",label:"At capacity"},{value:"area",label:"Out of area"},{value:"junk",label:"Junk lead"}]
  };
  F["messages"] = {
  threads: [
  {
    "thread": {
      "subject": "Re: Your moving quote",
      "meta": "Johanna Kuyvenhoven <jkuyvenhoven94@gmail.com> \u00b7 Assigned to John Sales \u00b7 Opened May 21, 1:02 PM"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Johanna Kuyvenhoven",
        "time": "2:14 PM",
        "body": "Hi! Just wanted to confirm the dates work for our team, and we're hoping to lock in the morning slot if possible. Also, what's the deposit amount? Thanks!"
      },
      {
        "dir": "out",
        "from": "John Sales (you)",
        "time": "1:48 PM",
        "body": "Hi Johanna! Yes, June 14 morning slot is open and reserved for you. The deposit is $100 to confirm \u2014 I'll send a payment link in a separate email."
      },
      {
        "dir": "in",
        "from": "Johanna Kuyvenhoven",
        "time": "1:02 PM",
        "body": "Perfect, looking forward to it."
      }
    ],
    "customer": {
      "name": "Johanna Kuyvenhoven",
      "status": "Lead \u00b7 Tentative",
      "avInitials": "JK",
      "avBg": "#1E40AF",
      "email": "jkuyvenhoven94@gmail.com",
      "phone": "5879204170",
      "branch": "Vancouver Lead",
      "source": "Referral"
    },
    "quote": {
      "line": "QT-2026-0588 \u00b7 C$1,840.00 \u00b7 Sent"
    }
  },
  {
    "thread": {
      "subject": "Storage contract renewal",
      "meta": "Acme Realty <ops@acme.test> \u00b7 Assigned to John Sales \u00b7 Opened May 21, 12:48 PM"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Acme Realty",
        "time": "12:48 PM",
        "body": "Could we extend the storage contract by another quarter? Same terms if possible."
      },
      {
        "dir": "out",
        "from": "John Sales (you)",
        "time": "12:30 PM",
        "body": "Hi \u2014 yes, happy to extend at the same monthly rate. I'll send the updated agreement over for signature today."
      }
    ],
    "customer": {
      "name": "Acme Realty",
      "status": "Active customer",
      "avInitials": "AM",
      "avBg": "#047857",
      "email": "ops@acme.test",
      "phone": "4165550101",
      "branch": "Toronto",
      "source": "Other"
    },
    "quote": {
      "line": "Contract SC-2025-014 \u00b7 C$420/mo \u00b7 Renewing"
    }
  },
  {
    "thread": {
      "subject": "Pickup time for Friday",
      "meta": "Rosa Martinez \u00b7 SMS \u00b7 Assigned to Sara P. \u00b7 Opened May 21, 11:02 AM"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Rosa Martinez",
        "time": "11:02 AM",
        "body": "Just checking \u2014 does 9 AM still work? Happy to push it back if needed."
      },
      {
        "dir": "out",
        "from": "Sara P. (you)",
        "time": "10:50 AM",
        "body": "9 AM is confirmed. We'll text again when the crew is 15 min out."
      }
    ],
    "customer": {
      "name": "Rosa Martinez",
      "status": "Booked",
      "avInitials": "RM",
      "avBg": "#B91C1C",
      "email": "rosa@example.com",
      "phone": "5551011010",
      "branch": "Toronto",
      "source": "Google"
    },
    "quote": {
      "line": "Job 17712-1 \u00b7 C$2,768.50 \u00b7 Friday 9 AM"
    }
  },
  {
    "thread": {
      "subject": "Office relocation quote",
      "meta": "Andre Patel <andre@patel-holdings.test> \u00b7 Assigned to Jordan M. \u00b7 Opened May 21, 10:30 AM"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Andre Patel",
        "time": "10:30 AM",
        "body": "Thanks for the quote \u2014 we'd like to schedule a walkthrough on Wednesday morning if possible."
      },
      {
        "dir": "out",
        "from": "Jordan M. (you)",
        "time": "10:00 AM",
        "body": "Wednesday at 9 AM works on our side. I'll send a calendar invite shortly."
      }
    ],
    "customer": {
      "name": "Andre Patel",
      "status": "Opportunity",
      "avInitials": "AP",
      "avBg": "#7C3AED",
      "email": "andre@patel-holdings.test",
      "phone": "4165552020",
      "branch": "Toronto",
      "source": "Referral"
    },
    "quote": {
      "line": "QT-2026-0593 \u00b7 C$6,200.00 \u00b7 Pending walkthrough"
    }
  },
  {
    "thread": {
      "subject": "Damage claim follow-up",
      "meta": "Henderson <henderson@example.test> \u00b7 Assigned to Alex K. \u00b7 Opened May 21, 9:18 AM"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Henderson",
        "time": "9:18 AM",
        "body": "Following up on the damaged box from last week \u2014 when can we get an update on the claim?"
      },
      {
        "dir": "out",
        "from": "Alex K. (you)",
        "time": "9:00 AM",
        "body": "Sorry for the wait. Adjuster scheduled for Thursday \u2014 I'll email a summary right after."
      }
    ],
    "customer": {
      "name": "Henderson",
      "status": "Damage claim \u00b7 open",
      "avInitials": "HD",
      "avBg": "#EA580C",
      "email": "henderson@example.test",
      "phone": "4035551515",
      "branch": "Calgary",
      "source": "Google"
    },
    "quote": {
      "line": "Claim CL-2026-0042 \u00b7 C$420 estimated"
    }
  },
  {
    "thread": {
      "subject": "Booking confirmation",
      "meta": "Mary Patel <mp@patel.test> \u00b7 Assigned to Sara P. \u00b7 Replied May 20"
    },
    "bubbles": [
      {
        "dir": "out",
        "from": "Sara P. (you)",
        "time": "Yesterday 4:18 PM",
        "body": "You're all booked for next Tuesday at 10 AM. We'll text the day before to confirm."
      },
      {
        "dir": "in",
        "from": "Mary Patel",
        "time": "Yesterday 4:30 PM",
        "body": "Confirmed for next Tuesday. Looking forward to it!"
      }
    ],
    "customer": {
      "name": "Mary Patel",
      "status": "Booked",
      "avInitials": "MP",
      "avBg": "#0EA5E9",
      "email": "mp@patel.test",
      "phone": "4165553030",
      "branch": "Toronto",
      "source": "Other"
    },
    "quote": {
      "line": "Job 17715-1 \u00b7 C$1,820.00 \u00b7 Booked"
    }
  },
  {
    "thread": {
      "subject": "Quote inquiry \u00b7 3BR move",
      "meta": "Brian Cole \u00b7 SMS \u00b7 Unassigned \u00b7 Opened May 20"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Brian Cole",
        "time": "Yesterday 3:15 PM",
        "body": "Hi \u2014 can you send a quote for a 3-bedroom move from Toronto to Hamilton on June 14?"
      }
    ],
    "customer": {
      "name": "Brian Cole",
      "status": "New lead",
      "avInitials": "BC",
      "avBg": "#D97706",
      "email": "briancole@example.test",
      "phone": "9055557777",
      "branch": "Toronto",
      "source": "Website"
    },
    "quote": {
      "line": "No quote yet \u2014 needs intake"
    }
  },
  {
    "thread": {
      "subject": "Voicemail \u00b7 2:14",
      "meta": "Northside Co. \u00b7 Call \u00b7 Assigned to John Sales \u00b7 Mon 11:42 AM"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Northside Co. (voicemail)",
        "time": "Mon 11:42 AM",
        "body": "Hi, calling about our storage unit \u2014 please give us a call back when you have a minute. Thanks."
      }
    ],
    "customer": {
      "name": "Northside Co.",
      "status": "Storage customer",
      "avInitials": "NC",
      "avBg": "#0F766E",
      "email": "admin@northside.test",
      "phone": "4165554040",
      "branch": "Toronto",
      "source": "Referral"
    },
    "quote": {
      "line": "Storage SC-2025-019 \u00b7 C$320/mo \u00b7 Active"
    }
  },
  {
    "thread": {
      "subject": "Re: Service agreement",
      "meta": "Cedar Realty <ops@cedar-realty.test> \u00b7 Assigned to Jordan M. \u00b7 Replied Mon"
    },
    "bubbles": [
      {
        "dir": "out",
        "from": "Jordan M. (you)",
        "time": "Mon 2:30 PM",
        "body": "Sending over the service agreement for next quarter \u2014 let me know if anything needs adjustment."
      },
      {
        "dir": "in",
        "from": "Cedar Realty",
        "time": "Mon 3:48 PM",
        "body": "Signed and returned the agreement. Let me know next steps."
      }
    ],
    "customer": {
      "name": "Cedar Realty",
      "status": "Recurring customer",
      "avInitials": "CR",
      "avBg": "#9333EA",
      "email": "ops@cedar-realty.test",
      "phone": "4165555050",
      "branch": "Toronto",
      "source": "Referral"
    },
    "quote": {
      "line": "Service SA-2026-Q3 \u00b7 C$1,200/mo \u00b7 Signed"
    }
  },
  {
    "thread": {
      "subject": "Crew assignment question",
      "meta": "Yorkdale Properties \u00b7 Email \u00b7 Assigned to Sara P. \u00b7 Sun"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Yorkdale Properties",
        "time": "Sun 6:14 PM",
        "body": "Will the same crew handle both the pickup and delivery? Some of our team prefer continuity."
      },
      {
        "dir": "out",
        "from": "Sara P. (you)",
        "time": "Sun 7:02 PM",
        "body": "Yes, same crew handles both legs. I'll attach the team bios in the next email."
      }
    ],
    "customer": {
      "name": "Yorkdale Properties",
      "status": "Opportunity",
      "avInitials": "YP",
      "avBg": "#16A34A",
      "email": "ops@yorkdale.test",
      "phone": "4165556060",
      "branch": "Toronto",
      "source": "Google"
    },
    "quote": {
      "line": "QT-2026-0581 \u00b7 C$7,200.00 \u00b7 Quoted"
    }
  },
  {
    "thread": {
      "subject": "Quote sent \u00b7 QT-2026-0612",
      "meta": "Pinewood Estates \u00b7 Email \u00b7 Assigned to John Sales \u00b7 Sun"
    },
    "bubbles": [
      {
        "dir": "out",
        "from": "John Sales (you)",
        "time": "Sun 1:14 PM",
        "body": "Sent the quote \u2014 let us know if you'd like to adjust the timeline."
      }
    ],
    "customer": {
      "name": "Pinewood Estates",
      "status": "Quoted",
      "avInitials": "PE",
      "avBg": "#DC2626",
      "email": "admin@pinewood.test",
      "phone": "4165557070",
      "branch": "Toronto",
      "source": "Referral"
    },
    "quote": {
      "line": "QT-2026-0612 \u00b7 C$3,600.00 \u00b7 Sent"
    }
  },
  {
    "thread": {
      "subject": "Move-in checklist",
      "meta": "Tao Anand <tao@anand.test> \u00b7 Email \u00b7 Assigned to Alex K. \u00b7 Last week"
    },
    "bubbles": [
      {
        "dir": "in",
        "from": "Tao Anand",
        "time": "Last Wed 10:42 AM",
        "body": "Here's the checklist for our move-in \u2014 let me know if anything's missing."
      },
      {
        "dir": "out",
        "from": "Alex K. (you)",
        "time": "Last Wed 11:08 AM",
        "body": "Looks good! I'll forward to the crew foreman so they're prepped."
      }
    ],
    "customer": {
      "name": "Tao Anand",
      "status": "Booked",
      "avInitials": "TA",
      "avBg": "#0891B2",
      "email": "tao@anand.test",
      "phone": "4165558080",
      "branch": "Toronto",
      "source": "Other"
    },
    "quote": {
      "line": "Job 17709-1 \u00b7 C$2,420.00 \u00b7 Booked"
    }
  }
],
  headings: {
  "1": "Messages",
  "2": "Re: Your moving quote"
},
  quote: {
  "line": "QT-2026-0588 \u00b7 C$1,840.00 \u00b7 Sent"
},
  customer: {
  "name": "Johanna Kuyvenhoven",
  "status": "Lead \u00b7 Tentative",
  "avInitials": "JK",
  "avBg": "#1E40AF",
  "email": "jkuyvenhoven94@gmail.com",
  "phone": "5879204170",
  "branch": "Vancouver Lead",
  "source": "Referral"
},
  bubbles: [
  {
    "dir": "in",
    "from": "Johanna Kuyvenhoven",
    "time": "2:14 PM",
    "body": "Hi! Just wanted to confirm the dates work for our team, and we're hoping to lock in the morning slot if possible. Also, what's the deposit amount? Thanks!"
  },
  {
    "dir": "out",
    "from": "John Sales (you)",
    "time": "1:48 PM",
    "body": "Hi Johanna! Yes, June 14 morning slot is open and reserved for you. The deposit is $100 to confirm \u2014 I'll send a payment link in a separate email."
  },
  {
    "dir": "in",
    "from": "Johanna Kuyvenhoven",
    "time": "1:02 PM",
    "body": "Perfect, looking forward to it."
  }
],
  thread: {
  "subject": "Re: Your moving quote",
  "meta": "Johanna Kuyvenhoven <jkuyvenhoven94@gmail.com> \u00b7 Assigned to John Sales \u00b7 Opened May 21, 1:02 PM"
},
  optionsOptions3: [{"value": "Opened", "label": "Opened"}, {"value": "Awaiting reply", "label": "Awaiting reply"}, {"value": "Closed", "label": "Closed"}],
  optionsOptions2: [{"value": "John Sales", "label": "John Sales"}, {"value": "Jane Finance", "label": "Jane Finance"}, {"value": "Admin", "label": "Admin"}],
  optionsOptions: [{"value": "Email", "label": "Email"}, {"value": "SMS", "label": "SMS"}, {"value": "Calls", "label": "Calls"}],
    summary: "4 unread · 27 threads", counts: { inbox: 27, unread: 4 },
    rows: [
  {
    "cls": "active unread",
    "avBg": "#1E40AF",
    "avInitials": "JK",
    "name": "Johanna Kuyvenhoven",
    "time": "2:14 PM",
    "subject": "Re: Your moving quote",
    "snippet": "Hi! Just wanted to confirm the dates work for our team, and we're\u2026",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "reply",
    "status": "Awaiting reply"
  },
  {
    "cls": "unread",
    "avBg": "#047857",
    "avInitials": "AM",
    "name": "Acme Realty",
    "time": "12:48 PM",
    "subject": "Storage contract renewal",
    "snippet": "Could we extend the storage contract by another quarter? Same\u2026",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "opened",
    "status": "Opened"
  },
  {
    "cls": "",
    "avBg": "#B91C1C",
    "avInitials": "RM",
    "name": "Rosa Martinez",
    "time": "11:02 AM",
    "subject": "Pickup time for Friday",
    "snippet": "Just checking \u2014 does 9 AM still work? Happy to push it back if\u2026",
    "channelClass": "sms",
    "channel": "SMS",
    "statusClass": "reply",
    "status": "Awaiting reply"
  },
  {
    "cls": "",
    "avBg": "#7C3AED",
    "avInitials": "AP",
    "name": "Andre Patel",
    "time": "10:30 AM",
    "subject": "Office relocation quote",
    "snippet": "Thanks for the quote \u2014 we'd like to schedule a walkthrough on\u2026",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "opened",
    "status": "Opened"
  },
  {
    "cls": "unread",
    "avBg": "#EA580C",
    "avInitials": "HD",
    "name": "Henderson",
    "time": "9:18 AM",
    "subject": "Damage claim follow-up",
    "snippet": "Following up on the damaged box from last week \u2014 when can we\u2026",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "reply",
    "status": "Awaiting reply"
  },
  {
    "cls": "",
    "avBg": "#0EA5E9",
    "avInitials": "MP",
    "name": "Mary Patel",
    "time": "Yesterday",
    "subject": "Booking confirmation",
    "snippet": "Confirmed for next Tuesday. Looking forward to it!",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "replied",
    "status": "Replied"
  },
  {
    "cls": "unread",
    "avBg": "#D97706",
    "avInitials": "BC",
    "name": "Brian Cole",
    "time": "Yesterday",
    "subject": "Quote inquiry \u00b7 3BR move",
    "snippet": "Hi \u2014 can you send a quote for a 3-bedroom move from Toronto to\u2026",
    "channelClass": "sms",
    "channel": "SMS",
    "statusClass": "reply",
    "status": "Awaiting reply"
  },
  {
    "cls": "",
    "avBg": "#0F766E",
    "avInitials": "NC",
    "name": "Northside Co.",
    "time": "Mon",
    "subject": "Voicemail \u00b7 2:14",
    "snippet": "Voicemail transcript: Hi, calling about our storage unit \u2014 please\u2026",
    "channelClass": "call",
    "channel": "Call",
    "statusClass": "voicemail",
    "status": "Voicemail"
  },
  {
    "cls": "",
    "avBg": "#9333EA",
    "avInitials": "CR",
    "name": "Cedar Realty",
    "time": "Mon",
    "subject": "Re: Service agreement",
    "snippet": "Signed and returned the agreement. Let me know next steps.",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "replied",
    "status": "Replied"
  },
  {
    "cls": "",
    "avBg": "#16A34A",
    "avInitials": "YP",
    "name": "Yorkdale Properties",
    "time": "Sun",
    "subject": "Crew assignment question",
    "snippet": "Will the same crew handle both the pickup and delivery? Some of\u2026",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "opened",
    "status": "Opened"
  },
  {
    "cls": "",
    "avBg": "#DC2626",
    "avInitials": "PE",
    "name": "Pinewood Estates",
    "time": "Sun",
    "subject": "Quote sent \u00b7 QT-2026-0612",
    "snippet": "Sent the quote \u2014 let us know if you'd like to adjust the timeline.",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "sent",
    "status": "Sent"
  },
  {
    "cls": "",
    "avBg": "#0891B2",
    "avInitials": "TA",
    "name": "Tao Anand",
    "time": "Last week",
    "subject": "Move-in checklist",
    "snippet": "Here's the checklist for our move-in \u2014 let me know if anything's\u2026",
    "channelClass": "email",
    "channel": "Email",
    "statusClass": "opened",
    "status": "Opened"
  }
],
    emptyMessage: "Inbox is empty.",
    contacts: [{value:"1",label:"Rosa Martinez"},{value:"2",label:"Acme Corp"}],
    channels: [{value:"email",label:"Email"},{value:"sms",label:"SMS"},{value:"chat",label:"Chat"}],
    folders: [{value:"inbox",label:"Inbox"},{value:"sent",label:"Sent"},{value:"archived",label:"Archived"}]
  };
  F["phoneSystem"] = {
  metrics: {
  "list_num": [
    "Keera Roberts",
    "Harman",
    "Vicky Milosevic-Hill",
    "Frances Knox",
    "Unknown \u00b7 +1 (416) 822-9931",
    "Danielle Melnyk",
    "Unknown \u00b7 +1 (647) 222-8801",
    "Frances Knox",
    "Keera Roberts",
    "Emily M",
    "Kim Th",
    "Keera Roberts",
    "Harman"
  ]
},
  recent: [
  {
    "name": "Johanna Kuyvenhoven",
    "phone": "(587) 920-4170",
    "time": "2:14 PM",
    "direction": "inbound"
  },
  {
    "name": "Rosa Martinez",
    "phone": "(555) 010-1010",
    "time": "1:48 PM",
    "direction": "outbound"
  },
  {
    "name": "Acme Realty",
    "phone": "(555) 010-2020",
    "time": "12:30 PM",
    "direction": "inbound"
  }
],
  headings: {
  "1": "Phone system",
  "2": "Recent calls",
  "3": "Voicemails",
  "4": "Contacts",
  "5": "Forwarding rules"
},
  whenOptions: [],
  optionsOptions2: [{"value": "Inbound", "label": "Inbound"}, {"value": "Outbound", "label": "Outbound"}, {"value": "Missed", "label": "Missed"}],
  optionsOptions: [{"value": "From: +1 (416) 555-0119 \u00b7 Customer SMS", "label": "From: +1 (416) 555-0119 \u00b7 Customer SMS"}, {"value": "+1 (905) 555-0188 \u00b7 Inbound calls", "label": "+1 (905) 555-0188 \u00b7 Inbound calls"}, {"value": "+1 (888) 555-7700 \u00b7 Sales line", "label": "+1 (888) 555-7700 \u00b7 Sales line"}],
    summary: "Main line · 3 calls today", counts: { calls: 3, voicemails: 1 },
    rows: [
      { id: 501, name: "(555) 010-9090 · Rosa Martinez · 2:14 · in" },
      { id: 502, name: "(555) 010-8181 · Acme Corp · 0:42 · out" }
    ],
    emptyMessage: "No calls yet today.",
    lines: [{value:"main",label:"Main · (555) 010-0100"},{value:"sales",label:"Sales · (555) 010-0101"}],
    contacts: [{value:"1",label:"Rosa Martinez"},{value:"2",label:"Acme Corp"}],
    forwardTargets: [{value:"mobile",label:"Mobile"},{value:"voicemail",label:"Voicemail"},{value:"queue",label:"Queue"}],
    voicemailGreetings: [{value:"default",label:"Default"},{value:"closed",label:"After hours"}]
  };
  F["incomingCall"] = {
  caller: {
  "name": "Johanna Kuyvenhoven",
  "phone": "(587) 920-4170",
  "location": "Vancouver"
},
  headings: {
  "1": "Incoming call"
},
    summary: "Incoming · (555) 010-9090 · Rosa Martinez", counts: {},
    rows: [
      { id: 1, name: "Caller: Rosa Martinez — known customer (#1)" },
      { id: 2, name: "Recent jobs: Job 17712-1 · Job 17680-2" }
    ],
    emptyMessage: "No active call.",
    routeOptions: [{value:"sales",label:"Sales"},{value:"support",label:"Support"},{value:"dispatch",label:"Dispatch"}],
    quickReplies: [{value:"hi",label:"Hi, this is Service1"},{value:"hold",label:"Please hold"}]
  };
  F["referrals"] = {
  kpis: [
  {
    "value": "1",
    "label": "Active Referrers"
  },
  {
    "value": "1",
    "label": "Total Leads"
  },
  {
    "value": "0",
    "label": "Booked"
  },
  {
    "value": "0",
    "label": "Completed"
  },
  {
    "value": "C$0.00",
    "label": "Est. Value"
  },
  {
    "value": "C$0.00",
    "label": "Commission Paid"
  }
],
  headings: {
  "1": "Referrals",
  "2": "Active referrers",
  "3": "Pending payouts",
  "4": "Archive",
  "5": "Recent activity"
},
  commissionTypeOptions: [{"value": "Fixed amount", "label": "Fixed amount"}, {"value": "Percentage", "label": "Percentage"}],
  archive: [
  {
    "c0_name": "Old Referrer",
    "c1_text": "Customer",
    "c2_text": "1 closed",
    "c3_text": "C$60"
  }
],
  payouts: [
  {
    "c0_text": "2026-05-15",
    "c1_text": "John Smith",
    "c2_text": "C$120",
    "c3_text": "E-transfer"
  },
  {
    "c0_text": "2026-05-10",
    "c1_text": "Mary Patel",
    "c2_text": "C$80",
    "c3_text": "Cheque"
  }
],
    summary: "14 referrers · $2,840 unpaid commission", counts: { referrers: 14, unpaid: 2840 },
    rows: [
  {
    "c0_name": "John Smith",
    "c1_text": "Customer",
    "c2_text": "8 closed",
    "c3_text": "C$920"
  },
  {
    "c0_name": "Mary Patel",
    "c1_text": "Partner",
    "c2_text": "3 closed",
    "c3_text": "C$260"
  },
  {
    "c0_name": "Acme Realty",
    "c1_text": "Affiliate",
    "c2_text": "14 closed",
    "c3_text": "C$1,660"
  }
],
    emptyMessage: "No referrers yet.",
    referrerTypes: [{value:"customer",label:"Customer"},{value:"partner",label:"Partner"}],
    commissionTypes: [{value:"none",label:"None"},{value:"fixed",label:"Fixed amount"},{value:"percent",label:"Percentage"}],
    commissionPlans: [{value:"1",label:"Standard 10%"},{value:"2",label:"VIP 15%"}],
    paymentMethods: [{value:"etransfer",label:"E-transfer"},{value:"cheque",label:"Cheque"}],
    payoutSchedules: [{value:"monthly",label:"Monthly"},{value:"quarterly",label:"Quarterly"}]
  };
})();
