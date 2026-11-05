(function (root) {
  "use strict";
  function measure(pts) {
    var segs = [];
    var total = 0;
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i];
      var b = pts[(i + 1) % pts.length];
      var len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 0.001) len = 0.001;
      segs.push({ ax: a[0], ay: a[1], bx: b[0], by: b[1], len: len, at: total });
      total += len;
    }
    return { pts: pts, segs: segs, total: total };
  }
  function fit(pts, target) {
    var raw = measure(pts);
    var s = target / raw.total;
    var scaled = pts.map(function (p) { return [p[0] * s, p[1] * s]; });
    return measure(scaled);
  }
  function pushPt(pts, x, y) {
    if (!pts.length) {
      pts.push([x, y]);
      return;
    }
    var p = pts[pts.length - 1];
    if (Math.hypot(p[0] - x, p[1] - y) < 3) return;
    pts.push([x, y]);
  }
  function lineTo(pts, x, y) {
    var p = pts[pts.length - 1];
    var d = Math.hypot(x - p[0], y - p[1]);
    var steps = Math.max(1, Math.round(d / 16));
    var i;
    for (i = 1; i <= steps; i++) pushPt(pts, p[0] + (x - p[0]) * i / steps, p[1] + (y - p[1]) * i / steps);
  }
  function arcTo(pts, cx, cy, r, a0, a1) {
    var startX = cx + Math.cos(a0) * r;
    var startY = cy + Math.sin(a0) * r;
    var p = pts[pts.length - 1];
    if (Math.hypot(p[0] - startX, p[1] - startY) > 8) lineTo(pts, startX, startY);
    var steps = Math.max(4, Math.round(Math.abs(a1 - a0) * Math.max(r, 12) / 14));
    var i;
    for (i = 1; i <= steps; i++) {
      var a = a0 + (a1 - a0) * (i / steps);
      pushPt(pts, cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
  }
  function build(cmds) {
    var pts = [];
    var i;
    var c;
    for (i = 0; i < cmds.length; i++) {
      c = cmds[i];
      if (c[0] === "M") pushPt(pts, c[1], c[2]);
      else if (c[0] === "L") lineTo(pts, c[1], c[2]);
      else arcTo(pts, c[1], c[2], c[3], c[4], c[5]);
    }
    var a = pts[0];
    var b = pts[pts.length - 1];
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 14) lineTo(pts, a[0], a[1]);
    if (Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 8) pts.pop();
    return pts;
  }
  var H = -Math.PI / 2;
  var Q = Math.PI / 2;
  var P = Math.PI;
  function mc1() {
    return build([
      ["M", -170, 70], ["L", 100, 70],
      ["A", 100, 30, 40, Q, 0],
      ["L", 140, -40],
      ["A", 100, -40, 40, 0, -Q],
      ["L", -30, -80],
      ["L", -80, -45],
      ["L", -120, -80],
      ["A", -160, -40, 40, -Q, -P],
      ["L", -200, 30],
      ["A", -160, 30, 40, P, P + Q]
    ]);
  }
  function mc2() {
    return build([
      ["M", -180, 40], ["L", -60, 40],
      ["L", -30, 10], ["L", 20, 40], ["L", 90, 40],
      ["A", 90, 0, 40, Q, 0],
      ["L", 130, -50],
      ["A", 90, -50, 40, 0, -Q],
      ["L", -40, -90],
      ["A", -80, -50, 40, -Q, -P],
      ["L", -120, -10],
      ["A", -160, -10, 40, 0, Q],
      ["L", -180, 40]
    ]);
  }
  function mc3() {
    return build([
      ["M", -120, 46], ["L", 50, 46],
      ["A", 50, 12, 34, Q, 0],
      ["L", 84, -30],
      ["A", 50, -30, 34, 0, -Q],
      ["L", -70, -64],
      ["A", -104, -30, 34, -Q, -P],
      ["L", -138, 12],
      ["A", -104, 12, 34, P, P + Q],
      ["L", -120, 46]
    ]);
  }
  function mc4() {
    return build([
      ["M", -210, 24], ["L", -50, 24],
      ["L", -16, -6], ["L", 24, 24], ["L", 130, 24],
      ["A", 130, -16, 40, Q, 0],
      ["L", 170, -70],
      ["A", 130, -70, 40, 0, -Q],
      ["L", -70, -110],
      ["A", -110, -70, 40, -Q, -P],
      ["L", -150, -16],
      ["A", -190, -16, 40, 0, Q],
      ["L", -210, 24]
    ]);
  }
  function chicaneCircuit() {
    return build([
      ["M", -180, 64], ["L", -50, 64],
      ["L", -16, 34], ["L", 24, 64],
      ["L", 60, 34], ["L", 100, 64],
      ["A", 100, 24, 40, Q, 0],
      ["L", 140, -36],
      ["A", 100, -36, 40, 0, -Q],
      ["L", -120, -76],
      ["A", -160, -36, 40, -Q, -P],
      ["L", -200, 24],
      ["A", -160, 24, 40, P, P + Q]
    ]);
  }
  function dp1() {
    return build([
      ["M", -180, 60], ["L", 110, 60],
      ["A", 110, 20, 40, Q, 0],
      ["L", 150, -50],
      ["A", 110, -50, 40, 0, -Q],
      ["L", -140, -90],
      ["A", -180, -50, 40, -Q, -P],
      ["L", -220, 20],
      ["A", -180, 20, 40, P, P + Q]
    ]);
  }
  function dp2() {
    return build([
      ["M", -170, 40], ["L", 70, 40],
      ["A", 70, 0, 40, Q, -Q],
      ["L", 20, -40],
      ["A", -20, -40, 40, 0, P],
      ["L", -130, -40],
      ["A", -170, 0, 40, -Q, -P],
      ["L", -170, 40]
    ]);
  }
  function dp3() {
    return build([
      ["M", -170, 36], ["L", -30, 36],
      ["L", 10, 70], ["L", 50, 36], ["L", 110, 36],
      ["A", 110, -4, 40, Q, 0],
      ["L", 150, -60],
      ["A", 110, -60, 40, 0, -Q],
      ["L", -130, -100],
      ["A", -170, -60, 40, -Q, -P],
      ["L", -210, -4],
      ["A", -170, -4, 40, P, P + Q]
    ]);
  }
  function choco() {
    return build([
      ["M", -30, -110], ["L", 80, -110],
      ["A", 80, -74, 36, H, Q],
      ["L", -70, -38],
      ["A", -70, -2, 36, H, H - P],
      ["L", 70, 34],
      ["A", 70, 70, 36, H, Q],
      ["L", -80, 106],
      ["A", -116, 70, 36, 0, P],
      ["L", -116, -74],
      ["A", -80, -74, 36, P, P + Q]
    ]);
  }
  function beach() {
    return build([
      ["M", -190, 20], ["L", 60, 20],
      ["A", 60, 80, 70, H, Q],
      ["L", -140, 150],
      ["A", -190, 90, 50, Q, Q + P],
      ["L", -190, 20]
    ]);
  }
  function gv1() {
    return build([
      ["M", -160, -70], ["L", 160, -70],
      ["A", 160, -40, 22, H, 0],
      ["L", 182, 70],
      ["A", 160, 70, 22, 0, Q],
      ["L", -160, 92],
      ["A", -160, 70, 22, Q, P],
      ["L", -182, -40],
      ["A", -160, -40, 22, P, P + Q]
    ]);
  }
  function gv2() {
    return build([
      ["M", -140, -80], ["L", 40, -80],
      ["L", 40, -40], ["L", 120, -40],
      ["A", 120, -8, 22, H, 0],
      ["L", 142, 70],
      ["A", 120, 70, 22, 0, Q],
      ["L", -140, 92],
      ["A", -140, 70, 22, Q, P],
      ["L", -162, -48],
      ["A", -140, -48, 22, P, P + Q]
    ]);
  }
  function gv3() {
    return build([
      ["M", -150, -50], ["L", -20, -50],
      ["L", -20, -96], ["L", 80, -96],
      ["A", 80, -66, 22, H, 0],
      ["L", 102, 10],
      ["L", 46, 10], ["L", 46, 60],
      ["A", 24, 60, 22, 0, Q],
      ["L", -130, 82],
      ["A", -150, 60, 22, Q, P],
      ["L", -172, -20],
      ["A", -150, -20, 22, P, P + Q]
    ]);
  }
  function vanilla() {
    return build([
      ["M", -180, 16], ["L", -40, 16],
      ["L", 0, -12], ["L", 60, 16], ["L", 150, 16],
      ["A", 150, 60, 48, H, Q],
      ["L", 40, 108],
      ["L", 0, 78], ["L", -40, 108], ["L", -140, 108],
      ["A", -180, 64, 44, Q, Q + P]
    ]);
  }
  function bc1() {
    return build([
      ["M", -90, 46], ["L", 80, 46],
      ["A", 80, 12, 28, Q, 0],
      ["L", 108, -46],
      ["A", 80, -46, 28, 0, -Q],
      ["L", 16, -74],
      ["L", 16, -34], ["L", -16, -34], ["L", -16, -74],
      ["L", -70, -74],
      ["A", -90, -46, 28, -Q, -P],
      ["L", -118, 12],
      ["A", -90, 12, 28, P, P + Q]
    ]);
  }
  function bc2() {
    return build([
      ["M", -180, -46], ["L", -16, -46],
      ["A", -16, -18, 22, H, 0],
      ["L", 6, 36],
      ["A", -16, 36, 22, 0, Q],
      ["L", -86, 58],
      ["A", -86, 86, 22, H, P],
      ["L", -150, 64],
      ["A", -150, 96, 22, Q, 0],
      ["L", -128, 146],
      ["A", -150, 146, 22, 0, P],
      ["L", -202, 124],
      ["A", -202, 36, 22, Q, P + Q]
    ]);
  }
  function bc3() {
    return build([
      ["M", -150, 20], ["L", -40, 20],
      ["L", -40, -40], ["L", 30, -40],
      ["A", 30, -8, 24, H, 0],
      ["L", 54, 40],
      ["A", 30, 40, 24, 0, Q],
      ["L", -80, 64],
      ["A", -80, 40, 24, Q, P],
      ["L", -104, -10],
      ["A", -80, -10, 24, P, P + Q],
      ["L", -150, 20]
    ]);
  }
  function rainbowRoad() {
    return build([
      ["M", -36, -150], ["L", 90, -150],
      ["A", 90, -114, 36, H, Q],
      ["L", -80, -78],
      ["A", -80, -42, 36, H, H - P],
      ["L", 80, -6],
      ["A", 80, 30, 36, H, Q],
      ["L", -70, 66],
      ["A", -70, 102, 36, H, Q],
      ["L", -120, 138],
      ["A", -156, 70, 40, Q, P],
      ["L", -156, -114],
      ["A", -120, -114, 36, P, P + Q]
    ]);
  }
  function choco2() {
    return build([
      ["M", -20, -90], ["L", 60, -90],
      ["A", 60, -62, 24, H, Q],
      ["L", -50, -38],
      ["A", -50, -14, 24, H, H - P],
      ["L", 50, 10],
      ["A", 50, 34, 24, H, Q],
      ["L", -40, 58],
      ["A", -64, 34, 24, 0, P],
      ["L", -64, -62],
      ["A", -40, -62, 24, P, P + Q]
    ]);
  }
  function battle1() {
    return build([
      ["M", -80, -50], ["L", 70, -50],
      ["A", 70, -26, 18, H, 0],
      ["L", 88, 14], ["L", 44, 14], ["L", 44, 46],
      ["A", 26, 46, 18, 0, Q],
      ["L", -70, 64],
      ["A", -80, 46, 18, Q, P],
      ["L", -98, -26],
      ["A", -80, -26, 18, P, P + Q]
    ]);
  }
  function battle2() {
    return build([
      ["M", -90, -20], ["L", 70, -20],
      ["A", 70, 20, 40, H, Q],
      ["L", -50, 60],
      ["A", -90, 20, 40, Q, Q + P]
    ]);
  }
  function battle3() {
    return build([
      ["M", -70, -30], ["L", 50, -30],
      ["A", 50, 0, 24, H, Q],
      ["L", -46, 24],
      ["A", -70, -6, 24, Q, P + Q]
    ]);
  }
  function battle4() {
    return build([
      ["M", -36, -56], ["L", 40, -56],
      ["A", 40, -32, 16, H, 0],
      ["L", 56, 8],
      ["A", 40, 8, 16, 0, Q],
      ["L", 4, 24],
      ["A", 4, 40, 16, H, P],
      ["L", -28, 24],
      ["A", -44, 8, 16, Q, P],
      ["L", -44, -32]
    ]);
  }
  var THEME = {
    circuit: { id: "circuit", road: "#2a3824", alt: "#3c5234", edge: "#d6ff6a", shoulder: "#1a2814", ground: "#24341c", groundAlt: "#1a2a16", sky0: "#070c10", sky1: "#1a3040", prop: "rack" },
    plain: { id: "plain", road: "#4a4328", alt: "#6a5a30", edge: "#e6d38a", shoulder: "#3a3018", ground: "#4a3c22", groundAlt: "#2e2616", sky0: "#1a140e", sky1: "#6a5830", prop: "plant" },
    ghost: { id: "ghost", road: "#241838", alt: "#321e50", edge: "#c4b4ff", shoulder: "#140e22", ground: "#1c1430", groundAlt: "#120c20", sky0: "#07060e", sky1: "#2a1848", prop: "bar" },
    castle: { id: "castle", road: "#3a342c", alt: "#4e4338", edge: "#e0b070", shoulder: "#2a241c", ground: "#3a3228", groundAlt: "#241e18", sky0: "#14100c", sky1: "#4a3828", prop: "rack" },
    rainbow: { id: "rainbow", road: "#241828", alt: "#3a1848", edge: "#ff6ad5", shoulder: "#140818", ground: "#1c1028", groundAlt: "#120818", sky0: "#0c0618", sky1: "#402050", prop: "post", rainbow: true }
  };
  function look(base, patch) {
    var src = THEME[base] || THEME.circuit;
    var out = {};
    var k;
    for (k in src) out[k] = src[k];
    out.art = base;
    out.surface = base === "plain" ? "grass" : base === "ghost" ? "abyss" : base === "castle" ? "lava" : base === "rainbow" ? "abyss" : "sand";
    if (patch) for (k in patch) out[k] = patch[k];
    return out;
  }
  function course(spec) {
    var built = fit(spec.pts, spec.len || 2100);
    built.id = spec.id;
    built.name = spec.name;
    built.cup = spec.cup;
    built.theme = spec.look || THEME[spec.theme];
    built.half = spec.half == null ? 1 : spec.half;
    built.oils = spec.oils || [];
    built.pipes = spec.pipes || [];
    built.jumps = spec.jumps || [];
    built.battle = !!spec.battle;
    built.off = spec.off == null ? 1 : spec.off;
    return built;
  }
  var list = [
    course({ id: "aisle-circuit", name: "Aisle Circuit", cup: "green", look: look("circuit", { sky0: "#071018", sky1: "#1a4a38", road: "#2a2e28", edge: "#d6ff6a", ground: "#14301c", hue: 100, surface: "sand" }), pts: mc1(), oils: [0.62] }),
    course({ id: "oil-plain", name: "Oil Plain", cup: "green", look: look("plain", { sky0: "#1a140c", sky1: "#e0a050", road: "#6a5a32", edge: "#f0e0a0", ground: "#3d6b28", skyWash: "rgba(80,140,40,0.28)", roadWash: "rgba(90,120,40,0.35)", hue: 90, surface: "grass" }), pts: dp1(), half: 1.18, off: 0.7, oils: [0.12, 0.46, 0.81], jumps: [0.42] }),
    course({ id: "dark-valley", name: "Dark Valley", cup: "green", look: look("ghost", { sky0: "#06040c", sky1: "#2a1458", road: "#1a1028", edge: "#c4b4ff", ground: "#12081c", hue: 270, surface: "abyss" }), pts: gv1(), half: 0.72, off: 1.7 }),
    course({ id: "stone-keep", name: "Stone Keep", cup: "green", look: look("castle", { sky0: "#140c08", sky1: "#8a3018", road: "#3a3228", edge: "#e0b070", ground: "#5a2010", skyWash: "rgba(180,50,10,0.22)", hue: 16, surface: "lava" }), pts: bc1(), pipes: [0.12, 0.37, 0.62, 0.86], half: 0.9 }),
    course({ id: "fan-flats", name: "Fan Flats", cup: "green", look: look("plain", { art: "beach", sky0: "#1a2848", sky1: "#f0b060", road: "#d7c48a", edge: "#fff2c4", ground: "#c4a15a", skyWash: "rgba(240,170,60,0.4)", roadWash: "rgba(210,180,90,0.45)", hue: 42, surface: "shallows" }), pts: beach(), len: 2600, half: 1.05 }),
    course({ id: "dock-hairpin", name: "Dock Hairpin", cup: "floor", look: look("circuit", { sky0: "#100818", sky1: "#c45a28", road: "#3a3028", edge: "#ffb060", ground: "#3a2010", skyWash: "rgba(180,70,20,0.3)", hue: 24, surface: "sand" }), pts: mc2(), half: 0.92, pipes: [0.18] }),
    course({ id: "cable-field", name: "Cable Field", cup: "floor", look: look("plain", { sky0: "#102018", sky1: "#8fd0a0", road: "#4a6840", edge: "#e8ffc0", ground: "#2f7a38", skyWash: "rgba(40,120,60,0.32)", roadWash: "rgba(40,90,30,0.3)", hue: 120, surface: "grass" }), pts: dp2(), half: 1.12, oils: [0.22, 0.58], len: 2600 }),
    course({ id: "hollow-bend", name: "Hollow Bend", cup: "floor", look: look("ghost", { sky0: "#040810", sky1: "#2060a0", road: "#142028", edge: "#b8e4ff", ground: "#0c1820", skyWash: "rgba(20,60,120,0.35)", hue: 200, surface: "abyss" }), pts: gv2(), half: 0.7, off: 1.6, oils: [0.48] }),
    course({ id: "gatehouse", name: "Gatehouse", cup: "floor", look: look("castle", { sky0: "#0c0c10", sky1: "#606070", road: "#4a4a46", edge: "#f0e6c8", ground: "#2a2418", skyWash: "rgba(40,40,50,0.25)", hue: 30, surface: "lava" }), pts: bc2(), jumps: [0.22, 0.68], pipes: [0.45] }),
    course({ id: "spillway", name: "Spillway", cup: "floor", look: look("plain", { art: "choco", sky0: "#1a0c08", sky1: "#a06030", road: "#5a3820", edge: "#e8c090", ground: "#6b3a1f", skyWash: "rgba(120,60,20,0.45)", roadWash: "rgba(90,40,16,0.5)", hue: 22, surface: "mud" }), pts: choco(), half: 0.9, oils: [0.2, 0.72], pipes: [0.55] }),
    course({ id: "rack-oval", name: "Rack Oval", cup: "ghost", look: look("circuit", { sky0: "#060810", sky1: "#103050", road: "#243040", edge: "#9fd0ff", ground: "#102018", skyWash: "rgba(10,30,70,0.35)", hue: 210, surface: "sand" }), pts: mc3(), len: 2400 }),
    course({ id: "loading-yard", name: "Loading Yard", cup: "ghost", look: look("plain", { sky0: "#20100c", sky1: "#ff8840", road: "#8a6840", edge: "#ffe0b0", ground: "#c46830", skyWash: "rgba(220,100,30,0.38)", roadWash: "rgba(160,80,20,0.28)", hue: 28, surface: "grass" }), pts: dp3(), oils: [0.15, 0.55], jumps: [0.35] }),
    course({ id: "night-bus", name: "Night Bus", cup: "ghost", look: look("ghost", { sky0: "#020208", sky1: "#180828", road: "#100818", edge: "#e0b0ff", ground: "#080410", skyWash: "rgba(40,0,60,0.35)", hue: 290, surface: "abyss" }), pts: gv3(), half: 0.68, off: 1.8, len: 2300 }),
    course({ id: "heat-castle", name: "Heat Castle", cup: "ghost", look: look("castle", { sky0: "#1a0804", sky1: "#ff5010", road: "#4a2818", edge: "#ffd0a0", ground: "#c2410c", skyWash: "rgba(255,60,0,0.32)", roadWash: "rgba(180,40,0,0.28)", hue: 12, surface: "lava" }), pts: bc2().map(function (p) { return [p[0], -p[1]]; }), pipes: [0.2, 0.58], oils: [0.4, 0.78], jumps: [0.9] }),
    course({ id: "fog-gate", name: "Fog Gate", cup: "ghost", look: look("plain", { art: "ice", sky0: "#c5d8e8", sky1: "#f4fbff", road: "#d5e7f2", edge: "#ffffff", ground: "#e8f4ff", skyWash: "rgba(220,240,255,0.55)", roadWash: "rgba(200,230,255,0.4)", hue: 190, surface: "ice" }), pts: vanilla(), half: 0.7, off: 1.5, pipes: [0.4] }),
    course({ id: "switchback", name: "Switchback", cup: "core", look: look("circuit", { sky0: "#0c1014", sky1: "#4a6070", road: "#32383a", edge: "#d0d8e0", ground: "#1c2420", skyWash: "rgba(80,90,100,0.3)", hue: 180, surface: "sand" }), pts: mc4(), half: 0.88 }),
    course({ id: "pit-chicane", name: "Pit Chicane", cup: "core", look: look("plain", { art: "choco", sky0: "#14100c", sky1: "#8a7040", road: "#6a5840", edge: "#f0d8a0", ground: "#4a3820", skyWash: "rgba(140,100,40,0.35)", roadWash: "rgba(100,70,30,0.35)", hue: 36, surface: "sand" }), pts: chicaneCircuit(), pipes: [0.33, 0.7], oils: [0.5] }),
    course({ id: "void-loop", name: "Void Loop", cup: "core", look: look("ghost", { sky0: "#000000", sky1: "#101018", road: "#0c0c12", edge: "#88ffd0", ground: "#050508", skyWash: "rgba(0,0,0,0.45)", hue: 160, surface: "abyss" }), pts: choco2(), half: 0.66, off: 1.9, len: 1800 }),
    course({ id: "core-spiral", name: "Core Spiral", cup: "core", look: look("castle", { sky0: "#100818", sky1: "#7030a0", road: "#2a2030", edge: "#f0c0ff", ground: "#201018", skyWash: "rgba(80,20,100,0.35)", hue: 300, surface: "lava" }), pts: battle1().map(function (p) { return [-p[0], p[1]]; }), half: 0.84, jumps: [0.3], oils: [0.66] }),
    course({ id: "rainbow-bus", name: "Rainbow Bus", cup: "core", look: look("rainbow", { sky0: "#140818", sky1: "#ff40c0", road: "#2a1030", edge: "#ffe56a", ground: "#401030", hue: 320, surface: "abyss" }), pts: rainbowRoad(), len: 3200, half: 0.78, off: 1.85, jumps: [0.18, 0.42, 0.66, 0.88] }),
    course({ id: "bay-pit", name: "Bay Pit", cup: "battle", look: look("plain", { art: "beach", sky0: "#16324a", sky1: "#7ec8e0", road: "#c4b48a", edge: "#fff6d0", ground: "#2a6a78", skyWash: "rgba(40,140,180,0.35)", hue: 190, surface: "shallows" }), pts: battle1(), len: 980, battle: true, pipes: [0.25, 0.75], half: 0.95 }),
    course({ id: "cage", name: "Cage", cup: "battle", look: look("castle", { sky0: "#100808", sky1: "#a02818", road: "#3a2820", edge: "#ffb080", ground: "#6a2010", hue: 14, surface: "lava" }), pts: battle4(), len: 900, battle: true, pipes: [0.15, 0.5, 0.8], half: 0.88 }),
    course({ id: "vault", name: "Vault", cup: "battle", look: look("ghost", { sky0: "#08060e", sky1: "#3a2060", road: "#1a1428", edge: "#d0c0ff", ground: "#100818", hue: 270, surface: "abyss" }), pts: battle3(), len: 1000, battle: true, oils: [0.33, 0.66], half: 0.9 }),
    course({ id: "the-well", name: "The Well", cup: "battle", look: look("rainbow", { sky0: "#180818", sky1: "#40e0ff", road: "#201830", edge: "#ffe56a", ground: "#301040", hue: 180, surface: "abyss" }), pts: battle2(), len: 960, battle: true, jumps: [0.5], half: 0.86 })
  ];
  function pointOn(track, dist) {
    var total = track.total;
    dist = ((dist % total) + total) % total;
    var segs = track.segs;
    var i = 0;
    while (i < segs.length - 1 && segs[i].at + segs[i].len < dist) i++;
    var s = segs[i];
    var u = (dist - s.at) / s.len;
    if (u < 0) u = 0;
    if (u > 1) u = 1;
    return {
      x: s.ax + (s.bx - s.ax) * u,
      y: s.ay + (s.by - s.ay) * u
    };
  }
  function heading(track, dist) {
    var a = pointOn(track, dist);
    var b = pointOn(track, dist + 18);
    return Math.atan2(b.y - a.y, b.x - a.x);
  }
  function bend(track, dist, look) {
    var d = heading(track, dist + (look || 42)) - heading(track, dist);
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }
  root.NVDA_TRACKS = list;
  root.NVDA_CUPS = [
    { id: "green", name: "Green Cup" },
    { id: "floor", name: "Floor Cup" },
    { id: "ghost", name: "Ghost Cup" },
    { id: "core", name: "Core Cup" }
  ];
  root.nvdaTrack = function (id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  };
  root.nvdaCupTracks = function (cup) {
    return list.filter(function (t) { return t.cup === cup && !t.battle; });
  };
  root.nvdaPoint = pointOn;
  root.nvdaHead = heading;
  root.nvdaBend = bend;
})(typeof window !== "undefined" ? window : this);
