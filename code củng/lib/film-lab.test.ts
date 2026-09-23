import test from "node:test";
import assert from "node:assert/strict";
import { assessShot, evaluateShot, initialShot, scenePresets } from "./film-lab.ts";

test("bright daylight stays lower risk than a dim café", () => {
  const sunny = evaluateShot({ ...initialShot, scene: "sunny", light: 5 });
  const cafe = evaluateShot({ ...initialShot, scene: "cafe", light: 2 });
  assert.equal(sunny.exposureRisk, "low");
  assert.equal(cafe.exposureRisk, "high");
});

test("near flash improves the dim café but does not promise a perfect exposure", () => {
  const before = evaluateShot({ ...initialShot, scene: "cafe", light: 2, distance: 2, flash: "off" });
  const after = evaluateShot({ ...initialShot, scene: "cafe", light: 2, distance: 2, flash: "on" });
  assert.equal(before.exposureRisk, "high");
  assert.equal(after.exposureRisk, "moderate");
  assert.equal(after.flashRisk, "low");
});

test("distant flash cannot rescue a concert stage", () => {
  const result = evaluateShot({ ...initialShot, scene: "concert", light: 1, distance: 20, flash: "on" });
  assert.equal(result.flashRisk, "high");
  assert.equal(result.exposureRisk, "high");
  assert.ok(result.suggestions.some((item) => item.includes("Flash")));
});

test("a moving subject in dim light increases motion risk", () => {
  const still = evaluateShot({ ...initialShot, scene: "night", light: 1, subject: "still" });
  const moving = evaluateShot({ ...initialShot, scene: "night", light: 1, subject: "moving" });
  assert.equal(still.motionRisk, "moderate");
  assert.equal(moving.motionRisk, "high");
});

test("unknown camera and auto flash lower certainty", () => {
  assert.equal(evaluateShot({ ...initialShot, camera: "unknown" }).certainty, "limited");
  assert.equal(evaluateShot({ ...initialShot, flash: "auto" }).certainty, "limited");
});

test("every preset is evaluable and advice remains short", () => {
  for (const preset of scenePresets) {
    const result = evaluateShot({ ...initialShot, scene: preset.id, light: preset.defaultLight });
    assert.ok(result.suggestions.length >= 1 && result.suggestions.length <= 3);
    assert.ok(result.reasons.length >= 1);
  }
});

test("bright daylight is green while dim café is red", () => {
  const sunny = { ...initialShot, scene: "sunny" as const, light: 5 };
  const cafe = { ...initialShot, scene: "cafe" as const, light: 2 };
  assert.equal(assessShot(sunny, evaluateShot(sunny)).overall, "low");
  assert.equal(assessShot(cafe, evaluateShot(cafe)).overall, "high");
});

test("flash off stays neutral and does not make a bright scene risky", () => {
  const shot = { ...initialShot, scene: "sunny" as const, light: 5, flash: "off" as const };
  const assessment = assessShot(shot, evaluateShot(shot));
  assert.equal(assessment.flash.status, "neutral");
  assert.equal(assessment.overall, "low");
});

test("far flash and moving subjects show the specific missing condition", () => {
  const far = { ...initialShot, scene: "concert" as const, light: 1, distance: 20, flash: "on" as const };
  const moving = { ...initialShot, scene: "cafe" as const, light: 2, subject: "moving" as const };
  assert.equal(assessShot(far, evaluateShot(far)).flash.status, "high");
  assert.match(assessShot(far, evaluateShot(far)).flash.finding, /quá xa/i);
  assert.equal(assessShot(moving, evaluateShot(moving)).motion.status, "high");
});
