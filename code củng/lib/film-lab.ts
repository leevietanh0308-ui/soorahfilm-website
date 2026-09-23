export type CameraType = "auto" | "manual" | "disposable" | "unknown";
export type FlashMode = "off" | "auto" | "on";
export type SubjectMotion = "still" | "moving";
export type RiskBand = "low" | "moderate" | "high";
export type SignalStatus = RiskBand | "neutral";

export const scenePresets = [
  { id: "sunny", label: "Ngoài trời nắng", short: "NẮNG", defaultLight: 5, note: "Ánh sáng mạnh, bóng đổ rõ." },
  { id: "cloudy", label: "Ngoài trời nhiều mây", short: "NHIỀU MÂY", defaultLight: 4, note: "Ánh sáng mềm và đều hơn." },
  { id: "golden", label: "Cuối chiều", short: "CHIỀU MUỘN", defaultLight: 3, note: "Ánh sáng thay đổi nhanh." },
  { id: "shade", label: "Trong bóng râm", short: "BÓNG RÂM", defaultLight: 3, note: "Chủ thể nhận ít sáng hơn nền trời." },
  { id: "window", label: "Trong nhà gần cửa sổ", short: "CỬA SỔ", defaultLight: 3, note: "Chất lượng sáng phụ thuộc vị trí đứng." },
  { id: "cafe", label: "Quán cà phê", short: "QUÁN CÀ PHÊ", defaultLight: 2, note: "Mắt có thể thấy sáng hơn film cảm nhận." },
  { id: "night", label: "Đường phố ban đêm", short: "BAN ĐÊM", defaultLight: 1, note: "Đèn phố thường chỉ sáng ở vài vùng." },
  { id: "party", label: "Tiệc trong nhà", short: "BUỔI TIỆC", defaultLight: 2, note: "Ánh sáng yếu và mọi người hay di chuyển." },
  { id: "concert", label: "Sân khấu / concert", short: "SÂN KHẤU", defaultLight: 1, note: "Chủ thể thường xa và ánh sáng đổi liên tục." },
  { id: "backlit", label: "Chụp ngược sáng", short: "NGƯỢC SÁNG", defaultLight: 4, note: "Nền có thể sáng hơn gương mặt." },
] as const;

export type SceneId = (typeof scenePresets)[number]["id"];

export type ShotInput = {
  camera: CameraType;
  scene: SceneId;
  light: number;
  subject: SubjectMotion;
  distance: number;
  flash: FlashMode;
};

export type ShotResult = {
  exposureRisk: RiskBand;
  motionRisk: RiskBand;
  flashRisk: RiskBand | "not-used";
  certainty: "contextual" | "limited";
  headline: string;
  description: string;
  reasons: string[];
  suggestions: string[];
  previewTone: "balanced" | "dim" | "dark";
  flashReach: "near" | "far" | "unknown" | "off";
};

export type ShotSignal = { status: SignalStatus; finding: string };
export type ShotAssessment = {
  overall: RiskBand;
  exposure: ShotSignal;
  motion: ShotSignal;
  flash: ShotSignal;
  primaryFinding: string;
};

export const initialShot: ShotInput = {
  camera: "unknown",
  scene: "cafe",
  light: 2,
  subject: "still",
  distance: 2,
  flash: "off",
};

