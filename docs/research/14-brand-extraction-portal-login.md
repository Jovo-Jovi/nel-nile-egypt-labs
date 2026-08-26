> Extraction evidence only (PR-09). Never current truth, never a parity target. Portal reads performed under OD-06. Server and framework version banners redacted under PR-27.

# P02-X01 — Site 1 supplement (`/Login/`)

Authorized this turn: `https://www.nileegyptlabresults.com/Login/` (the 302 target recorded previously). JS bundles were referenced in the HTML and were **not** fetched (not stylesheet / font / favicon / image). No form was submitted. Static HTML contains no patient record.

**Fetch record**

```
GET https://www.nileegyptlabresults.com/Login/
HTTP/1.1 200 OK
Content-Type: text/html
Last-Modified: Sun, 07 Nov 2021 15:09:37 GMT
Server: [redacted under PR-27]
X-Powered-By: [redacted under PR-27]
Content-Length: 888
```

Entire HTML:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Results WebSite</title>
  <base href="/Login/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="stylesheet" href="styles.d31dbe1b6a389366aa0f.css"></head>
<body>
  <app-root></app-root>
<script src="runtime-es2015.451c606131b099dab556.js" type="module"></script>
…
<script src="main-es2015.a1dd3b88a6835a8126af.js" type="module"></script>
…
</body>
</html>
```

Permitted expansion from that HTML/CSS:

| URL | Last-Modified | bytes |
|---|---|---|
| `https://www.nileegyptlabresults.com/Login/styles.d31dbe1b6a389366aa0f.css` | Sun, 07 Nov 2021 15:09:36 GMT | 796389 |
| `https://www.nileegyptlabresults.com/Login/favicon.ico` | Thu, 04 Nov 2021 11:38:54 GMT | 948 |
| `https://www.nileegyptlabresults.com/Login/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=[redacted under PR-27]` (HEAD) | Sun, 07 Nov 2021 15:09:36 GMT | 77160 |

The painted login form is **UNDETERMINED**: it is built by Angular inside `<app-root></app-root>`. Colours below are from the bundled global CSS only. Which of Bootstrap `.btn-primary` vs Kendo `.k-button.k-primary` the unseen template uses was not observed.

---

### A. Colour

Source: `https://www.nileegyptlabresults.com/Login/styles.d31dbe1b6a389366aa0f.css`. No inline styles, no `<style>` block. File begins `.k-common-test-class,.k-theme-test-class{opacity:0}.k-widget{…}` (Kendo UI theme CSS). Also contains Bootstrap 4 reboot/utilities.

**Page background**

```
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:1rem;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}
```

**Header / nav background**

- No lab header rule. Bootstrap: `.navbar{position:relative;padding:.5rem 1rem}`
- `.navbar-light .navbar-brand,.navbar-light .navbar-brand:focus,.navbar-light .navbar-brand:hover{color:rgba(0,0,0,.9)}`
- `.navbar-dark .navbar-brand,.navbar-dark .navbar-brand:focus,.navbar-dark .navbar-brand:hover{color:#fff}`
- Kendo: `.k-header{…;color:#656565;background-color:#f6f6f6;…}`
- Whether a nav is rendered on the login view: UNDETERMINED (JS not fetched).

**Footer background**

- `.k-footer{text-align:center;clear:both}` and `.k-footer{padding:8px 12px;border-width:1px 0 0;border-style:solid;…}` — no colour on those two rules.
- No lab `footer` background declaration found. UNDETERMINED for a painted footer.

**Primary button**

Two vendor primaries in the same file:

- Bootstrap 4: `.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}`
  hover: `.btn-primary:focus,.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}`
- Kendo Default: `.k-button.k-primary,.k-button.k-state-selected{border-color:#ff6358;color:#fff;background-color:#ff6358}`
  hover: `.k-button.k-primary.k-state-hover,.k-button.k-primary:hover{border-color:#ff6b58;color:#fff;background-color:#ff6b58;background-image:linear-gradient(rgba(255,146,88,0),rgba(255,146,88,.2))}`
  also `.k-primary{border-color:#ff6358;background-color:#ff6358}` and `.k-primary{color:#ff6358}`
  `.k-avatar-icon,.k-avatar-initials{color:#fff;background-color:#ff6358}`

