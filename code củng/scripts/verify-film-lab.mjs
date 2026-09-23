import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox", "--disable-gpu"] });

try {
  for (const viewport of [{ width: 1440, height: 900, name: "desktop" }, { width: 1280, height: 600, name: "short" }, { width: 820, height: 900, name: "tablet" }, { width: 390, height: 844, name: "mobile" }, { width: 375, height: 667, name: "short-mobile" }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", acceptDownloads: true });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/film-lab", { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("heading", { name: /Một cú chụp/i, level: 1 }).isVisible(), true);
    assert.match((await page.locator(".lab-risk-row").first().textContent()) || "", /CAO/);
    assert.equal(await page.locator(".lab-traffic-dot.active.lab-traffic-high").count(), 1);

    await page.locator("#kiem-tra").evaluate((element) => element.scrollIntoView());
    const workbench = await page.evaluate(() => {
      const section = document.querySelector("#kiem-tra");
      const preview = document.querySelector(".lab-preview");
      const verdict = document.querySelector(".lab-verdict");
      const controls = document.querySelector(".lab-controls");
      return { sectionHeight: section.getBoundingClientRect().height, previewTop: preview.getBoundingClientRect().top, previewBottom: preview.getBoundingClientRect().bottom, previewHeight: preview.getBoundingClientRect().height, verdictBottom: verdict.getBoundingClientRect().bottom, certaintyBottom: document.querySelector(".lab-certainty").getBoundingClientRect().bottom, outputBottom: document.querySelector(".lab-output").getBoundingClientRect().bottom, controlsBottom: controls.getBoundingClientRect().bottom, viewport: innerHeight, windowScroll: scrollY };
    });
    assert.ok(Math.abs(workbench.sectionHeight - viewport.height) <= 1, `${viewport.name}: workbench ${JSON.stringify(workbench)}`);
    assert.ok(workbench.previewBottom <= viewport.height + 1 && workbench.previewTop >= 0 && workbench.previewHeight >= 95 && workbench.verdictBottom <= viewport.height + 1 && workbench.certaintyBottom <= workbench.outputBottom + 1 && workbench.controlsBottom <= viewport.height + 1, `${viewport.name}: preview/kết quả ra khỏi khung ${JSON.stringify(workbench)}`);
    const compare = page.getByRole("slider", { name: /KÉO ĐỂ SO SÁNH ẢNH MẪU/ });
    await compare.focus();
    await compare.press("ArrowRight");
    assert.equal(await compare.inputValue(), "51");
    const previewBounds = await page.locator(".lab-preview").boundingBox();
    await page.mouse.move(previewBounds.x + previewBounds.width * .4, previewBounds.y + previewBounds.height * .5);
    await page.mouse.down();
    await page.mouse.move(previewBounds.x + previewBounds.width * .7, previewBounds.y + previewBounds.height * .5);
    await page.mouse.up();
    assert.ok(Number(await compare.inputValue()) >= 68 && Number(await compare.inputValue()) <= 72);

    await page.locator(".lab-controls-scroll").evaluate((element) => { element.scrollTop = element.scrollHeight; });
    const stable = await page.evaluate(() => ({ windowScroll: scrollY, controlsScroll: document.querySelector(".lab-controls-scroll").scrollTop, previewBottom: document.querySelector(".lab-preview").getBoundingClientRect().bottom }));
    assert.ok(Math.abs(stable.windowScroll - workbench.windowScroll) <= 1 && stable.controlsScroll > 0 && stable.previewBottom <= viewport.height + 1, `${viewport.name}: cuộn điều khiển làm mất preview ${JSON.stringify(stable)}`);
    await page.screenshot({ path: `/private/tmp/soorah-film-lab-workbench-${viewport.name}.png` });

    await page.getByRole("button", { name: "Ngoài trời nắng" }).click();
    assert.match((await page.locator(".lab-risk-row").first().textContent()) || "", /THẤP/);
    assert.equal(await page.locator(".lab-traffic-dot.active.lab-traffic-low").count(), 1);
    await page.getByRole("button", { name: "Sân khấu \/ concert" }).click();
    await page.getByRole("button", { name: "20m+" }).click();
    await page.getByRole("button", { name: "Bật", exact: true }).click();
    assert.match((await page.locator(".lab-risk-row").nth(2).textContent()) || "", /QUÁ XA/);
    assert.equal(await page.locator(".lab-traffic-dot.active.lab-traffic-high").count(), 1);
    assert.match((await page.locator(".lab-suggestions").textContent()) || "", /Flash khó giúp/);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /LƯU THẺ ẢNH/ }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "soorah-film-lab-shot-card.png");

    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(dimensions.document <= dimensions.viewport + 1, `${viewport.name}: tràn ngang ${JSON.stringify(dimensions)}`);
    const motion = await page.locator(".lab-preview-estimate img").evaluate((element) => getComputedStyle(element).transitionDuration);
    assert.ok(parseFloat(motion) <= 0.001, `${viewport.name}: transition ${motion}`);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    assert.equal(axe.violations.length, 0, `${viewport.name}: ${axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`).join("; ")}`);
    await page.screenshot({ path: `/private/tmp/soorah-film-lab-${viewport.name}.png`, fullPage: true });
    console.log(`${viewport.name}: một khung nhìn, ba chấm, so ảnh bằng bàn phím, rủi ro, flash, lưu thẻ, chiều rộng, giảm chuyển động và WCAG A/AA đều đạt`);
    await context.close();
  }
} finally {
  await browser.close();
}
