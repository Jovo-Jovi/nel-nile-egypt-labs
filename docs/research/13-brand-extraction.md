> Extraction evidence only (PR-09). Never current truth, never a parity target. Portal reads performed under OD-06. Server and framework version banners redacted under PR-27.

# P02-X01 — brand extraction evidence

Fetch fence: only the three listed URLs, plus stylesheets / fonts / favicon / images whose URLs already appeared in fetched HTML or CSS. No navigation links followed. No forms submitted. No login. No query-parameter invention. No archive/mirror. No repository write.

Personal-data fence: phone numbers, hotlines, street addresses, emails, staff names, and hours that appeared in page copy are omitted from this report except where a vendor address is the template-fingerprint source line required by D.

---

## Site 1 — `https://www.nileegyptlabresults.com`

**Fetch record.** `GET` of the listed URL, `--max-redirs 0`, returned:

```
HTTP/1.1 302 Found
Location: https://www.nileegyptlabresults.com/Login
Server: [redacted under PR-27]
X-AspNet-Version: [redacted under PR-27]
X-Powered-By: [redacted under PR-27]
Content-Length: 158
```

Response body (entire document):

```html
<html><head><title>Object moved</title></head><body>
<h2>Object moved to <a href="https://www.nileegyptlabresults.com/Login">here</a>.</h2>
</body></html>
```

`/Login` is not on the URL allow-list. Fetch of this branch **stopped**. No stylesheet, font, favicon, or image URL appears in that 158-byte body, so there was no permitted expansion.

No patient record was displayed on the listed URL. The listed URL did not itself render a credential form; it redirected to a Login path. That path was not fetched.

### A. Colour

UNDETERMINED. Blocked by the 302 stop. The 158-byte body contains no `<style>`, no inline `style=`, and no linked stylesheet. No colour value was read from this site’s CSS.

### B. Logo and marks

UNDETERMINED. No `<link rel="shortcut icon">`, no `<img>`, no SVG mark in the 302 body.

### C. Typography

UNDETERMINED. No `font-family` / `font-size` / `line-height` / `letter-spacing` declaration in the 302 body. No webfont URL.

### D. Template fingerprint

**UNDETERMINED** as a named HTML theme. Deciding source line is the 302 response, not a generator/theme comment:

`Location: https://www.nileegyptlabresults.com/Login` plus headers `Server: [redacted under PR-27]` / `X-AspNet-Version: [redacted under PR-27]` / `X-Powered-By: [redacted under PR-27]`.

That is an ASP.NET/IIS server signature on the listed URL. The Login document was not fetched, so Bootstrap/jQuery/admin-theme names, `<meta name="generator">`, and lorem on the portal UI are UNDETERMINED.

### E. Arabic and direction

UNDETERMINED for the portal UI (Login page not fetched). The 302 body has no `lang`, no `dir`, no language switcher, and no Arabic text.

### F. Facebook

Not applicable (site 1).

---

## Site 2 — `http://nileegyptlabs.com`

**Fetch record.** `GET` of the listed URL returned `HTTP/1.1 200 OK` with no redirect.

```
Content-Type: text/html
Last-Modified: Wed, 21 Feb 2018 20:37:16 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET
X-Powered-By-Plesk: PleskWin
Content-Length: 49707
```

HTML: `<html lang="en">`. No `<style>` block. No inline colour styles. Linked CSS and fonts (all fetched because they appear in this HTML):

| href in HTML | resolved URL | Last-Modified | bytes |
|---|---|---|---|
| `css/bootstrap.min.css` | `http://nileegyptlabs.com/css/bootstrap.min.css` | Mon, 04 Dec 2017 16:27:06 GMT | 117688 |
| `css/font-awesome.min.css` | `http://nileegyptlabs.com/css/font-awesome.min.css` | Fri, 17 Apr 2015 20:56:24 GMT | 23739 |
| `css/themes/default-theme.css` | `http://nileegyptlabs.com/css/themes/default-theme.css` | Mon, 23 Oct 2017 12:24:03 GMT | 6591 |
| `css/slick.css` | `http://nileegyptlabs.com/css/slick.css` | Wed, 06 May 2015 19:12:50 GMT | 4041 |
| `css/photoswipe.css` | `http://nileegyptlabs.com/css/photoswipe.css` | Wed, 06 May 2015 23:55:22 GMT | 4165 |
| `css/default-skin.css` | `http://nileegyptlabs.com/css/default-skin.css` | Wed, 13 May 2015 21:11:30 GMT | 11645 |
| `style.css` | `http://nileegyptlabs.com/style.css` | Mon, 04 Dec 2017 16:30:43 GMT | 65137 |
| Google Fonts (http) | `http://fonts.googleapis.com/css?family=Raleway` | none sent | CSS |
| | `http://fonts.googleapis.com/css?family=Habibi` | none sent | CSS |
| | `http://fonts.googleapis.com/css?family=Cinzel+Decorative:900` | none sent | CSS |