**Secondary button**

- `.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}`
- hover: `.btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}`
  (Bootstrap 4, same file)

**Link (default and hover)**

- `a{color:#007bff;text-decoration:none;background-color:transparent}`
- `a:hover{color:#0056b3;text-decoration:underline}`
- Kendo: `.k-link,.k-link:hover{color:inherit;text-decoration:none;outline:0;cursor:pointer}`

**Body text**

- `body{…;color:#212529;…}` (above)
- `html{font-family:sans-serif;line-height:1.15;…}`

**Heading text**

- Bootstrap 4: `h1{font-size:2.5rem}` `h2{font-size:2rem}` `h3{font-size:1.75rem}` `h4{font-size:1.5rem}` `h5{font-size:1.25rem}` `h6{font-size:1rem}` plus `h6{margin-bottom:.5rem;font-weight:500;line-height:1.2}`
- No custom heading `color` for a lab name was found. Document title in HTML is `Results WebSite`.

**Border / divider**

- Kendo widget: `.k-widget{border-width:1px;border-style:solid;…;font-size:14px;line-height:1.4285714286;…}`
- Overlay: `.k-overlay{…;background-color:#000;opacity:.5;…}`

**Accent**

- Kendo Default coral `#ff6358` / hover `#ff6b58` / error-adjacent `#f31700` (`.k-rtl .k-dirty,[dir=rtl] .k-dirty{border-color:transparent transparent #f31700 #f31700;…}`)
- Bootstrap info/primary blue `#007bff` / hover `#0056b3` / `#0069d9`

**Distinct hex in this stylesheet (219):**
`#000`, `#002752`, `#002e79`, `#004085`, `#0056b3`, `#0058e9`, `#005cbf`, `#0062cc`, `#0069d9`, `#007bff`, `#00b0ff`, `#00f`, `#02587f`, `#030303`, `#03a9f4`, `#040505`, `#062c33`, `#09f`, `#0b2e13`, `#0c5460`, `#0f0`, `#0f6674`, `#0ff`, `#10707f`, `#117a8b`, `#121416`, `#138496`, `#155724`, `#16181b`, `#171a1d`, `#17a2b8`, `#19692c`, `#1b1e21`, `#1c7430`, `#1d2124`, `#1d5e00`, `#1e7e34`, `#202326`, `#20c997`, `#212121`, `#212529`, `#218838`, `#23272b`, `#252525`, `#28a745`, `#28b4c8`, `#2d73f5`, `#2f96b4`, `#333`, `#343a40`, `#34ce57`, `#37b400`, `#383d41`, `#38b714`, `#404040`, `#444`, `#444343`, `#454d55`, `#491217`, `#494f54`, `#495057`, `#4e555b`, `#50607f`, `#507f50`, `#51a351`, `#533f03`, `#545b62`, `#5a6268`, `#656565`, `#6610f2`, `#686868`, `#6c757d`, `#6d6d6d`, `#6f42c1`, `#721c24`, `#78d237`, `#7a7a7a`, `#7abaff`, `#7e0c00`, `#7f5050`, `#80bdff`, `#818182`, `#848484`, `#85332e`, `#856400`, `#856404`, `#858585`, `#86cfda`, `#8a8a8a`, `#8fd19e`, `#95999c`, `#969696`, `#999`, `#9b9b9b`, `#9c9c9c`, `#9fcdff`, `#a3a3a3`, `#a71d2a`, `#a9169c`, `#aa46be`, `#abdde5`, `#adb5bd`, `#b1dfbb`, `#b21f2d`, `#b3b7bb`, `#b3d7ff`, `#b8d0f9`, `#b8daff`, `#b8e7fc`, `#b9b9b9`, `#b9bbbe`, `#ba8b00`, `#bababa`, `#bd2130`, `#bd362f`, `#bee5eb`, `#c3e6cb`, `#c69500`, `#c6c8ca`, `#c7eab8`, `#c82333`, `#c8cbcf`, `#cacaca`, `#caf200`, `#cbd3da`, `#ccc`, `#ccdefb`, `#cce5ff`, `#cdeefd`, `#ced4da`, `#d0d9df`, `#d0dfd0`, `#d1ecf1`, `#d39e00`, `#d3d9df`, `#d4edda`, `#d6534a`, `#d6d6d6`, `#d6d8d9`, `#d6d8db`, `#d7f0cc`, `#d8d8d8`, `#d9d9d9`, `#dadada`, `#dae0e5`, `#dc3545`, `#dedede`, `#dee2e6`, `#dfd0d0`, `#e0a800`, `#e0e0e0`, `#e2e2e2`, `#e2e3e5`, `#e2e6ea`, `#e4606d`, `#e4e4e4`, `#e6e5e5`, `#e83e8c`, `#e8c3c0`, `#e8e8e8`, `#e9ecef`, `#eb5b51`, `#ebebeb`, `#ececec`, `#ececf6`, `#ed969e`, `#ededed`, `#eec9c6`, `#eee`, `#f0f`, `#f0f0f0`, `#f0f9ff`, `#f0fff0`, `#f1b0b7`, `#f1f1f1`, `#f2f2f2`, `#f31700`, `#f3f3f3`, `#f5c6cb`, `#f5cfcc`, `#f5f5f5`, `#f6f6f6`, `#f7f7f7`, `#f82`, `#f89406`, `#f8d7da`, `#f8f9fa`, `#f9f9f9`, `#fafafa`, `#fbfbfb`, `#fbfcfc`, `#fcbeb8`, `#fcf8e3`, `#fcfcfc`, `#fd7e14`, `#fdd1cc`, `#fdfdfd`, `#fdfdfe`, `#fefefe`, `#ff0`, `#ff6358`, `#ff6b58`, `#ff8279`, `#ff928a`, `#ff9388`, `#ffa19b`, `#ffc000`, `#ffc107`, `#ffd246`, `#ffd3d0`, `#ffdf7e`, `#ffe0de`, `#ffe8a1`, `#ffedb8`, `#ffeeba`, `#fff`, `#fff0f0`, `#fff2cc`, `#fff3cd`

