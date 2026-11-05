(function (root) {
  "use strict";
  root.NVDA_BATTLE = {
    balloons: 3,
    courses: ["bay-pit", "cage", "vault", "the-well"],
    popOnHit: true,
    popOnShot: true,
    alive: function (racers) {
      var n = 0;
      for (var i = 0; i < racers.length; i++) if (!racers[i].out) n++;
      return n;
    },
    winner: function (racers) {
      for (var i = 0; i < racers.length; i++) if (!racers[i].out) return racers[i];
      return null;
    }
  };
})(typeof window !== "undefined" ? window : this);
