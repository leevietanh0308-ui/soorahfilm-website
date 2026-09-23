// Sao chép tệp này vào Google Apps Script, rồi thay ID bằng ID của Google Sheet.
const SPREADSHEET_ID = "PASTE_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Đơn hàng";
const STORE_URL = "https://leevietanh0308-ui.github.io/soorahfilm-website/";

// Giữ giá tại đây khớp với data/products.ts trên website.
const PRODUCTS = {
  "ultramax-400-36": { name: "Kodak Ultramax 400", price: 275000 },
};

const HEADERS = [
  "Mã đơn", "Thời gian", "Trạng thái", "Họ tên", "Số điện thoại",
  "Instagram", "Nhận hàng", "Địa chỉ", "Sản phẩm", "Tạm tính (VND)", "Ghi chú",
];

function doPost(e) {
  try {
    const order = parseOrder_(e && e.parameter);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

      const lastRow = sheet.getLastRow();
      const existing = lastRow > 1 && sheet.getRange(2, 1, lastRow - 1, 1)
        .createTextFinder(order.id).matchEntireCell(true).findNext();
      if (!existing) {
        sheet.appendRow([
          order.id, new Date(), "Mới", cellText_(order.name), cellText_(order.phone),
          cellText_(order.instagram), order.method === "delivery" ? "Giao hàng" : "Nhận trực tiếp",
          cellText_(order.address), order.items.map(item => `${item.name} × ${item.quantity}`).join("; "),
          order.total, cellText_(order.note),
        ]);
        SpreadsheetApp.flush();
      }
    } finally {
      lock.releaseLock();
    }
    return resultPage_(true, order.id);
  } catch (error) {
    console.error(error);
    return resultPage_(false, "");
  }
}

function parseOrder_(params) {
  if (!params || params.website) throw new Error("Invalid request");
  const id = String(params.order_id || "");
  const name = String(params.name || "").trim();
  const phone = String(params.phone || "").trim();
  const instagram = String(params.instagram || "").trim();
  const method = String(params.method || "");
  const address = String(params.address || "").trim();
  const note = String(params.note || "").trim();

  if (!/^SOO-[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid order ID");
  if (!name || name.length > 100 || !/^[0-9+().\s-]{9,16}$/.test(phone)) throw new Error("Invalid contact");
  if (instagram.length > 100 || note.length > 1000) throw new Error("Field too long");
  if (method !== "delivery" && method !== "pickup") throw new Error("Invalid method");
  if ((method === "delivery" && (!address || address.length > 300)) || address.length > 300) throw new Error("Invalid address");

  const itemText = String(params.items || "[]");
  if (itemText.length > 4000) throw new Error("Items too long");
  const rawItems = JSON.parse(itemText);
  if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > 10) throw new Error("Invalid items");
  const seenIds = new Set();
  const items = rawItems.map(item => {
    const product = PRODUCTS[item.id];
    if (!product || seenIds.has(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      throw new Error("Invalid product or quantity");
    }
    seenIds.add(item.id);
    return { name: product.name, quantity: item.quantity, price: product.price };
  });

  return {
    id, name, phone, instagram, method, address, note, items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

function cellText_(value) {
  const text = String(value || "");
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function resultPage_(success, id) {
  const heading = success ? "SOORAH đã nhận yêu cầu đặt hàng" : "Chưa thể gửi đơn hàng";
  const message = success
    ? `Mã đơn ${id}. SOORAH sẽ liên hệ để xác nhận hàng, phí giao và cách thanh toán. Chưa cần chuyển tiền.`
    : "Yêu cầu chưa được xác nhận. Vui lòng quay lại website và thử lại hoặc liên hệ SOORAH qua Instagram.";
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${heading}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#11110f;color:#eee9dd;font:16px/1.6 Arial,sans-serif;padding:24px;box-sizing:border-box}main{max-width:560px}small{letter-spacing:.2em;color:#b54635}h1{font-size:clamp(32px,7vw,54px);line-height:1.1;font-weight:400}p{color:#c8c0b3}a{display:inline-block;margin-top:18px;padding:14px 20px;background:#eee9dd;color:#11110f;text-decoration:none}</style></head><body><main><small>SOORAH / ĐƠN HÀNG</small><h1>${heading}</h1><p>${message}</p><a href="${STORE_URL}" target="_top">Về trang SOORAH</a></main></body></html>`;
  return HtmlService.createHtmlOutput(html);
}
