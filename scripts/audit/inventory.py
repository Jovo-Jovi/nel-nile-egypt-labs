"""NEL delivered inventory - reviewer tooling, P07 Stage 1.

Run from the repository root:   python -X utf8 scripts/audit/inventory.py
Reads tracked files only (git ls-files). No network, no database.
Schema figures are the sequential replay of the timestamped forward
migrations in supabase/migrations/, not a live read.

Counting rules (SCOPE.md section 2 states the same rules):
  page     = one tracked page.tsx file = one URL pattern, served in ar and en
  handler  = one tracked route.ts file = an endpoint, never counted as a page
  static   = a page pattern with no dynamic segment other than [locale]
  dynamic  = a page pattern with a further [param]; its URL count is data-dependent
"""
import re, subprocess, collections, os

def ls(*pat):
    out = subprocess.run(["git", "ls-files", *pat], capture_output=True, text=True).stdout
    return [p for p in out.split("\n") if p]

def seg(p):
    parts = [s for s in p.split("/")[:-1] if not (s.startswith("(") and s.endswith(")"))]
    return "/" + "/".join(parts)

app = [p[len("src/app/"):] for p in ls("src/app")]
pages = [p for p in app if p.endswith("page.tsx")]
handlers = [p for p in app if p.endswith("route.ts")]

public = sorted(seg(p) for p in pages if p.startswith("[locale]/(public)/"))
pub_static = [r for r in public if "[" not in r.replace("[locale]", "")]
pub_dynamic = [r for r in public if "[" in r.replace("[locale]", "")]
dash_pages = sorted(seg(p) for p in pages if p.startswith("[locale]/dashboard/"))
dash_auth_pages = [r for r in dash_pages if r.split("/")[-1] in ("sign-in", "enrol", "challenge")]
dash_home = [r for r in dash_pages if r == "/[locale]/dashboard"]
dash_module_pages = [r for r in dash_pages if r not in dash_auth_pages + dash_home]
partner_pages = sorted(seg(p) for p in pages if p.startswith("[locale]/partner-lab/"))
dash_handlers = sorted(seg(p) for p in handlers if p.startswith("[locale]/dashboard/"))
partner_handlers = sorted(seg(p) for p in handlers if p.startswith("[locale]/partner-lab/"))
other_handlers = sorted(seg(p) for p in handlers if not p.startswith("[locale]/"))
modules = sorted({p.split("(modules)/")[1].split("/")[0] for p in app if "(modules)/" in p} - {"layout.tsx"})
seed_programmes = sum(1 for _ in open("data/seed/programmes.csv", encoding="utf-8-sig")) - 1

print("== ROUTES")
print("page.tsx total:", len(pages), "| route.ts total:", len(handlers))
print("PUBLIC pages:", len(public), "=", len(pub_static), "static +", len(pub_dynamic), "dynamic")
for r in pub_static: print("   static ", r)
for r in pub_dynamic: print("   dynamic", r)
print("PUBLIC URLs: %d static per locale, %d both locales; plus 2N detail URLs (N = published Programme rows)"
      % (len(pub_static), 2 * len(pub_static)))
print("PUBLIC URLs if N = %d (seed Programmes): %d per locale, %d both locales"
      % (seed_programmes, len(pub_static) + seed_programmes, 2 * (len(pub_static) + seed_programmes)))
print("DASHBOARD pages:", len(dash_pages), "= auth", len(dash_auth_pages), "+ home", len(dash_home),
      "+ module", len(dash_module_pages))
for r in dash_auth_pages: print("   auth   ", r)
print("DASHBOARD modules:", len(modules), modules)
for m in modules:
    print("   %-14s pages %d  handlers %d" % (m,
          sum(1 for r in dash_module_pages if r.split("/dashboard/")[1].split("/")[0] == m),
          sum(1 for r in dash_handlers if "/dashboard/" + m + "/" in r + "/")))
print("PARTNERLAB pages:", len(partner_pages), partner_pages)
print("HANDLERS: dashboard", len(dash_handlers), "| partner-lab", len(partner_handlers),
      "| non-locale", len(other_handlers), other_handlers)
print("AUTH-RELATED pages (dashboard auth + PartnerLab):", len(dash_auth_pages) + len(partner_pages))
print("MIDDLEWARE:", ls("src/middleware.ts", "src/proxy.ts"))

def strip(s):
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    return re.sub(r"--[^\n]*", "", s)

