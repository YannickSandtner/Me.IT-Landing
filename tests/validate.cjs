/**
 * Static validation for the Intellectual Twin in Insurance landing page.
 * Run with: node tests/validate.cjs   (from the repository root)
 *
 * The page is the original repo site with two intentional changes:
 *  1. former client logos are removed (lockup shows "Me.IDs · For Insurance")
 *  2. the former client use-case section is replaced by use cases for the
 *     three lines of business (composite, life, health) plus cross-line.
 *
 * Checks content integrity, bilingual data-en/data-de pairing, the original
 * page structure and that no former client-brand references remain.
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const htmlPath = path.join(root, "index.html");
const cssPath = path.join(root, "styles.css");
const jsPath = path.join(root, "script.js");

const errors = [];
const warnings = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

const html = readIfExists(htmlPath);
const css = readIfExists(cssPath);
const js = readIfExists(jsPath);

check(html !== null, "index.html not found");
check(css !== null, "styles.css not found");
check(js !== null, "script.js not found");

if (html && css && js) {
  // 1. Basic document structure
  check(/<!doctype html>/i.test(html), "Missing <!doctype html>");
  check(/<\/html>/i.test(html), "Missing closing </html>");
  check((html.match(/<h1[\s>]/g) || []).length === 1, "Expected exactly one <h1>");
  check(/<meta name="viewport"/.test(html), "Missing viewport meta tag");
  check(/<title>[^<]+<\/title>/.test(html), "Missing <title>");
  check(html.includes('lang="en"'), "Missing lang attribute on <html>");

  // 2. Page structure: original sections present
  const requiredSections = ["top", "problem", "model", "value", "contact"];
  requiredSections.forEach((id) => {
    check(html.includes(`id="${id}"`), `Required section id="${id}" missing`);
  });

  // 3. No former client-brand references (logos and texts)
  const brandPattern = /signal[\s_-]?iduna/i;
  for (const [name, content] of [["index.html", html], ["styles.css", css], ["script.js", js]]) {
    check(!brandPattern.test(content), `Client-brand reference found in ${name}`);
  }
  check(!html.includes("client-logo"), "Removed .client-logo reference still present in index.html");
  check(!html.includes("signal-iduna-logo"), "Removed client logo asset still referenced in index.html");
  check(!html.includes("signal-iduna-mark"), "Removed client mark asset still referenced in index.html");
  check(!css.includes("client-logo"), "Removed .client-logo styles still present in styles.css");

  // 4. Bilingual pairing: every data-en has a matching data-de and vice versa
  const enCount = (html.match(/data-en="/g) || []).length;
  const deCount = (html.match(/data-de="/g) || []).length;
  check(enCount === deCount, `data-en (${enCount}) and data-de (${deCount}) counts differ`);
  check(enCount > 0, "No translatable elements found");

  const openTags = html.match(/<[a-z][^>]*>/gi) || [];
  openTags.forEach((tag) => {
    const hasEn = /data-en="[^"]*"/.test(tag);
    const hasDe = /data-de="[^"]*"/.test(tag);
    if (hasEn !== hasDe) {
      check(false, `Unpaired language attribute in tag: ${tag.slice(0, 90)}`);
    }
    if (hasEn) {
      const en = tag.match(/data-en="([^"]*)"/) || ["", ""];
      const de = tag.match(/data-de="([^"]*)"/) || ["", ""];
      if (!en[1].trim() || !de[1].trim()) {
        check(false, `Empty language attribute in tag: ${tag.slice(0, 90)}`);
      }
    }
  });

  // 5. Use cases: four cards, one per line of business plus cross-line
  const valueCards = (html.match(/class="value-card reveal"/g) || []).length;
  check(valueCards === 4, `Expected 4 use-case cards, found ${valueCards}`);
  const cardBlocks = html.match(/<article class="value-card reveal">[\s\S]*?<\/article>/g) || [];
  check(cardBlocks.length === 4, `Expected 4 closed use-case card blocks, found ${cardBlocks.length}`);

  const requiredLines = ["01 · Komposit", "02 · Leben", "03 · Kranken", "04 · Übergreifend"];
  requiredLines.forEach((name) => {
    check(html.includes(`data-de="${name}"`), `Expected use-case card missing: ${name}`);
  });
  ["SIGNAL IDUNA", "Privaten Krankenversicherung", "private health insurance"].forEach((phrase) => {
    check(!html.includes(phrase), `Former client-specific phrasing still present: ${phrase}`);
  });

  // 6. Hero lockup shows the generic line instead of the client logo
  check(html.includes('class="lockup-line"'), "Hero lockup generic line missing");
  check(html.includes("assets/meids-logo.svg"), "Me.IDs logo missing in hero lockup");

  // 7. Generic positioning notes remain
  check(html.includes("Versicherungsbranche"), "Generic industry note missing in German text");
  check(!/private[rn]? [Kk]rankenversicherung/.test(html), "Health-insurance-only phrasing still present");

  // 8. Form topic options remain aligned with the use cases
  check(html.includes('value="medical-risk-assessment"'), 'Form option value="medical-risk-assessment" missing');
  check(html.includes('value="benefits-assessment"'), 'Form option value="benefits-assessment" missing');
    // 8b. Contact emails sit with each person
  check(html.includes('href="mailto:Florian.Liepe@eraneos.com"'), "Florian contact email missing");
  check(html.includes('href="mailto:Oliver.Huefner@eraneos.com"'), "Oliver contact email missing");
  check((html.match(/class="contact-email"/g) || []).length === 2, "Expected exactly 2 contact-email links (one per person)");

  // 9. Styles present for the original structure
  check(css.includes(".value-card"), "Missing .value-card styles in styles.css");
  check(css.includes(".event-lockup"), "Missing .event-lockup styles in styles.css");
  check(css.includes(".client-context"), "Missing .client-context styles in styles.css");
  check(css.includes(".lockup-line"), "Missing .lockup-line styles in styles.css");
  check(css.includes(".site-nav") === false, "Unexpected .site-nav styles present in styles.css");

  // 10. Asset references exist on disk (warn only: binaries are copied from the source archive)
  const assetRefs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((m) => m[1]);
  [...new Set(assetRefs)].forEach((ref) => {
    if (!fs.existsSync(path.join(root, ref))) {
      warnings.push(`Asset missing (copy from source archive): ${ref}`);
    }
  });
}

if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  ✖ ${e}`));
  process.exit(1);
}

console.log("Validation passed: original page structure intact, 4 use-case cards (Komposit/Leben/Kranken/übergreifend), no client-brand references, bilingual pairs consistent.");