No `#ffd133` (site 2 Medinova yellow). No `#3333FF` (site 2 slider override).

---

### B. Logo and marks

**Favicon** — HTML: `<link rel="icon" type="image/x-icon" href="favicon.ico">` with `<base href="/Login/">`

- Exact URL: `https://www.nileegyptlabresults.com/Login/favicon.ico`
- Served `Content-Type: image/x-icon`; file signature PNG `89 50 4E 47`
- Measured: **28 × 30** px, `PixelFormat=Format32bppArgb`
- `Content-Length: 948` bytes
- Background: **transparent** (corners `A=0`)
- `Last-Modified: Thu, 04 Nov 2021 11:38:54 GMT`
- Visible mark: white capital **A** in a dark shield (Angular framework logo)
- Reads: **generic/placeholder** (Angular logo). Does **not** read “Nile Egypt Labs”.

No other raster logo URL in the HTML. CSS `logo` / `login` hits are Kendo icon glyphs (`.k-i-login:before{content:"\e130"}`), not a lab mark. CSS contains inlined `data:image/png|gif|svg+xml` (Kendo/theme chrome); none is an HTTP lab logo URL.

---

### C. Typography

**`font-family` as written in the stylesheet**

- `html{font-family:sans-serif;…}`
- `body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;…}`
- `.k-widget{…;font-family:inherit;font-size:14px;line-height:1.4285714286;…}`
- `font-family:Arial,Verdana,sans-serif` (Kendo)
- `font-family:FontAwesome`
- `font-family:WebComponentsIcons` and `WebComponentsIcons,monospace` (Kendo icon font, `src` is `data:font/ttf;base64,…`)
- monospace stacks: `SFMono-Regular,Menlo,Monaco,Consolas,…`

**Webfonts**

