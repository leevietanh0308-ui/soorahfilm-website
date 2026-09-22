import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox", "--disable-gpu"] });
const baseURL = "http://127.0.0.1:3000";
let failures = 0;

for (const viewport of [{ width: 1440, height: 900, name: "desktop" }, { width: 390, height: 844, name: "mobile" }]) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.screenshot({ path: `/private/tmp/soorah-${viewport.name}-verified.png` });
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
  const visible = await page.getByRole("heading", { name: /SOORAH/i, level: 1 }).isVisible();
  const destinations = await page.locator(".destination-card").count();
  const aboutOnHome = await page.locator("#about .brand-grid").count() > 0;
  const aboutEntry = await page.locator('.destination-card[href="/about"]').count() === 1;
  const galleryOnHome = await page.locator("#gallery .film-frame").count();
  const galleryLayout = await page.locator("#gallery .film-strip").evaluate((strip) => ({
    columns: Number(getComputedStyle(strip).columnCount),
    scrollWidth: strip.scrollWidth,
    clientWidth: strip.clientWidth,
    height: strip.getBoundingClientRect().height,
    correctRatios: [...strip.querySelectorAll(".frame-image img")].every((image) => Math.abs(image.clientWidth / image.clientHeight - Number(image.getAttribute("width")) / Number(image.getAttribute("height"))) < 0.03),
    loadedImages: [...strip.querySelectorAll(".frame-image img")].filter((image) => image.complete && image.naturalWidth > 0).length,
  }));
  console.log(`${viewport.name}: trang đầu=${visible}, khung nhìn=${dimensions.viewport}, chiều rộng trang=${dimensions.document}`);
  console.log(`${viewport.name}: Về SOORAH tách khỏi trang tổng=${!aboutOnHome && aboutEntry}, ảnh film=${galleryOnHome}`);
  console.log(`${viewport.name}: thư viện cuộn dọc=${galleryLayout.height > viewport.height}, số cột=${galleryLayout.columns}, tràn ngang=${galleryLayout.scrollWidth > galleryLayout.clientWidth + 1}, đúng tỷ lệ ảnh=${galleryLayout.correctRatios}, ảnh đã tải=${galleryLayout.loadedImages}`);
  if (!visible || destinations !== 4 || aboutOnHome || !aboutEntry || galleryOnHome !== 18 || dimensions.document > dimensions.viewport + 1 || galleryLayout.height <= viewport.height || galleryLayout.columns !== (viewport.name === "mobile" ? 1 : 3) || galleryLayout.scrollWidth > galleryLayout.clientWidth + 1 || !galleryLayout.correctRatios || galleryLayout.loadedImages !== galleryOnHome) failures++;
  const homeAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  console.log(`${viewport.name}: lỗi tiếp cận trang chủ=${homeAxe.violations.length}`);
  for (const violation of homeAxe.violations) console.log(`  ${violation.id}: ${violation.nodes.map((node) => `${node.target.join(' ')} [${node.failureSummary}]`).join('; ')}`);
  failures += homeAxe.violations.length;

  await page.locator("#gallery .frame-image").first().click();
  const lightbox = page.getByRole("dialog", { name: /Ảnh film phóng to/i });
  await lightbox.waitFor({ state: "visible" });
  const imageOpens = await lightbox.isVisible();
  await lightbox.getByRole("button", { name: "Đóng ảnh phóng to" }).click();
  console.log(`${viewport.name}: ảnh film mở lớn=${imageOpens}`);
  if (!imageOpens) failures++;

  if (viewport.name === "mobile") {
    await page.getByRole("button", { name: "Mở menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Điều hướng di động" });
    await mobileNav.waitFor({ state: "visible" });
    const menuVisible = await mobileNav.isVisible();
    console.log(`điện thoại: menu=${menuVisible}`);
    if (!menuVisible) failures++;
    await mobileNav.getByRole("link", { name: /Hướng dẫn/i }).click();
    await page.waitForURL("**/guide");
  }

  for (const { path, selector } of [
    { path: "/about", selector: ".about-opening" },
    { path: "/products", selector: ".catalog-category-grid" },
    { path: "/products/film-rolls", selector: ".film-roll-grid" },
    { path: "/products/disposable-cameras", selector: ".next-drop" },
    { path: "/community", selector: ".community-section" },
  ]) {
    await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle" });
    const headingVisible = await page.locator("main h1").first().isVisible();
    const sectionPresent = await page.locator(selector).count() === 1;
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`${viewport.name}: ${path} tiêu đề=${headingVisible}, nội dung=${sectionPresent}, chiều rộng=${pageWidth}`);
    if (!headingVisible || !sectionPresent || pageWidth > viewport.width + 1) failures++;
    if (path === "/products") {
      const categoryImage = await page.locator(".film-roll-category img").evaluate((image) => image.complete && image.naturalWidth > 0 && decodeURIComponent(image.currentSrc).includes("film-roll-category.webp"));
      const cameraPreview = await page.locator(".disposable-category .teaser-camera").count() === 1;
      console.log(`${viewport.name}: ảnh AI ô cuộn film=${categoryImage}, ô máy film=${cameraPreview}`);
      if (!categoryImage || !cameraPreview) failures++;
    }
    const routeAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    console.log(`${viewport.name}: lỗi tiếp cận ${path}=${routeAxe.violations.length}`);
    for (const violation of routeAxe.violations) console.log(`  ${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join("; ")}`);
    failures += routeAxe.violations.length;
  }

  await page.goto(`${baseURL}/about`, { waitUntil: "networkidle" });
  const aboutCopy = await page.locator(".about-opening h2").textContent();
  const aboutClosing = await page.locator(".about-closing h2").textContent();
  const aboutStandalone = page.url().endsWith("/about") && aboutCopy?.includes("trải nghiệm của những người trẻ mới bước vào nhiếp ảnh analog") && aboutClosing?.includes("việc bắt đầu chơi film trở nên dễ hơn");
  console.log(`${viewport.name}: trang Về SOORAH riêng và đủ thông điệp=${Boolean(aboutStandalone)}`);
  if (!aboutStandalone) failures++;

  await page.goto(`${baseURL}/products/film-rolls`, { waitUntil: "networkidle" });
  const rollCards = await page.locator(".film-roll-card").count();
  const upcomingLinks = await page.locator(".film-roll-card-soon a").count();
  const kodakCardPhoto = await page.locator(".film-roll-card-active img").evaluate((image) => image.complete && image.naturalWidth > 0 && decodeURIComponent(image.currentSrc).includes("kodak-ultramax-400-card.jpeg"));
  await page.locator(".film-roll-card-active").click();
  await page.waitForURL("**/product/kodak-ultramax-400");
  const immersiveHero = await page.locator(".product-story h1").isVisible();
  await page.locator(".product-story-object img").evaluate((image) => image.decode());
  const cutoutLoaded = await page.locator(".product-story-object img").evaluate((image) => image.complete && image.naturalWidth > 0 && decodeURIComponent(image.currentSrc).includes("kodak-ultramax-cutout.png"));
  console.log(`${viewport.name}: ô cuộn film=${rollCards}, ảnh Kodak mới=${kodakCardPhoto}, ô chờ không mở trang=${upcomingLinks === 0}, chi tiết sống động=${immersiveHero}, ảnh PNG=${cutoutLoaded}`);
  if (rollCards !== 3 || !kodakCardPhoto || upcomingLinks !== 0 || !immersiveHero || !cutoutLoaded) failures++;

  await page.goto(`${baseURL}/guide`, { waitUntil: "networkidle" });
  const guideAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  console.log(`${viewport.name}: lỗi tiếp cận hướng dẫn=${guideAxe.violations.length}`);
  for (const violation of guideAxe.violations) console.log(`  ${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join('; ')}`);
  failures += guideAxe.violations.length;

  await page.goto(`${baseURL}/product/kodak-ultramax-400`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `/private/tmp/soorah-product-${viewport.name}.png` });
  const productAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  console.log(`${viewport.name}: lỗi tiếp cận sản phẩm=${productAxe.violations.length}`);
  for (const violation of productAxe.violations) console.log(`  ${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join('; ')}`);
  failures += productAxe.violations.length;
  await page.getByRole("button", { name: /THÊM VÀO GIỎ/i }).click();
  const drawer = page.getByRole("dialog", { name: "Giỏ hàng" });
  await drawer.waitFor({ state: "visible" });
  const cartVisible = await drawer.isVisible();
  await drawer.getByRole("link", { name: /TIẾP TỤC ĐẶT HÀNG/i }).click();
  await page.getByPlaceholder("Tên của bạn").fill("Người Kiểm Thử");
  await page.getByPlaceholder("09...").fill("0912345678");
  await page.getByPlaceholder("Số nhà, đường, phường, quận...").fill("Số 1, phố Thử Nghiệm, Hà Nội");
  await page.getByRole("button", { name: /TẠO NỘI DUNG ĐƠN/i }).click();
  const draft = await page.getByRole("textbox", { name: "Nội dung đơn hàng" }).inputValue();
  console.log(`${viewport.name}: giỏ hàng=${cartVisible}, bản nháp đơn=${draft.includes("Kodak Ultramax 400")}`);
  if (!cartVisible || !draft.includes("Kodak Ultramax 400")) failures++;
  await page.waitForTimeout(600);
  const checkoutAxe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  console.log(`${viewport.name}: lỗi tiếp cận trang đặt hàng=${checkoutAxe.violations.length}`);
  for (const violation of checkoutAxe.violations) console.log(`  ${violation.id}: ${violation.nodes.map((node) => `${node.target.join(' ')} [${node.failureSummary}]`).join('; ')}`);
  failures += checkoutAxe.violations.length;
  await context.close();
}

