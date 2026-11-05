(function (root) {
  "use strict";
  var KEY = "nvda-tt-local-board";

  function readLocal() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw && Array.isArray(raw.rows)) return raw;
    } catch (e) {}
    return { rows: [] };
  }

  function writeLocal(rows) {
    localStorage.setItem(KEY, JSON.stringify({ rows: rows }));
  }

  function pack(row) {
    var ghost = row.ghost;
    if (row._rank > 5) ghost = null;
    var out = {
      name: row.name,
      time: row.time,
      track: row.track,
      trackName: row.trackName,
      racer: row.racer,
      racerName: row.racerName
    };
    if (ghost && ghost.length) out.ghost = ghost;
    return out;
  }

  function merge(staticRows, localRows) {
    var best = {};
    function take(row) {
      if (!row || !row.track || !row.name || !isFinite(Number(row.time))) return;
      var key = row.track + "|" + String(row.name).toLowerCase();
      var prev = best[key];
      var time = Number(row.time);
      if (!prev || time < prev.time) {
        best[key] = {
          name: String(row.name).slice(0, 16),
          time: Math.round(time * 100) / 100,
          track: row.track,
          trackName: row.trackName || row.track,
          racer: row.racer || "",
          racerName: row.racerName || row.racer || "",
          ghost: Array.isArray(row.ghost) ? row.ghost : null
        };
      } else if (prev && !prev.ghost && Array.isArray(row.ghost) && time === prev.time) {
        prev.ghost = row.ghost;
      }
    }
    (staticRows || []).forEach(take);
    (localRows || []).forEach(take);
    var rows = Object.keys(best).map(function (key) { return best[key]; });
    rows.sort(function (a, b) {
      if (a.track !== b.track) return a.track < b.track ? -1 : 1;
      return a.time - b.time;
    });
    var per = {};
    return rows.filter(function (row) {
      per[row.track] = (per[row.track] || 0) + 1;
      row._rank = per[row.track];
      return row._rank <= 20;
    }).map(pack);
  }

  function remember(row) {
    var rows = merge(readLocal().rows, [row]);
    writeLocal(rows);
    return rows;
  }

  root.NVDA_TT = { readLocal: readLocal, merge: merge, remember: remember };
})(typeof window !== "undefined" ? window : this);