Cascade order in the HTML: Bootstrap → Font Awesome → `default-theme.css` → slick → photoswipe → default-skin → `style.css` last.

### A. Colour

Values below are copied from declarations as written. Role grouping uses the winning rule for that role on this homepage after cascade.

**Page background**

- Winning: Bootstrap v3.3.4 `css/bootstrap.min.css`: `body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.42857143;color:#333;background-color:#fff}`
- `style.css` `body { font-family: 'Habibi', serif; overflow-x: hidden !important; }` does not set a background, so `#fff` stands.
- `#whychooseSection{ background-color: #f7f7f7; }` (`style.css`) — section band, not the page canvas.
- `#counterSection { background-color: #222; }` (`style.css`) — that section is HTML-commented on this page.

**Header / nav background**

- Theme override `css/themes/default-theme.css`: `.navbar-default { background-color: #ffd133; border-color: #ffd133; }`
- Overridden Bootstrap default in `css/bootstrap.min.css`: `.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}` (loaded earlier; does not win).
- Nav link colour `style.css`: `.navbar-default .navbar-nav > li > a { color: #fff; … letter-spacing: 1px; }`
- Hover/active stay white: `.navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-nav > li > a:focus { color: #fff; }` and `.navbar-default .navbar-nav > .active > a, … { color: #fff; }`
- Active/open item **background** from theme: `.navbar-default .navbar-nav > .active > a, … .dropdown-menu > li > a:hover, … { background-color: #ffd133; }` (`default-theme.css`)
- Dropdown: `.navbar-nav .open .dropdown-menu { background-color: #ffffff; }` (`style.css`); `.dropdown-menu > li > a { color: #c3c3c3; }` ; hover `color: #fff;`
- Mobile toggle `style.css`: `.navbar-default .navbar-toggle {border-color: #fff;}` `.navbar-default .navbar-toggle .icon-bar {background-color: #fff;}`

**Footer background**

- `.footer-top { background-color: #f8f8f8; border-top: 2px solid #e9e9e9; }` (`style.css`)
- `.footer-middle { background-color: #f3f3f3; }` (`style.css`). Same class is also in the `default-theme.css` grouped rule `background-color: #ffd133`. Specificity is equal; `style.css` loads later, so **`#f3f3f3` wins**.
- `.footer-bottom { background-color: #fff; }` (`style.css`)
- Footer text: `.single-footer-widget{ color: #555; }` (`style.css`)
- Footer social: `.footer-social a { border: 1px solid #ffd133; color: #ffd133; }` (`default-theme.css`)

**Primary button**

- Homepage markup does not use `.btn-primary`. Bootstrap still declares (framework default, `css/bootstrap.min.css`): `.btn-primary{color:#fff;background-color:#337ab7;border-color:#2e6da4}` and hover/focus `.btn-primary.active,.btn-primary.focus,.btn-primary:active,.btn-primary:focus,.btn-primary:hover,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#286090;border-color:#204d74}`
- Theme CTA used by the template: `default-theme.css` `.readmore_area a span` is in the `#ffd133` **background-color** group; `.form-submit input { background-color: #ffd133; border: 1px solid #ffd133; }` ; `.button--itzel .button__icon` is in the `#ffd133` **color** group.
- `style.css` `.readmore_area a { color: #fff; }` and `.readmore_area a::before { background: #fff; }`
- Visible yellow blocks that behave as the homepage “primary surfaces”: `default-theme.css` grouped rule includes `.single-top-feature { background-color: #ffd133; }`
- Middle column exception `style.css`: `.opening-hours { background-color: #fff; }` with `.opening-hours>span`, `h3`, `p` `{ color: #000; }`

**Secondary button**

