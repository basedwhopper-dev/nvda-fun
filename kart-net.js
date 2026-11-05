(function (root) {
  "use strict";
  var loc = root.location || { hostname: "127.0.0.1", protocol: "http:" };
  var host = loc.hostname || "127.0.0.1";
  var proto = loc.protocol === "https:" ? "wss://" : "ws://";
  var url = proto + host + ":8791";
  var ws = null;
  var queue = [];
  var pcs = {};
  var channels = {};
  var iceWait = {};

  var api = {
    url: url,
    id: null,
    host: false,
    code: null,
    driver: "nvda",
    ready: false,
    lobby: null,
    onLobby: null,
    onGo: null,
    onFast: null,
    onOpen: null,
    onClose: null,
    onStatus: null,
    connect: connect,
    create: function (driver) {
      api.driver = driver || "nvda";
      api.host = true;
      sendWhen({ t: "create", driver: api.driver });
    },
    join: function (code, driver) {
      api.driver = driver || "nvda";
      api.host = false;
      sendWhen({ t: "join", code: String(code || "").toUpperCase(), driver: api.driver });
    },
    setDriver: function (driver) {
      api.driver = driver;
      send({ t: "driver", driver: driver });
    },
    setReady: function (ready) {
      api.ready = !!ready;
      send({ t: "ready", ready: api.ready });
    },
    setTrack: function (trackId, cc) {
      send({ t: "track", trackId: trackId, cc: cc });
    },
    start: function () { send({ t: "start" }); },
    rematch: function () { hangup(); send({ t: "rematch" }); },
    leave: function () { send({ t: "leave" }); hangup(); api.lobby = null; },
    sendFast: function (peerId, obj) { sendChannel(peerId, obj); },
    sendAll: function (obj) {
      Object.keys(channels).forEach(function (id) { sendChannel(id, obj); });
    },
    openCount: function () {
      var n = 0;
      Object.keys(channels).forEach(function (id) {
        if (channels[id] && channels[id].readyState === "open") n += 1;
      });
      return n;
    }
  };

  function status(text) { if (api.onStatus) api.onStatus(text); }

  function connect() {
    if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;
    status("Connecting to the room…");
    try { ws = new WebSocket(url); }
    catch (err) {
      status("Room server is not running. Start node clients/nvda_goon/kart-room.js");
      return;
    }
    ws.onopen = function () {
      status("");
      var pending = queue.slice();
      queue = [];
      pending.forEach(function (m) { ws.send(JSON.stringify(m)); });
    };
    ws.onerror = function () {
      status("Room server is not running. Start node clients/nvda_goon/kart-room.js");
    };
    ws.onclose = function () { status("Room connection closed."); };
    ws.onmessage = function (ev) {
      var msg;
      try { msg = JSON.parse(ev.data); } catch (err) { return; }
      if (msg.t === "welcome") {
        api.id = msg.id;
        api.host = !!msg.host;
        api.code = msg.code;
      } else if (msg.t === "lobby") {
        api.lobby = msg;
        api.code = msg.code;
        if (api.onLobby) api.onLobby(msg);
      } else if (msg.t === "go") {
        hangup();
        if (!api.host) offerTo(msg.hostId);
        if (api.onGo) api.onGo(msg);
      } else if (msg.t === "signal") {
        onSignal(msg.from, msg.data);
      } else if (msg.t === "err") {
        status(msg.msg || "Room error");
      } else if (msg.t === "closed") {
        status("The host left the room.");
        hangup();
        api.lobby = null;
        if (api.onClose) api.onClose("host");
      }
    };
  }

  function send(obj) {
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
  }

  function sendWhen(obj) {
    connect();
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
    else queue.push(obj);
  }

  function createPc(peerId) {
    if (pcs[peerId]) return pcs[peerId];
    var pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcs[peerId] = pc;
    iceWait[peerId] = [];
    pc.onicecandidate = function (e) {
      if (e.candidate) send({ t: "signal", to: peerId, data: { kind: "ice", cand: e.candidate } });
    };
    pc.ondatachannel = function (e) { wire(peerId, e.channel); };
    return pc;
  }

  function flushIce(pc, peerId) {
    var list = iceWait[peerId] || [];
    iceWait[peerId] = [];
    list.forEach(function (c) { pc.addIceCandidate(c).catch(function () {}); });
  }

  function wire(peerId, ch) {
    channels[peerId] = ch;
    ch.onopen = function () { if (api.onOpen) api.onOpen(peerId); };
    ch.onmessage = function (ev) {
      var msg;
      try { msg = JSON.parse(ev.data); } catch (err) { return; }
      if (api.onFast) api.onFast(peerId, msg);
    };
  }

  function offerTo(hostId) {
    var pc = createPc(hostId);
    var ch = pc.createDataChannel("race", { ordered: false, maxRetransmits: 0 });
    wire(hostId, ch);
    pc.createOffer().then(function (offer) {
      return pc.setLocalDescription(offer);
    }).then(function () {
      send({ t: "signal", to: hostId, data: { kind: "offer", sdp: pc.localDescription.sdp } });
    }).catch(function () { status("Could not open the race link."); });
  }

  function onSignal(from, data) {
    if (!from || !data) return;
    var pc = createPc(from);
    if (data.kind === "offer") {
      pc.setRemoteDescription({ type: "offer", sdp: data.sdp }).then(function () {
        flushIce(pc, from);
        return pc.createAnswer();
      }).then(function (answer) {
        return pc.setLocalDescription(answer);
      }).then(function () {
        send({ t: "signal", to: from, data: { kind: "answer", sdp: pc.localDescription.sdp } });
      }).catch(function () {});
    } else if (data.kind === "answer") {
      pc.setRemoteDescription({ type: "answer", sdp: data.sdp }).then(function () {
        flushIce(pc, from);
      }).catch(function () {});
    } else if (data.kind === "ice" && data.cand) {
      if (!pc.remoteDescription) iceWait[from].push(data.cand);
      else pc.addIceCandidate(data.cand).catch(function () {});
    }
  }

  function sendChannel(peerId, obj) {
    var ch = channels[peerId];
    if (ch && ch.readyState === "open") {
      try { ch.send(JSON.stringify(obj)); } catch (err) {}
    }
  }

  function hangup() {
    Object.keys(pcs).forEach(function (id) {
      try { pcs[id].close(); } catch (err) {}
    });
    pcs = {};
    channels = {};
    iceWait = {};
  }

  root.NVDA_NET = api;
})(typeof window !== "undefined" ? window : this);
