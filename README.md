# service1_ui

The Service1 frontend, restructured as a standalone modular static site
that can be hosted on GitHub Pages, opened directly from disk (`file://`),
and developed independently of the ASP.NET backend.

> **Build note:** this is the *classic-script* build. There are no ES
> modules and no runtime `fetch()` of local JSON, so every page runs from
> the `file://` protocol (double-click `index.html`) with no server.

## Layout

```
service1_ui/
├── index.html             ← module gallery
├── lab.html               ← test harness ("wrapper") — paste JSON, run a module, watch I/O
├── 404.html
├── modules.index.js       ← list of all modules (window.S1.modulesIndex)
├── assets/
│   └── css/{_system,_aesthetic,lab}.css
├── core/
│   ├── event-bus.js            ← pub/sub            (window.S1.bus)
│   ├── _log.js                 ← console RPC logger (window.S1.log)
│   ├── state-store.js          ← in-memory state    (window.S1.store)
│   ├── schema.js               ← resource catalogue (window.S1.RESOURCES)
│   ├── fixtures.js             ← ALL example state   (window.S1.fixtures)
│   ├── communication.mock.js   ← in-memory JSON      (window.S1.MockComm)
│   ├── communication.api.js    ← real fetch /api/*   (window.S1.ApiComm)
│   └── communication.js        ← picks mock vs api   (window.S1.comm)
└── modules/<name>/
    ├── index.html              ← Paul's redesign page, loads the script chain
    ├── module.js               ← grabs window.S1.comm, hooks per-page events
    ├── module.css
    └── manifest.json           ← { reads, writes, fixture, title } (also inlined in module.js)
```

## How it works

There are no ES modules. Each page loads the core as ordinary
`<script>` tags **in dependency order**, then its own `module.js`:

```html
<!-- modules/<name>/index.html -->
<script src="../../core/event-bus.js"></script>
<script src="../../core/_log.js"></script>
<script src="../../core/state-store.js"></script>
<script src="../../core/schema.js"></script>
<script src="../../core/fixtures.js"></script>
<script src="../../core/communication.mock.js"></script>
<script src="../../core/communication.api.js"></script>
<script src="../../core/communication.js"></script>
<script src="./module.js"></script>
```

```js
// modules/<name>/module.js
const comm = window.S1.comm;          // no import — set up by communication.js
const jobs = await comm.get('jobs');
```

`communication.js` chooses its backend at runtime:

| selector                                  | backend            |
|-------------------------------------------|--------------------|
| `window.SERVICE1_UI_MODE = 'api'`         | `ApiComm` — `fetch /api/*` against the ASP.NET host |
| `?mode=mock` or default                   | `MockComm` — in-memory JSON, persisted to localStorage |

The public API is identical in both:

```
comm.get(resource, params?)
comm.save(resource, payload)
comm.delete(resource, id)
comm.subscribe(resource, cb)   // returns unsub()
comm.action(name, payload)
comm.upload(file, meta)
comm.currentUser()
```

Mock state comes from `core/fixtures.js` (`window.S1.fixtures[name]`), not
from `fetch()`, which is what makes `file://` work. A page hydrates its
fixture from `?fixture=<name>`.

## Running it

**No server needed.** Just open the files:

```
service1_ui/index.html          ← double-click, or File ▸ Open in a browser
service1_ui/lab.html
service1_ui/modules/dashboard/index.html?mode=mock&fixture=dashboard
```

A static server still works too and behaves identically:

```bash
cd service1_ui
python3 -m http.server 8000      # or: npx serve .
# open http://localhost:8000/lab.html
```

### `file://` caveat — the Lab's live mirroring

Standalone module pages and the gallery work from `file://` in every
browser. The **Lab's cross-iframe features** (the live I/O log and *Apply
state into the running iframe*) need the parent page to read the iframe's
`window` — and **Chrome blocks cross-frame access between two `file://`
documents** (they get opaque origins). So in Chrome over `file://` the Lab
renders modules but its I/O / Operations panes stay empty.

Use any of these for the full Lab experience:
* open it over a static server (recommended), **or**
* use **Firefox** (treats same-folder `file://` pages as same-origin), **or**
* launch Chrome with `--allow-file-access-from-files`.

## Adding a new module

1. Drop the HTML at `modules/<name>/index.html`.
2. Add the core `<script>` chain above + `<script src="./module.js"></script>`.
3. Add `module.js` starting with `const comm = window.S1.comm;`.
4. Add a fixture entry to `core/fixtures.js` (`window.S1.fixtures["<name>"] = {...}`).
5. Append an entry to `modules.index.js` (`window.S1.modulesIndex`).
6. (Optional) keep `manifest.json` as docs; the live copy is inlined in `module.js`.

## Production embedding

When the ASP.NET host serves these assets, inject one line **before the
`communication.js` script tag**:

```html
<script>window.SERVICE1_UI_MODE = 'api';</script>
```

Every page will then talk to `/api/*` against the real backend, with the
cookie auth and CSRF token from the host page. (`api` mode requires
http(s); it does not run from `file://`.)

## GitHub Pages

`.nojekyll` keeps the `_system.css` / `_aesthetic.css` files (underscore
prefix) from being filtered out. `.github/workflows/pages.yml` deploys the
directory on every push to `main`.

## Console logging

Every RPC and the initial JSON state load is logged to the browser
JavaScript console — open DevTools to see traffic in real time. Tag
scheme:

| Tag                | Meaning                                      |
| ------------------ | -------------------------------------------- |
| `[s1ui]`           | Boot info / handshake                        |
| `[s1ui →]`         | Outbound RPC request                         |
| `[s1ui ←]`         | Inbound reply (success)                      |
| `[s1ui ✗]`         | Inbound reply (error)                        |
| `[s1ui ⇐ state]`   | Initial JSON state load from the host        |
| `[s1ui ⇐ evt]`     | Server-pushed event                          |
| `[s1ui ⌛]`         | RPC timeout (30 s)                           |

Every JSON payload, result, state object, and event is emitted on its
own `console.log(obj)` call so DevTools "Copy Object" / "Store as global
variable" works cleanly on the object node.

**Kill-switch.** Default is ON. To silence in noisy environments:

```js
localStorage.s1ui_log = '0'  // persists across reloads
// or, before the comm stack loads:
window.SERVICE1_UI_LOG = false
```

Note: log output mirrors the real RPC stream, including `auth/me`
responses. Treat the console contents as PII when sharing screenshots.
