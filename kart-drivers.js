(function (root) {
  "use strict";
  var V = "v=10";
  function face(file) { return file + "?" + V; }
  function kart(file) { return "game-art/" + file + "?" + V; }
  root.NVDA_DRIVERS = [
    { id: "nvda", name: "NVDA", hue: 0, face: face("game-art/roster/nvda.jpg"), facePos: "center 0%", sprite: kart("kart-behind.png"), top: 17.2, accel: 20, grip: 1.15, weight: 0.5, blurb: "Even speed. The green kart." },
    { id: "btc", name: "BTC", hue: 0, face: face("game-art/roster/btc.jpg"), sprite: kart("kart-btc.png"), top: 19.2, accel: 15, grip: 1.02, weight: 0.88, blurb: "Heavy. Holds a hit." },
    { id: "eth", name: "ETH", hue: 0, face: face("game-art/roster/eth.jpg"), sprite: kart("kart-eth.png"), top: 17.6, accel: 21, grip: 1.22, weight: 0.48, blurb: "Quick hands." },
    { id: "bnb", name: "BNB", hue: 0, face: face("game-art/roster/bnb.jpg"), sprite: kart("kart-bnb.png"), top: 16.4, accel: 26, grip: 1.18, weight: 0.36, blurb: "Leaves the line first." },
    { id: "base", name: "BASE", hue: 0, face: face("game-art/roster/base.jpg"), sprite: kart("kart-base.png"), top: 17.0, accel: 22, grip: 1.2, weight: 0.42, blurb: "Light and even." },
    { id: "xrp", name: "XRP", hue: 0, face: face("game-art/roster/xrp.jpg"), sprite: kart("kart-xrp.png"), top: 16.8, accel: 21, grip: 1.42, weight: 0.4, blurb: "Turns harder than the others." },
    { id: "doge", name: "DOGE", hue: 0, face: face("game-art/roster/doge.jpg"), sprite: kart("kart-doge.png"), top: 18.4, accel: 18, grip: 1.08, weight: 0.62, blurb: "Long gear." },
    { id: "ton", name: "TON", hue: 0, face: face("game-art/roster/ton.jpg"), sprite: kart("kart-ton.png"), top: 15.8, accel: 28, grip: 1.26, weight: 0.24, blurb: "Light. A bump costs a coin." },
    { id: "gld", name: "GLD", hue: 0, face: face("game-art/roster/gld.jpg"), sprite: kart("kart-gld.png"), top: 18.8, accel: 16, grip: 1.05, weight: 0.8, blurb: "Shrugs a hit." },
    { id: "sling", name: "Slingtoshi Nakamoto", hue: 0, face: face("game-art/roster/sling.jpg"), facePos: "center 20%", sprite: kart("kart-sling.png"), top: 18.6, accel: 16, grip: 1.04, weight: 0.92, blurb: "Bronze. Hard to move." },
    { id: "sol", name: "Sol", hue: 0, face: face("game-art/roster/sol.jpg"), facePos: "center 15%", sprite: kart("kart-sol.png"), top: 17.4, accel: 22, grip: 1.2, weight: 0.44, blurb: "Purple bow. Clean lines." },
    { id: "amd", name: "AMD", hue: 0, face: face("game-art/roster/amd.jpg"), facePos: "center 12%", sprite: kart("kart-amd.png"), top: 16.6, accel: 27, grip: 1.16, weight: 0.38, blurb: "Red. Leaves hot." },
    { id: "carrot", name: "Cute Crypto Carrot", hue: 0, face: face("game-art/roster/carrot.jpg"), facePos: "center 8%", sprite: kart("kart-carrot.png"), top: 18.2, accel: 18, grip: 1.08, weight: 0.7, blurb: "Two sacks of coins." },
    { id: "xmr", name: "XMR", hue: 0, face: face("game-art/roster/xmr.jpg"), facePos: "center 18%", sprite: kart("kart-xmr.png"), top: 17.0, accel: 20, grip: 1.38, weight: 0.55, blurb: "Silver hair. Hard to pass." },
    { id: "of", name: "Orgasm Factory", hue: 0, face: face("game-art/roster/of.jpg"), facePos: "center 10%", sprite: kart("kart-of.png"), top: 17.8, accel: 21, grip: 1.18, weight: 0.46, blurb: "Blue. Glows on the wing." },
    { id: "pika", name: "Pika", hue: 0, face: face("game-art/roster/pika.jpg"), facePos: "center 8%", sprite: kart("kart-pika.png"), top: 16.0, accel: 29, grip: 1.24, weight: 0.22, blurb: "Yellow hood. Very light." },
    { id: "sp500", name: "SP500", hue: 0, face: face("game-art/roster/sp500.jpg"), facePos: "center 12%", sprite: kart("kart-sp500.png"), top: 18.0, accel: 19, grip: 1.12, weight: 0.58, blurb: "Red. The index." },
    { id: "aapl", name: "AAPL", hue: 0, face: face("game-art/roster/aapl.jpg"), facePos: "center 18%", sprite: kart("kart-aapl.png"), top: 17.6, accel: 21, grip: 1.16, weight: 0.5, blurb: "Silver. Holds the line." }
  ];
  root.nvdaDriver = function (id) {
    var list = root.NVDA_DRIVERS;
    for (var i = 0; i < list.length; i++) if (list[i].id === id || i === id) return list[i];
    return list[0];
  };
})(typeof window !== "undefined" ? window : this);
