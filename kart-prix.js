(function (root) {
  "use strict";
  var POINTS = [9, 6, 3, 1, 0, 0, 0, 0];
  function blank() {
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }
  function add(totals, order) {
    var next = totals.slice();
    for (var i = 0; i < order.length && i < POINTS.length; i++) {
      var slot = order[i];
      next[slot] = (next[slot] || 0) + POINTS[i];
    }
    return next;
  }
  function leader(totals) {
    var who = 0;
    var best = -1;
    for (var i = 0; i < totals.length; i++) {
      if (totals[i] > best) {
        best = totals[i];
        who = i;
      }
    }
    return who;
  }
  function tied(totals, slot) {
    var best = totals[leader(totals)];
    return totals[slot] === best;
  }
  root.NVDA_PRIX = {
    points: POINTS,
    lives: 3,
    laps: 5,
    failFrom: 5,
    cc: { "50": 0.78, "100": 1, "150": 1.22 },
    blank: blank,
    add: add,
    leader: leader,
    tied: tied,
    placeOf: function (order, slot) {
      for (var i = 0; i < order.length; i++) if (order[i] === slot) return i + 1;
      return order.length;
    }
  };
})(typeof window !== "undefined" ? window : this);