- Bootstrap default (framework, unused on this homepage markup): `.btn-default{color:#333;background-color:#fff;border-color:#ccc}` and `.btn-default.active,.btn-default.focus,.btn-default:active,.btn-default:focus,.btn-default:hover,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}` (`css/bootstrap.min.css`)
- Template hover-fill for read-more: `style.css` `.readmore_area a::before { background: #fff; }`

**Link (default and hover)**

- Custom `style.css` (wins over Bootstrap for bare `a`): `a{ text-decoration: none; color: #2f2f2f; }`
- Hover/focus in `style.css` sets **no colour**: `a:hover, a:focus{ outline: none; text-decoration: none; }`
- Bootstrap default, overridden for `a` colour: `a{color:#337ab7;text-decoration:none}` ; `a:hover{color:#23527c;text-decoration:underline}` (`css/bootstrap.min.css`)
- Nav links: default and hover both `#fff` (see header).
- Service title links: `.single-service>h3 a{ color: #3e3e3e; }` (`style.css`); hover colour comes from theme: `.single-service>h3 a:hover,.single-service>h3 a:focus { color: #ffd133; }` (`default-theme.css`)

**Body text**

- Bootstrap `body` `color:#333` (`css/bootstrap.min.css`) — `style.css` does not set `body` color.
- `.single-service > p { color: #8997a7; }` (`style.css`)
- `.whyChoose-right .media-body > p { color: #6d6d6d; }` (`style.css`)
- `.single-top-feature > p { color: #fff; }` (`style.css`)
- Footer widget `color: #555` (above)

**Heading text**

- `style.css` `h2 { color: #313338; font-size: 30px; … line-height: 40px; }`
- Slider: `.slider-text h2 { color: #f5f5f5; font-size: 55px; line-height: 55px; }` (`style.css`)
- Theme override `default-theme.css`: `.slider-text h2>strong{ color: #3333FF; }`
- `.slider-text p { color: #fff; }` (`style.css`)
- `.navbar-brand { color: #fff !important; …}` (`style.css`)
- `.single-top-feature>h3{ color: #fff; }` (`style.css`)
- Bootstrap heading sizes (framework, `css/bootstrap.min.css`): `.h1,h1{font-size:36px}` `.h2,h2{font-size:30px}` `.h3,h3{font-size:24px}` `.h4,h4{font-size:18px}` `.h5,h5{font-size:14px}` `.h6,h6{font-size:12px}` — `h2` colour/size then overridden by `style.css` as above.

**Border / divider**

- `default-theme.css` `.line { border-bottom: 2px solid #ffd133; … }` and `.line::after { border-top-color: #ffd133; … }`
- `.opening-table li{ border-bottom: 1px solid #f1f1f2; … color: #000; }` (`style.css`)
- `.footer-top { border-top: 2px solid #e9e9e9; }` (`style.css`)
- Slider arrows: `.top-slider .slick-prev, .top-slider .slick-next { background-color: transparent; border: 2px solid #ccc; color: #ccc; }` (`style.css`); hover from theme: `.top-slider .slick-prev:hover, .top-slider .slick-next:hover{ border-color: #ffd133; color: #ffd133; }` (`default-theme.css`)

**Accent / highlight**

- Theme yellow, almost every interactive accent in `css/themes/default-theme.css`: `#ffd133` as `background-color`, `color`, `border`, `box-shadow` (file header: “Template Design By WpFreeware Team”).
- Slider strong: `#3333FF` (only non-yellow custom token in `default-theme.css`): `.slider-text h2>strong{ color: #3333FF; }`
- `.service-icon .service-icon-effect { box-shadow: 0 0 0 4px #ffd133; }` (`default-theme.css`)
- Commented, **not applied**, in `style.css`: `/*background: #3498db;*/`
- Template social hover swatches in `style.css` (not lab-specific): `.social-share ul li:nth-child(1) a:hover{ background-color: #354c8c; }` `(2) #33CCFF` `(3) #C92619` `(4) #DD4B39` and from the same block `(5) #0077B5`
- Named `red` in `style.css` for required-field markers: `color: red;` (two rules)
- Blog figure (section commented in HTML): `.blog-img figure { background: none repeat scroll 0 0 #3085a3; }` (`style.css`)

**Framework / plugin colour inventories** (distinct values present in linked CSS; not all used by visible homepage nodes)