- Font Awesome **4.7.0**, self-hosted under `/Login/`, **https**:
  `url(fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=[redacted under PR-27])` etc.
  HEAD `https://www.nileegyptlabresults.com/Login/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=[redacted under PR-27]` → `Content-Type: application/font-woff2`, `Last-Modified: Sun, 07 Nov 2021 15:09:36 GMT`, `Content-Length: 77160`
- Kendo `WebComponentsIcons` is an inlined TTF data URI (https page, data URL)
- **No Google Fonts.** No Arabic webfont. `Roboto` appears only as a **system** name in the Bootstrap stack, not as a loaded file.

**Sizes**

- Base: `body{font-size:1rem;line-height:1.5;…}` ; `html{line-height:1.15;…}`
- Headings: see A (`2.5rem` … `1rem`)
- `letter-spacing:normal` only (two tooltip-like rules). No tracking scale declared for brand type.

---

### D. Template fingerprint

**Verdict: TEMPLATE / vendor stack — Angular SPA + Kendo UI Default theme + Bootstrap 4 + Font Awesome 4.7.0.** Not Medinova. Not a lab-named theme.

Deciding source lines:

1. HTML: `<app-root></app-root>` plus `runtime-es2015.*.js` / `main-es2015.*.js` / `<base href="/Login/">` — Angular CLI build.
2. HTML `<title>Results WebSite</title>` — generic, not the lab name.
3. CSS first tokens: `.k-common-test-class,.k-theme-test-class{opacity:0}.k-widget{…}` and `.k-button.k-primary{border-color:#ff6358;background-color:#ff6358}` — **Kendo UI Default** (stock primary `#ff6358`).
4. CSS: `.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}` plus body font stack with `Noto Sans` — **Bootstrap 4**.
5. Font URLs `?v=[redacted under PR-27]` — Font Awesome **4.7.0**.
6. Favicon is the **Angular** shield-A (see B).
7. No `<meta name="generator">`. No WpFreeware / Medinova / `wpfreeware.com` string in HTML or this CSS (`medinova=0`, `nile=0`, `egypt=0`).
8. No lorem in the 888-byte HTML. Component copy is UNDETERMINED without JS.

---

### E. Arabic and direction

- `<html lang="en">`. No `lang="ar"` in this document.
- No `dir="rtl"` on `html`. Kendo ships `.k-rtl{direction:rtl}` and many `.k-rtl …, [dir=rtl] …` rules (framework RTL support, not evidence an Arabic UI is wired up).
- No language switcher in the static HTML (`<app-root>` empty). Whether Angular renders one: UNDETERMINED (JS not fetched).
- No Arabic-capable typeface loaded (see C).

---

### F. Facebook

Not applicable.

---

## Cross-check (updated)

**Palette.** Site 1 (this page’s CSS) is Kendo Default coral `#ff6358` plus Bootstrap 4 blue `#007bff` / body `#212529` on `#fff`. Site 2 is Medinova yellow `#ffd133` plus slider `#3333FF`. They do **not** share a palette.

**Logo.** Site 1 favicon is the Angular “A”. Site 2 live header is HTML “Nile Egypt Lab” + Font Awesome heartbeat; unused `logo.png` is “WPF MEDINOVA”; site 2 favicon is the bilingual flask. Facebook cover uses that flask lockup. Site 1’s favicon does **not** match site 2 or Facebook.

**Template fingerprint.** They do **not** share one. Site 2 = WpF Medinova (2018). Site 1 Login = Angular (2021) + Kendo Default + Bootstrap 4. Site 1 is also a **named vendor stack with stock colours**, not a lab identity.

**WHERE, IF ANYWHERE, DOES A GENUINE NILE EGYPT LABS BRAND ASSET EXIST?** Still the 2018 favicon `http://nileegyptlabs.com/images/favicon.ico` (flask, “Nile EGYPT LAB” / “معامل النيل مصر”) and the same lockup on the Facebook cover JPEG `485029501_967247055584864`. It does not exist on the results-portal Login page that was fetched: that page’s only mark is the Angular favicon, and its colours are Kendo/Bootstrap defaults.
