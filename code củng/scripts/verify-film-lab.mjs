import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox", "--disable-gpu"] });

try {
  for (const viewport of [{ width: 1440, height: 900, name: "desktop" }, { width: 820, height: 900, name: "tablet" }, { width: 390, height: 844, name: "mobile" }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", acceptDownloads: true });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/film-lab", { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("heading", { name: /Một cú chụp/i, level: 1 }).isVisible(), true);
    assert.match((await page.locator(".lab-risk-row").first().textContent()) || "", /CAO/);

    await page.getByRole("button", { name: "Ngoài trời nắng" }).click();
    assert.match((await page.locator(".lab-risk-row").first().textContent()) || "", /THẤP/);
    await page.getByRole("button", { name: "Sân khấu \/ concert" }).click();
    await page.getByRole("button", { name: "20m+" }).click();
    await page.getByRole("button", { name: "Bật", exact: true }).click();
    assert.match((await page.locator(".lab-risk-row").nth(2).textContent()) || "", /QUÁ XA/);
    assert.match((await page.locator(".lab-suggestions").textContent()) || "", /Flash khó giúp/);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /LƯU THẺ ẢNH/ }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "soorah-film-lab-shot-card.png");

    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(dimensions.document <= dimensions.viewport + 1, `${viewport.name}: tràn ngang ${JSON.stringify(dimensions)}`);
    const motion = await page.locator(".lab-preview img").evaluate((element) => getComputedStyle(element).transitionDuration);
    assert.ok(parseFloat(motion) <= 0.001, `${viewport.name}: transition ${motion}`);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    assert.equal(axe.violations.length, 0, `${viewport.name}: ${axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`).join("; ")}`);
    await page.screenshot({ path: `/private/tmp/soorah-film-lab-${viewport.name}.png`, fullPage: true });
    console.log(`${viewport.name}: route, rủi ro, flash, lưu thẻ, chiều rộng, giảm chuyển động và WCAG A/AA đều đạt`);
    await context.close();
  }
} finally {
  await browser.close();
}