- Bootstrap v3.3.4 `css/bootstrap.min.css` distinct hex: `#000`, `#00000000`, `#080808`, `#101010`, `#204d74`, `#222`, `#23527c`, `#245269`, `#262626`, `#269abc`, `#286090`, `#2b542c`, `#2e6da4`, `#31708f`, `#31b0d5`, `#333`, `#337ab7`, `#398439`, `#3c763d`, `#444`, `#449d44`, `#46b8da`, `#4cae4c`, `#555`, `#5bc0de`, `#5cb85c`, `#5e5e5e`, `#66512c`, `#66afe9`, `#67b168`, `#737373`, `#777`, `#80000000`, `#843534`, `#888`, `#8a6d3b`, `#999`, `#9d9d9d`, `#a6e1ec`, `#a94442`, `#ac2925`, `#adadad`, `#afd9ee`, `#bce8f1`, `#c0a16b`, `#c1e2b3`, `#c4e3f3`, `#c7254e`, `#c7ddef`, `#c9302c`, `#c9e2b3`, `#ccc`, `#ce8483`, `#d0e9c6`, `#d43f3a`, `#d58512`, `#d5d5d5`, `#d6e9c6`, `#d9534f`, `#d9edf7`, `#ddd`, `#dff0d8`, `#e3e3e3`, `#e4b9b9`, `#e4b9c0`, `#e5e5e5`, `#e6e6e6`, `#e7e7e7`, `#e8e8e8`, `#ebcccc`, `#ebccd1`, `#ebebeb`, `#ec971f`, `#eea236`, `#eee`, `#f0ad4e`, `#f2dede`, `#f5f5f5`, `#f7e1b5`, `#f7ecb5`, `#f7f7f7`, `#f8f8f8`, `#f9f2f4`, `#f9f9f9`, `#faebcc`, `#faf2cc`, `#fcf8e3`, `#ff0`, `#fff` plus `rgba(0,0,0,.0001|.05|.075|.1|.125|.15|.175|.2|.25|.5|.6|0)`, `rgba(102,175,233,.6)`, `rgba(255,255,255,.1|.15)`, named `transparent` / `inherit`. File header: `Bootstrap v3.3.4` and `normalize.css v3.0.2`.
- Font Awesome 4.3.0 `css/font-awesome.min.css`: `.fa-border{…;border:solid .08em #eee;…}` `.fa-inverse{color:#fff}`
- slick `css/slick.css`: `.slick-loading .slick-list { background: #fff url("./ajax-loader.gif") … }` ; `.slick-dots li button:before { … color: black; opacity: 0.25; }` ; `.slick-dots li.slick-active button:before { color: black; opacity: 0.75; }`
- PhotoSwipe `css/photoswipe.css`: `.pswp__bg { background: #000; }` `.pswp__img--placeholder--blank { background: #222; }` `.pswp__error-msg { color: #CCC; }` `.pswp__error-msg a { color: #CCC; }`
- PhotoSwipe default skin `css/default-skin.css` (plugin chrome, not lab brand): `#000`, `#3E5C9A`, `#55ACEE`, `#BBB`, `#CCC`, `#CE272D`, `#DDD`, `#FFF`, `rgba(0, 0, 0, 0.25|0.3|0.5)` e.g. `a.pswp__share--facebook:hover { background: #3E5C9A; color: #FFF; }` `a.pswp__share--twitter:hover { background: #55ACEE; color: #FFF; }` `a.pswp__share--pinterest:hover { background: #CCC; color: #CE272D; }`

### B. Logo and marks

**Visible header mark (not a raster).** HTML: `<a class="navbar-brand" href="index.html"><i class="fa fa-heartbeat"></i>Nile Egypt <span>Lab</span></a>`. The image logo is commented out: `<!--  <a class="navbar-brand" href="index.html"><img src="images/logo.png" alt="logo"></a>   -->`. Visible words: **Nile Egypt Lab**. Icon is Font Awesome `fa-heartbeat`, not a file.

**`images/logo.png`** — URL appears in that HTML comment; fetched.

- Exact URL: `http://nileegyptlabs.com/images/logo.png`
- `Content-Type: image/png`
- Measured: **274 × 35** px, PNG `IHDR` bitDepth=8, **colorType=2 (RGB, no alpha)**
- `Content-Length: 16447` bytes
- Background: **not transparent**. Corner pixels measured opaque cyan `Color [A=255, R=38, G=201, B=218]` (TL) / `R=39,G=199,B=221` (BR)
- `Last-Modified: Sun, 10 May 2015 14:02:50 GMT`
- Visible text in the image: **WPF MEDINOVA**
- Reads: **something else** (template vendor wordmark). Does not read “Nile Egypt Labs”.

