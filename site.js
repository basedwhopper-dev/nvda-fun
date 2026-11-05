(function () {
  var CA = "4WgxC56hGyNXLd14mCgxBuR2DUyDReF8koFDynhepump";
  var toast = document.getElementById("toast");
  var light = document.getElementById("lightbox");
  var lightImg = document.getElementById("lightbox-img");

  function say(text) {
    toast.textContent = text;
    toast.classList.add("show");
    window.setTimeout(function () { toast.classList.remove("show"); }, 1600);
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var done = function () { say("CA copied"); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CA).then(done).catch(function () {
          say(CA);
        });
      } else {
        say(CA);
      }
    });
  });

  if (light && lightImg) {
    document.querySelectorAll(".still, .hero-still").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        lightImg.src = link.getAttribute("href");
        lightImg.alt = "NVDA still";
        if (window.getSelection) {
          var sel = window.getSelection();
          if (sel.removeAllRanges) sel.removeAllRanges();
        }
        light.classList.add("open");
      });
    });

    document.getElementById("lightbox-close").addEventListener("click", function () {
      light.classList.remove("open");
      lightImg.removeAttribute("src");
    });

    light.addEventListener("click", function (event) {
      if (event.target === light) {
        light.classList.remove("open");
        lightImg.removeAttribute("src");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        light.classList.remove("open");
        lightImg.removeAttribute("src");
      }
    });
  }

  document.querySelectorAll(".clip button").forEach(function (button) {
    var src = button.getAttribute("data-src");
    var poster = button.getAttribute("data-poster");
    var live = null;

    function stopLive() {
      if (!live) return;
      live.pause();
      live.removeAttribute("src");
      live.load();
      live.remove();
      live = null;
    }

    button.addEventListener("pointerenter", function () {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (live) return;
      live = document.createElement("video");
      live.className = "live";
      live.muted = true;
      live.loop = true;
      live.playsInline = true;
      live.poster = poster;
      live.src = src;
      button.appendChild(live);
      live.play().catch(function () { return undefined; });
    });

    button.addEventListener("pointerleave", stopLive);

    button.addEventListener("click", function () {
      stopLive();
      var video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.poster = poster;
      video.src = src;
      button.replaceWith(video);
      document.querySelectorAll(".clip video").forEach(function (other) {
        if (other !== video) other.pause();
      });
      video.play().catch(function () { return undefined; });
    });
  });
})();
