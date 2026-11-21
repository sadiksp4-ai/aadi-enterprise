import { useEffect, useRef, useState, type FC } from "react";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "../../lib/use-reduced-motion";
import { getAssetUrl } from "../../utils";
import "./ZafferanoVideo.css";

const VIDEO_SRC = getAssetUrl(
  "Videos/1Zafferrano Website Video Home Page.mp4"
);
const POSTER_SRC = getAssetUrl("images/spotlight/zafferano-poldina-pro.webp");
const VIDEO_ALT =
  "Zafferano Poldina Pro cordless table lamps in red, purple and orange on a restaurant table";

/**
 * Feature media for the Zafferano homepage section.
 *
 * The video is only requested once the section approaches the viewport.
 * Autoplay is muted/looping; reduced-motion visitors get the poster and an
 * explicit play control. A pause control is always available during playback.
 */
const ZafferanoVideo: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;

    if (prefersReducedMotion || !inView || hasFailed) {
      if (prefersReducedMotion && !video.paused) video.pause();
      return;
    }

    const attempt = video.play();
    attempt?.catch(() => {
      // Autoplay can be blocked (power saving, browser policy). The poster
      // remains visible and the play control lets the visitor start it.
    });
  }, [inView, prefersReducedMotion, hasFailed]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || hasFailed) return;

    if (video.paused) {
      video.muted = true;
      void video.play().catch(() => {
        // Keep the poster and play control if playback is not permitted.
      });
    } else {
      video.pause();
    }
  };

  return (
    <div className="hx-feature-video">
      <img
        className="hx-feature-video-poster"
        src={POSTER_SRC}
        alt={VIDEO_ALT}
        loading="lazy"
        decoding="async"
      />
      <video
        ref={videoRef}
        className={`hx-feature-video-el${hasFailed ? " is-failed" : ""}`}
        poster={POSTER_SRC}
        src={VIDEO_SRC}
        aria-hidden="true"
        tabIndex={-1}
        autoPlay={!prefersReducedMotion && inView}
        muted
        loop
        playsInline
        preload={inView && !prefersReducedMotion ? "auto" : "none"}
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasFailed(true);
          setIsPlaying(false);
        }}
      />

      {!isPlaying && !hasFailed && (
        <button
          type="button"
          className="hx-feature-video-play"
          onClick={togglePlayback}
          aria-label="Play the Zafferano video"
        >
          <Play size={18} aria-hidden="true" />
          <span>Play video</span>
        </button>
      )}

      {isPlaying && (
        <button
          type="button"
          className="hx-feature-video-pause"
          onClick={togglePlayback}
          aria-label="Pause the Zafferano video"
        >
          <Pause size={15} aria-hidden="true" />
        </button>
      )}

      {hasFailed && (
        <p className="hx-feature-video-status" role="status">
          Video unavailable
        </p>
      )}
    </div>
  );
};

export default ZafferanoVideo;
