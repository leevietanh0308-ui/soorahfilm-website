import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const rows = [];
const sheet = {
  getLastRow: () => rows.length,
  appendRow: (row) => { rows.push(row); },
  getRange: () => ({
    createTextFinder: (id) => ({
      matchEntireCell() { return this; },
      findNext: () => rows.some((row) => row[0] === id) ? {} : null,
    }),
  }),
};
const context = {
  console: { error() {} },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  SpreadsheetApp: {
    openById: () => ({ getSheetByName: () => sheet, insertSheet: () => sheet }),
    flush() {},
  },
  HtmlService: { createHtmlOutput: (html) => html },
};
vm.createContext(context);
vm.runInContext(readFileSync(new URL("../integrations/google-sheets/Code.gs", import.meta.url), "utf8"), context);

const order = {
  order_id: "SOO-123e4567-e89b-12d3-a456-426614174000",
  name: "=IMPORTXML(\"https://example.com\")",
  phone: "0912345678",
  instagram: "@khach",
  method: "delivery",
  address: "+Số 1, Hà Nội",
  note: "Gọi trước khi giao",
  total: "1",
  items: JSON.stringify([{ id: "ultramax-400-36", quantity: 2 }]),
};

assert.match(context.doPost({ parameter: order }), /SOORAH đã nhận yêu cầu/);
assert.equal(rows.length, 2);
assert.equal(rows[1][0], order.order_id);
assert.equal(rows[1][3], "'" + order.name);
assert.equal(rows[1][7], "'" + order.address);
assert.equal(rows[1][9], 550000);

assert.match(context.doPost({ parameter: order }), /SOORAH đã nhận yêu cầu/);
assert.equal(rows.length, 2, "gửi lại cùng mã không được tạo đơn trùng");

assert.match(context.doPost({ parameter: { ...order, order_id: "SOO-123e4567-e89b-12d3-a456-426614174001", items: JSON.stringify([{ id: "other", quantity: 1 }]) } }), /Chưa thể gửi/);
assert.equal(rows.length, 2, "sản phẩm không hợp lệ không được ghi vào Sheet");

assert.match(context.doPost({ parameter: { ...order, order_id: "SOO-123e4567-e89b-12d3-a456-426614174002", items: JSON.stringify([{ id: "ultramax-400-36", quantity: 1 }, { id: "ultramax-400-36", quantity: 1 }]) } }), /Chưa thể gửi/);
assert.equal(rows.length, 2, "mặt hàng trùng không được ghi vào Sheet");

console.log("Google Sheets order validation passed");
