(function (root) {
  "use strict";
  root.NVDA_ITEMS = [
    { id: "boost", name: "Boost", src: "game-art/item-boost.png", kind: "self" },
    { id: "cable", name: "Cable", src: "game-art/item-cable.png", kind: "trap" },
    { id: "shell", name: "Shell", src: "game-art/item-shell.png", kind: "shot" },
    { id: "home", name: "Homing", src: "game-art/item-home.png", kind: "home" },
    { id: "feather", name: "Feather", src: "game-art/item-feather.png", kind: "hop" },
    { id: "star", name: "Beam", src: "game-art/item-star.png", kind: "star" },
    { id: "bolt", name: "Bolt", src: "game-art/item-bolt.png", kind: "bolt" },
    { id: "ghost", name: "Ghost", src: "game-art/item-ghost.png", kind: "steal" }
  ];
  root.nvdaItem = function (id) {
    var list = root.NVDA_ITEMS;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  };
  root.nvdaRollItem = function (n) {
    var list = root.NVDA_ITEMS;
    return list[Math.abs(n) % list.length];
  };
})(typeof window !== "undefined" ? window : this);