mig = ls("supabase/migrations")
fw = sorted(m for m in mig if re.match(r"\d{14}_", os.path.basename(m)))
down = [m for m in mig if m.endswith(".down.sql")]
ev = re.compile(r'''create\s+type\s+public\."(?P<enum>\w+)"|create\s+table\s+(?:if\s+not\s+exists\s+)?public\."(?P<ct>\w+)"|drop\s+table\s+(?:if\s+exists\s+)?public\."(?P<dt>\w+)"|create\s+policy\s+"(?P<cp>\w+)"\s+on\s+(?P<cpt>[\w."]+)|drop\s+policy\s+(?:if\s+exists\s+)?"(?P<dp>\w+)"|create\s+(?:or\s+replace\s+)?function\s+(?P<cf>[\w."]+)\s*\(|drop\s+function\s+(?:if\s+exists\s+)?(?P<df>[\w."]+)|insert\s+into\s+storage\.buckets[^;]*?values\s*\(\s*'(?P<bk>[\w-]+)'|create\s+(?:or\s+replace\s+)?(?:constraint\s+)?trigger\s+"?(?P<tg>\w+)"?|constraint\s+"(?P<fk>\w+_fkey)"\s+foreign\s+key\s*\(\s*"?(?P<src>\w+)"?\s*\)\s*references\s+public\."(?P<tgt>\w+)"''', re.I | re.S)
enums, tables, pol, funcs, buckets, trig, fks = set(), [], {}, set(), set(), set(), []
for f in fw:
    for m in ev.finditer(strip(open(f, encoding="utf-8").read())):
        g = m.groupdict()
        if g["enum"]: enums.add(g["enum"])
        elif g["ct"]: tables.append(g["ct"])
        elif g["dt"]: tables.remove(g["dt"])
        elif g["cp"]: pol[g["cp"]] = g["cpt"].replace('"', "")
        elif g["dp"]: pol.pop(g["dp"], None)
        elif g["cf"]: funcs.add(g["cf"].replace('"', ""))
        elif g["df"]: funcs.discard(g["df"].replace('"', ""))
        elif g["bk"]: buckets.add(g["bk"])
        elif g["tg"]: trig.add(g["tg"])
        elif g["fk"]: fks.append((g["fk"].split("_")[0] + "." + g["src"], g["tgt"]))
pub = {k: v for k, v in pol.items() if v.startswith("public.")}
print("== SCHEMA (replayed from forward migrations)")
print("MIGRATIONS: forward %d | reverse .down.sql %d | total .sql %d" % (len(fw), len(down), len(mig)))
print("ENUM TYPES:", len(enums), sorted(enums))
print("TABLES:", len(tables), tables)
print("POLICIES:", len(pol), "= public", len(pub), "+ storage.objects", len(pol) - len(pub))
print("   per public table:", dict(collections.Counter(v.split(".")[1] for v in pub.values())))
print("   names:", sorted(pol))
print("FUNCTIONS:", len(funcs), sorted(funcs))
print("TRIGGERS:", len(trig), sorted(trig))
print("STORAGE BUCKETS:", len(buckets), sorted(buckets))
print("FOREIGN KEYS:", len(fks), "| to MediaAsset:", sum(1 for _, t in fks if t == "MediaAsset"))
for s, t in fks: print("   ", s, "->", t)

print("== APPLICATION")
cat = open("src/lib/catalog.ts", encoding="utf-8").read().split("\n")
a0 = cat.index("const ar = {"); e0 = cat.index("const en = {")
end = next(i for i, l in enumerate(cat) if l.startswith("export type CatalogKey"))
def keys(lines):
    return [m.group(2) for m in (re.match(r'^\s{2}("?)([\w.\-]+)\1\s*:', l) for l in lines) if m]
ka, ke = keys(cat[a0 + 1:e0]), keys(cat[e0 + 1:end])
print("CATALOGUE keys: ar %d | en %d | identical sets %s" % (len(ka), len(ke), set(ka) == set(ke)))
env = set()
for p in ls("src", "scripts"):
    if p.endswith((".ts", ".tsx", ".mjs")):
        env |= set(re.findall(r"process\.env\.([A-Z0-9_]+)", open(p, encoding="utf-8").read()))
print("ENV VARIABLE NAMES read by src/ and scripts/:", len(env), sorted(env))
specs = [p for p in ls() if re.search(r"\.spec\.tsx?$", p)]
cases = sum(len(re.findall(r"^\s*(?:test|it)\(", open(p, encoding="utf-8").read(), re.M)) for p in specs)
print("SPECS: files", len(specs), "| declared top-level cases", cases)
ci = open(".github/workflows/ci.yml", encoding="utf-8").read()
steps = re.findall(r"- name: (.+)", ci)
print("CI steps:", len(steps), steps)
print("CI runs specs:", bool(re.search(r"--test|spec", ci)))