**Favicon** — HTML: `<link rel="shortcut icon" type="image/icon" href="images/favicon.ico"/>`

- Exact URL: `http://nileegyptlabs.com/images/favicon.ico`
- Served `Content-Type: image/x-icon` but file signature is PNG `89 50 4E 47 0D 0A 1A 0A`
- Measured: **139 × 140** px, PNG colorType=2 (**no alpha**)
- `Content-Length: 9621` bytes
- Background: **not transparent**. Four corner pixels `Color [A=255, R=255, G=255, B=255]`
- `Last-Modified: Wed, 21 Feb 2018 19:51:13 GMT` (same calendar day as the HTML `Last-Modified`)
- Visible text in the image: English **Nile** and **EGYPT LAB**; Arabic **معامل النيل مصر**
- Reads: **Nile Egypt Lab** (English lockup is “Nile EGYPT LAB”, not “Labs”). Not generic/placeholder.

No other logo/wordmark raster is linked in the live (uncommented) HTML. Slider `images/14.jpg` etc. are photographs, not marks; they were not treated as logos.

### C. Typography

**`font-family` as written**

- `style.css` `body { font-family: 'Habibi', serif; }`
- `style.css` `ul{ … font-family: Arial, Helvetica, sans-serif; }`
- `style.css` `h1, h2, h3, h4, h5, h6{ font-family: 'Raleway', sans-serif; }`
- `style.css` `.navbar-brand { font-family: 'Cinzel Decorative', cursive; }`
- `style.css` `.counter-box { font-family: "Raleway",sans-serif; }` (and error-page rules also `"Raleway"`)
- `style.css` Font Awesome icon rules: `font-family: FontAwesome;`
- Bootstrap `css/bootstrap.min.css`: `html{font-family:sans-serif;…}` and `body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;…}` — body family **overridden** by Habibi.
- Bootstrap also `@font-face{font-family:'Glyphicons Halflings';…}` (framework icon font).
- `css/slick.css`: `font-family: "slick"` on dots pseudo-element.
- Font Awesome `css/font-awesome.min.css`: `@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.3.0');…woff2…woff…ttf…svg…}` — **self-hosted**, `http://nileegyptlabs.com/fonts/fontawesome-webfont.woff2?v=4.3.0`, `Content-Type: font/x-woff2`, `Last-Modified: Fri, 17 Apr 2015 20:56:24 GMT`, `Content-Length: 56780`.

**Webfonts**

- Google Fonts CSS requested over **http** (not https), from HTML:
  - `http://fonts.googleapis.com/css?family=Raleway` → `@font-face { font-family: 'Raleway'; font-weight: 400; src: url(http://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrQ.ttf) format('truetype'); }`
  - `http://fonts.googleapis.com/css?family=Habibi` → `src: url(http://fonts.gstatic.com/s/habibi/v22/CSR-4zFWkuqcTTNyTRha.ttf)`
  - `http://fonts.googleapis.com/css?family=Cinzel+Decorative:900` → `src: url(http://fonts.gstatic.com/s/cinzeldecorative/v19/daaHSScvJGqLYhG8nNt8KPPswUAPniZQa9lESTQ.ttf)`
- Those `@font-face` blocks have **no `unicode-range`**, no `subset=arabic`, and no Arabic in the file path. **No Arabic-capable webfont is loaded.** Arabic that exists is **bitmap text inside the favicon PNG**, not a typeface.

**Base size / headings / line-height / letter-spacing (declared)**

- Base size: Bootstrap `body{…font-size:14px;line-height:1.42857143;…}` — not restated on `body` in `style.css`. `style.css` `ul{ font-size: 16px; }`
- `h2`: `font-size: 30px; line-height: 40px;` (`style.css`)
- `.navbar-brand`: `font-size: 26px;` icon `font-size: 30px;`
- `.slider-text h2`: `font-size: 55px; line-height: 55px;` (smaller in media queries: 45/35/30/25px)
- `.slider-text p`: `font-size: 28px;`
- `.single-top-feature>h3`: `font-size: 30px;`
- `.single-service > p`: `font-size: 15px; letter-spacing: 0.5px; line-height: 25px;`
- Nav: `letter-spacing: 1px;`
- `.readmore_area a`: `letter-spacing: 1px;`
- `.doctors-nav figure button`: `letter-spacing: 1px;` (doctors block is HTML-commented)