for (const viewport of [{ width: 1440, height: 900, name: "desktop" }, { width: 390, height: 844, name: "mobile" }]) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(`${baseURL}/product/kodak-ultramax-400`, { waitUntil: "networkidle" });
  const scrollDistance = await page.locator(".product-story").evaluate((element) => element.getBoundingClientRect().height - window.innerHeight);
  const positions = [];
  for (const [index, fraction] of [0, 0.25, 0.5, 0.75, 1].entries()) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), Math.round(scrollDistance * fraction));
    await page.waitForTimeout(100);
    positions.push(await page.evaluate(() => ({ objectX: document.querySelector(".product-story-object").getBoundingClientRect().x, stageY: document.querySelector(".product-story-stage").getBoundingClientRect().y })));
    await page.screenshot({ path: `/private/tmp/soorah-story-${viewport.name}-${index}.png` });
  }
  const moving = positions[1].objectX > positions[0].objectX + 20 && positions[2].objectX < positions[1].objectX - 30 && positions[3].objectX > positions[2].objectX + 30;
  const pinned = positions.slice(1, 4).every((position) => Math.abs(position.stageY) < 2);
  console.log(`${viewport.name}: ảnh cuộn film chuyển động=${moving}, cảnh giữ cố định=${pinned}`);
  if (!moving || !pinned) failures++;
  await page.getByRole("link", { name: /XEM SẢN PHẨM & ĐẶT HÀNG/i }).click();
  await page.waitForFunction(() => Math.abs(document.querySelector("#chi-tiet-san-pham").getBoundingClientRect().top) < 120);
  const reachesDetails = page.url().endsWith("#chi-tiet-san-pham");
  console.log(`${viewport.name}: nút cuối dẫn đến phần đặt hàng=${reachesDetails}`);
  if (!reachesDetails) failures++;
  await context.close();
}

await browser.close();
if (failures) process.exitCode = 1;
