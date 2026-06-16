"use client";

import { useEffect, useState, useRef } from "react";

// Declaring Clappr type definition since it is imported globally via layout script
declare global {
  interface Window {
    Clappr: any;
  }
}

type ChannelKey = "cricket" | "fifa";

const channelEndpoints: Record<ChannelKey, string> = {
  cricket: "https://webstorm.linkpc.net/live.m3u8",
  fifa: "https://webstorm.linkpc.net/fifa.m3u8",
};

export default function Home() {
  const [currentChannel, setCurrentChannel] = useState<ChannelKey>("cricket");
  const [isModalActive, setIsModalActive] = useState<boolean>(true);
  const [viewers, setViewers] = useState<number>(1350);
  const [countdownText, setCountdownText] = useState<string>("⏳ Loading Timer...");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const playerRef = useRef<any>(null);

  // Initialize and identify device configuration checks
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(mobileCheck);
    }

    // Context protection configuration
    const preventDefault = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12" || e.keyCode === 123) return e.preventDefault();
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) return e.preventDefault();
      if (e.ctrlKey && (e.key === "u" || e.key === "s" || e.key === "U" || e.key === "S")) return e.preventDefault();
    };

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Clappr Player Engine controller lifecycle
  useEffect(() => {
    // If the instruction modal popup is active, wait to render the streaming source engine
    if (isModalActive) return;

    const startStreamingEngine = () => {
      const activeStreamUrl = channelEndpoints[currentChannel];

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      const container = document.getElementById("video-display");
      if (!container || !window.Clappr) return;

      playerRef.current = new window.Clappr.Player({
        source: activeStreamUrl,
        parentId: "#video-display",
        width: "100%",
        height: "100%",
        autoPlay: true,
        mute: false,
        mimeType: "application/x-mpegURL",
        preload: "auto",
        playback: {
          playInline: true,
          recycleVideo: true,
          hlsMinimumBacklogSecs: 60,
        },
        hlsjsConfig: {
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 20,
          maxMaxBufferLength: 40,
          liveSyncDurationCount: 4,
          manifestLoadingMaxRetry: 15,
          manifestLoadingRetryDelay: 500,
          levelLoadingMaxRetry: 15,
          levelLoadingRetryDelay: 500,
          fragLoadingMaxRetry: 15,
          fragLoadingRetryDelay: 500,
          xhrSetup: function (xhr: any) {
            xhr.withCredentials = false;
          },
        },
      });

      playerRef.current.on(window.Clappr.Events.PLAYER_ERROR, (error: any) => {
        console.warn("Recovering engine loop drop...", error);
        setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.load(channelEndpoints[currentChannel]);
            playerRef.current.play();
          }
        }, 1000);
      });
    };

    startStreamingEngine();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [currentChannel, isModalActive]);

  // Viewers variance background looping engine
  useEffect(() => {
    const updateLiveViewers = () => {
      const baseTraffic = currentChannel === "cricket" ? 1420 : 980;
      const variance = Math.floor(Math.random() * 120) - 60;
      setViewers(baseTraffic + variance);
    };

    updateLiveViewers();
    const viewerInterval = setInterval(updateLiveViewers, 4000);
    return () => clearInterval(viewerInterval);
  }, [currentChannel]);

  // Match Countdown Timer engine execution loops
  useEffect(() => {
    const matchTimeTarget = new Date("Jun 15, 2026 06:00:00+05:30").getTime();

    const updateClock = () => {
      if (currentChannel === "fifa") {
        setCountdownText("⚽ FIFA STREAM LIVE");
        return;
      }

      const now = new Date().getTime();
      const deltaDifference = matchTimeTarget - now;

      if (deltaDifference <= 0) {
        setCountdownText("🏏 MATCH LIVE");
        return;
      }

      const hours = Math.floor((deltaDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((deltaDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((deltaDifference % (1000 * 60)) / 1000);

      const hStr = hours < 10 ? `0${hours}` : hours;
      const mStr = minutes < 10 ? `0${minutes}` : minutes;
      const sStr = seconds < 10 ? `0${seconds}` : seconds;

      setCountdownText(`⏳ Starts in: ${hStr}h ${mStr}m ${sStr}s`);
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, [currentChannel]);

  const closeInstructions = () => {
    setIsModalActive(false);
  };

  const activeStreamUrl = channelEndpoints[currentChannel];
  const nativeFallbackLink = activeStreamUrl;
  const vlcFallbackLink = typeof window !== "undefined" ? "vlc://" + activeStreamUrl.replace(/^https?:\/\//, "") : "#";

  return (
    <div className={isModalActive ? "modal-active" : ""}>
      {/* Streaming Instructions Popup Modal Overlay */}
      {isModalActive && (
        <div className="modal-overlay" id="popup-modal">
          <div className="instruction-modal">
            <div className="modal-title">
              <span>⚠️</span> Streaming Instructions
            </div>
            <div className="modal-body">
              <div className="modal-item">
                <span className="modal-icon">🔄</span>
                <p>
                  <b>Lagging Issues:</b> If the video stream buffers or freezes up, kindly <b>reload / refresh</b> your browser page.
                </p>
              </div>
              <div className="modal-item">
                <span className="modal-icon">🔊</span>
                <p>
                  <b>Audio Muted:</b> Browsers block auto-playing sound. If there's no sound, just tap the speaker button inside the player dashboard.
                </p>
              </div>
              <div className="modal-item">
                <span className="modal-icon">🚀</span>
                <p>
                  <b>Ads:</b> <b>If ads appear, please kindly close them. Thanks for your understanding!</b>{" "}
                </p>
              </div>
            </div>
            <button className="modal-btn" onClick={closeInstructions}>
              Got It, Let's Watch!
            </button>
          </div>
        </div>
      )}

      {/* Header Bar Navigation View */}
      <header>
        <h1>
          Web<span>Storm</span>
        </h1>
        <div className="live-indicator">LIVE</div>
      </header>

      {/* Main Structural Stream Layout Context */}
      <main>
        {/* Channel switching tabs component section */}
        <div className="channel-tabs-container">
          <button
            id="btn-cricket"
            className={`channel-tab-button ${currentChannel === "cricket" ? "active-channel" : ""}`}
            onClick={() => setCurrentChannel("cricket")}
          >
            🏏 Cricket Live
          </button>
          <button
            id="btn-fifa"
            className={`channel-tab-button ${currentChannel === "fifa" ? "active-channel" : ""}`}
            onClick={() => setCurrentChannel("fifa")}
          >
            ⚽ FIFA Live Match
          </button>
        </div>

        {/* Video Player Dashboard wrapper frame hooks */}
        <div className="player-alignment-wrapper">
          <div className="player-container">
            <div id="video-display"></div>

            {/* Smartphone OS Fallback Overlay Display Block */}
            {isMobile && (
              <div id="mobile-card" className="mobile-fallback-card">
                <h3>📱 Mobile Streaming Engine</h3>
                <p>
                  Mobile web browsers may block this stream context layout. Tap below to stream directly inside your
                  device players without ads or limits. Get a VLC player app from app store or playstore
                </p>

                <a id="native-app-link" href={nativeFallbackLink} className="external-btn">
                  ▶️ Play in Device Player
                </a>
                <a id="vlc-app-link" href={vlcFallbackLink} className="external-btn vlc">
                  🧡 Open in VLC Mobile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* High Speed Backup External Server Routing Button Card */}
        <div className="ad-server-box">
          <h5>⚡ Stream Having Trouble?</h5>
          <p>If Server 1 is slow or lagging, try our high-speed backup link below:</p>
          <a href="https://omg10.com/4/11148576" target="_blank" rel="noopener noreferrer" className="server-direct-btn">
            🚀 Open High-Speed Server 2
          </a>
        </div>

        {/* Live Active Feed Meta Analytics Content Box */}
        <div className="stream-info">
          <h2 id="stream-title">
            {currentChannel === "cricket"
              ? "Live Cricket Streaming"
              : "Live Match Streaming: FIFA Tournament World Feed"}
          </h2>

          <div className="info-metrics-row">
            <div className="viewer-count">
              <span className="pulse-dot"></span>
              <span id="view-number">{viewers.toLocaleString()}</span> watching now
            </div>

            <div className="match-countdown-ticker" id="match-timer-clock">
              {countdownText}
            </div>
          </div>

          <div className="schedule-box">
            <h4>{currentChannel === "cricket" ? "Upcoming Event" : "Current Active Event"}</h4>
            <div className="schedule-card">
              <div className="match-teams">
                {currentChannel === "cricket" ? "Test Series: West Indies vs Sri Lanka" : "FIFA Live Stream Session"}
              </div>
              <div className="match-time">{currentChannel === "cricket" ? "25-30 Jun, 2026" : "LIVE NOW"}</div>
            </div>
          </div>

          <div className="about-text">
            <i>
              This is a simple website for all supporters to watch premium sports events live. If you notice lag, kindly
              refresh your browser.
            </i>
            <br />
            <br />
            <b>Made with ❤️ for sports lovers! Developed by Venuja :)</b>
          </div>
        </div>
      </main>

      {/* Root Copyright Footer Element */}
      <footer>&copy; 2026 WebStorm Player. All rights reserved.</footer>
    </div>
  );
}