### D. Template fingerprint

**Verdict: TEMPLATE (WpF Medinova / WpFreeware).**

Deciding source lines:

1. HTML comment at top of `http://nileegyptlabs.com`:
   `Template Design By WpFreeware Team.` / `Author URI : http://www.wpfreeware.com/`
2. `style.css` file header:
   `Template Name: WpF Medinova - Ultra Modern Responsive Bootstrap Medical Html5 Template` / `Author: WPFreeware Team` / `Author URI: http://wpfreeware.com/` / `Version: 1.0`
3. `css/themes/default-theme.css` file header:
   `Template Design By WpFreeware Team.` / `Author URI : http://www.wpfreeware.com/`
4. Vendor email still in HTML source (commented): `info@wpfmedinova.com`
5. Theme switcher attribute: `<link id="switcher" href="css/themes/default-theme.css" rel="stylesheet">`
6. Framework: Bootstrap **v3.3.4** (`css/bootstrap.min.css` header `Bootstrap v3.3.4 (http://getbootstrap.com)`); Font Awesome **4.3.0**; jQuery version UNDETERMINED (`js/jquery.js` is referenced but JS files are outside the expansion allow-list).
7. Demo residue still in the delivered HTML: visible footer sentence “The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.”; appointment modal with template departments (`Dental`, `cardiology`, …); large commented blocks of template doctors / Lorem Ipsum testimonials / “Dr. Smith”.
8. Visible footer credit line: `Design & Developed By Eng:-Androw Nader` (`<div class="footer-bottom">`).
9. Unused raster `images/logo.png` still serves **WPF MEDINOVA**, `Last-Modified: Sun, 10 May 2015 14:02:50 GMT`, versus HTML `Last-Modified: Wed, 21 Feb 2018 20:37:16 GMT`.

### E. Arabic and direction

- This URL: `<html lang="en">`. **No** `dir="rtl"`. **No** `lang="ar"` on any element in this document.
- Nav labels are English only (`Home`, `Our Program`, `About Us`, `Online Result`, `Contact`). **No language switcher.**
- No Arabic webfont (see C). Arabic appears only as pixels in `images/favicon.ico`.
- Layout is LTR template structure (Bootstrap `navbar-right`, `fa` icons with `margin-right`). Whether an Arabic **page** exists at another path is UNDETERMINED (navigation links not followed).

### F. Facebook

Not applicable (site 2).

---

## Site 3 — `https://www.facebook.com/NileEgyptLabsEGY/`

**Fetch record.**

- `curl` of the listed URL with a generic UA: `HTTP/1.1 400 Bad Request` (no HTML body used).
- A separate fetch of the same listed URL returned converted public page HTML. Facebook chrome includes a Log In control. No credential was submitted. Photo-album / post / About links were **not** followed. Extraction limited to profile and cover image URLs that appeared in that HTML, per F.

Both `<img>` URLs share Facebook media id `485029501_967247055584864` (one JPEG, two crops).

### A. Colour

Not collected. Site-3 fence is brand assets only. Facebook chrome CSS is not lab CSS. The successful fetch returned converted markup without the page’s stylesheets.

### B. Logo and marks (profile + cover only)

**Profile crop** (first `img` in the fetched HTML)

- URL (as in HTML): `https://scontent-iad3-1.xx.fbcdn.net/v/t39.30808-6/485029501_967247055584864_1875196552603375799_n.jpg?stp=dst-jpg_fb50_s320x320_tt6` + Facebook CDN query string as delivered
- `Content-Type: image/jpeg`
- Measured: **320 × 180** px, `PixelFormat=Format24bppRgb` (no alpha)
- `Content-Length: 2771` bytes
- Background: **not transparent** (JPEG, opaque pixels; TL `R=164,G=180,B=196`)
- `Last-Modified: Thu, 20 Mar 2025 03:12:49 GMT`
- Visible text: **none readable**. The crop is a 16:9 blur of the same source as the cover; no wordmark could be read.
- Reads: **UNDETERMINED** at this crop size. It is not a distinct square logo file in the HTML; it is a small crop of media `485029501`.

**Cover crop** (second `img` in the fetched HTML)