export function evaluateShot(input: ShotInput): ShotResult {
  const light = Math.max(1, Math.min(5, Math.round(input.light)));
  const nearFlash = input.flash === "on" && input.distance <= 3;
  const farFlash = input.flash === "on" && input.distance > 3;
  const flashReach = input.flash === "off" ? "off" : input.flash === "auto" ? "unknown" : nearFlash ? "near" : "far";
  const flashRisk: ShotResult["flashRisk"] = input.flash === "off" ? "not-used" : input.flash === "auto" ? "moderate" : farFlash ? "high" : "low";

  let exposureRisk: RiskBand = light <= 2 ? "high" : light === 3 ? "moderate" : "low";
  if (nearFlash && exposureRisk === "high") exposureRisk = "moderate";
  if (input.scene === "backlit" && !nearFlash && exposureRisk === "low") exposureRisk = "moderate";

  let motionRisk: RiskBand = "low";
  if (input.subject === "moving") motionRisk = light <= 2 && !nearFlash ? "high" : light <= 3 ? "moderate" : "low";
  else if (light <= 2 && !nearFlash) motionRisk = "moderate";

  const certainty = input.camera === "unknown" || input.flash === "auto" ? "limited" : "contextual";
  const reasons: string[] = [];
  const suggestions: string[] = [];

  if (light <= 2) reasons.push("Ánh sáng yếu khiến film ISO 400 và máy cần nhiều ánh sáng hơn để ghi lại chi tiết.");
  else if (light === 3) reasons.push("Ánh sáng ở mức vừa; một thay đổi nhỏ của thời tiết hoặc vị trí có thể ảnh hưởng kết quả.");
  else reasons.push("Ánh sáng hiện khá dồi dào cho một cú chụp đời thường với film ISO 400.");

  if (input.scene === "backlit") {
    reasons.push("Nền sáng phía sau có thể khiến chủ thể tối hơn mong đợi, nhất là khi máy tự đo sáng.");
    if (!nearFlash) suggestions.push("Đổi góc để ánh sáng chiếu lên mặt chủ thể, hoặc chuyển họ ra khỏi nền quá sáng.");
  }
  if (farFlash) {
    reasons.push("Flash nhỏ trên máy thường chỉ hữu ích ở khoảng cách gần; bật flash không làm sáng sân khấu hay cảnh ở xa.");
    suggestions.push("Flash khó giúp khi chủ thể ở xa. Tìm vùng sáng sẵn có hoặc tiến gần hơn nếu được phép.");
  } else if (nearFlash && light <= 3) {
    reasons.push("Flash có thể giúp chủ thể ở gần sáng hơn, nhưng hậu cảnh vẫn có thể tối.");
  } else if (input.flash === "auto") {
    reasons.push("Flash AUTO có thể bật hoặc không; kết quả phụ thuộc cách máy đo sáng.");
  }

  if (exposureRisk === "high") {
    suggestions.push("Đưa chủ thể đến gần cửa sổ, đèn sáng hoặc ra nơi có nhiều ánh sáng hơn.");
    if (input.flash === "off" && input.distance <= 3) suggestions.push("Nếu máy có flash, thử bật flash khi chủ thể ở gần.");
  } else if (exposureRisk === "moderate" && light <= 3 && !nearFlash) {
    suggestions.push("Tìm thêm ánh sáng trước khi bấm; chỉ một bước gần nguồn sáng cũng có thể giúp ích.");
  }

  if (motionRisk === "high") suggestions.push("Chờ chủ thể đứng yên hoặc chụp ở nơi sáng hơn để giảm nguy cơ nhòe.");
  else if (motionRisk === "moderate") suggestions.push("Giữ máy thật vững và nhắc chủ thể đứng yên trong lúc chụp.");

  if (input.camera === "unknown") {
    reasons.push("Chưa biết khả năng đo sáng và tốc độ màn trập của máy, nên đây chỉ là đánh giá theo tình huống.");
    if (suggestions.length < 3) suggestions.push("Kiểm tra máy có flash và dùng film 35mm trước khi chụp.");
  } else if (input.camera === "manual") {
    reasons.push("Máy chỉnh tay còn phụ thuộc khẩu độ và tốc độ bạn chọn; Film Lab chưa nhận hai thông số này.");
  } else if (input.camera === "disposable") {
    reasons.push("Máy dùng một lần có ít khả năng điều chỉnh; ánh sáng và khoảng cách là hai điều quan trọng nhất bạn có thể thay đổi.");
  }

  if (suggestions.length === 0) suggestions.push("Giữ chủ thể trong vùng sáng và kiểm tra lại khung hình trước khi bấm.");

  const headline = exposureRisk === "high" ? "Hãy tìm thêm ánh sáng." : motionRisk === "high" ? "Chú ý chuyển động." : exposureRisk === "moderate" ? "Có thể chụp, hãy để ý ánh sáng." : "Điều kiện có vẻ thuận lợi.";
  const description = exposureRisk === "high" ? "Ảnh có nguy cơ tối và mất chi tiết. Một thay đổi nhỏ trước khi chụp thường đáng giá hơn một tấm film bị bỏ phí." : exposureRisk === "moderate" ? "Kết quả có thể dùng được, nhưng còn tùy máy và cách đo sáng. Hãy thử một gợi ý bên dưới." : "Rủi ro ánh sáng ở mức thấp theo những gì bạn đã chọn. Ảnh thật vẫn phụ thuộc máy và quá trình tráng, quét.";

  return {
    exposureRisk,
    motionRisk,
    flashRisk,
    certainty,
    headline,
    description,
    reasons,
    suggestions: suggestions.slice(0, 3),
    previewTone: exposureRisk === "high" ? "dark" : exposureRisk === "moderate" ? "dim" : "balanced",
    flashReach,
  };
}

export function assessShot(input: ShotInput, result: ShotResult): ShotAssessment {
  const exposure: ShotSignal = {
    status: result.exposureRisk,
    finding: result.exposureRisk === "high" ? "Thiếu sáng: đưa chủ thể gần nguồn sáng hơn." : result.exposureRisk === "moderate" ? "Ánh sáng vừa đủ; tìm vị trí sáng hơn nếu có thể." : "Ánh sáng có vẻ thuận lợi trong tình huống này.",
  };
  const motion: ShotSignal = {
    status: result.motionRisk,
    finding: result.motionRisk === "high" ? "Dễ nhòe: chờ chủ thể đứng yên hoặc thêm sáng." : result.motionRisk === "moderate" ? "Giữ máy vững và hạn chế chuyển động." : "Nguy cơ nhòe hiện ở mức thấp.",
  };
  const flash: ShotSignal = input.flash === "off"
    ? { status: "neutral", finding: "Flash đang tắt; không đánh giá hiệu quả flash." }
    : input.flash === "auto"
      ? { status: "moderate", finding: "Flash AUTO chưa chắc bật khi cần." }
      : result.flashRisk === "high"
        ? { status: "high", finding: "Chủ thể quá xa; flash nhỏ khó chiếu tới." }
        : { status: "low", finding: "Flash gần có thể giúp sáng chủ thể." };

  const active = [exposure, motion, flash].filter((signal) => signal.status !== "neutral");
  const overall: RiskBand = active.some((signal) => signal.status === "high") ? "high" : active.some((signal) => signal.status === "moderate") ? "moderate" : "low";
  const primaryFinding = active.find((signal) => signal.status === overall)?.finding || exposure.finding;
  return { overall, exposure, motion, flash, primaryFinding };
}