- URL (as in HTML): `https://scontent-iad3-1.xx.fbcdn.net/v/t39.30808-6/485029501_967247055584864_1875196552603375799_n.jpg?stp=dst-jpg_tt6&cstp=mx1600x901&ctp=s960x960` + Facebook CDN query string as delivered
- `Content-Type: image/jpeg`
- Measured: **960 × 541** px, `PixelFormat=Format24bppRgb` (no alpha)
- `Content-Length: 66532` bytes
- Background: **not transparent**. TL `R=245,G=245,B=245`; BL/BR `R=0–1, G=42–43, B=98`
- `Last-Modified: Thu, 20 Mar 2025 03:12:49 GMT` (same as the profile crop)
- Visible brand text in the image (hotline digits omitted per collection fence):
  - **YOUR WAY FOR ACCURATE DIAGNOSIS**
  - **Nile**
  - **EGYPT LAB**
  - **معامل النيل مصر**
  - **MORE INFORMATION**
  - **www.nileegyptlabs.com**
- The mark in the cover is a **logo** (flask + bilingual wordmark in a white circle), not a photograph of a person and not a generic silhouette placeholder. The rest of the banner is a designed composite (microscope photograph + geometry). Layout of the banner is LTR.

### C. Typography

Not collected (site-3 fence). Facebook chrome type is not a lab webfont load.

### D. Template fingerprint

Not applicable as a lab site template. The listed URL is a Facebook page. No WpFreeware/Medinova/Bootstrap signature was read from lab CSS here (no lab CSS fetched).

### E. Arabic and direction

Not collected beyond the cover raster: the cover lockup includes **معامل النيل مصر**. Facebook chrome `dir`/`lang` UNDETERMINED (raw HTML from curl was 400; converted fetch did not preserve html attributes). Page intro copy and posts were not used.

### F. Facebook page — brand assets (this section is the allowed extract)

See B. Nothing else from the page is reported.

---

## Cross-check

**Palette.** Site 1 palette is UNDETERMINED (302 stop). Site 2’s winning chrome is WpFreeware Medinova yellow `#ffd133` plus one local override `#3333FF` on `.slider-text h2>strong`. No comparison to the results portal is possible from fetched CSS.

**Logo.** Site 1: none fetched. Site 2 live header is HTML text **Nile Egypt Lab** + Font Awesome heartbeat, not a lab raster. Site 2 `images/logo.png` is **WPF MEDINOVA** (2015-05-10), commented out of the header. Site 2 favicon is a bilingual flask wordmark **Nile EGYPT LAB** / **معامل النيل مصر** (PNG served as `.ico`, 2018-02-21). Facebook cover (2025-03-20) shows a flask + **Nile** / **EGYPT LAB** / **معامل النيل مصر** lockup of the same family, on a designed banner that does not appear on site 2’s live header. Whether favicon and cover lockup are the same master file is UNDETERMINED (different composition: favicon is flask-on-white 139×140; cover places the mark in a circle on a 960×541 banner).

**Template fingerprint.** Site 2 is **TEMPLATE (WpF Medinova)**. Site 1 named theme is UNDETERMINED; only IIS/ASP.NET headers on the listed URL. They do **not** share a demonstrated HTML template. They were not shown to share a palette or a live header logo.

Site 1 therefore cannot be scored as “more likely genuine brand” from this fetch: its UI was not seen. Site 2’s **page chrome is a named stock medical template** (yellow `#ffd133`, Cinzel Decorative wordmark, heartbeat icon, unused WPF MEDINOVA raster). That is not a lab-owned identity for the homepage UI. A flask bilingual mark **does** exist outside that chrome (favicon + Facebook cover). The Facebook cover is not a logo that appears on **neither** site: the same bilingual flask reading appears on site 2’s favicon.

**WHERE, IF ANYWHERE, DOES A GENUINE NILE EGYPT LABS BRAND ASSET EXIST?** In the 2018 favicon at `http://nileegyptlabs.com/images/favicon.ico` (bilingual flask, “Nile EGYPT LAB” / “معامل النيل مصر”, dated the same day as the HTML) and again as the lockup on the Facebook cover JPEG `485029501_967247055584864` (Last-Modified 2025-03-20); not in the live 2018 header, not in `images/logo.png`, and UNDETERMINED for the results portal because fetch stopped at `Location: https://www.nileegyptlabresults.com/Login`.
