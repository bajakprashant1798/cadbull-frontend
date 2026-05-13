import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearchMinus, FaSearchPlus, FaDownload, FaTimes, FaChevronLeft, FaChevronRight, FaUndo } from "react-icons/fa";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;

const resetView = () => ({ zoom: 1, pan: { x: 0, y: 0 } });

export default function ImageLightbox({ images = [], startIndex = 0, onClose, onDownload }) {
  const [idx, setIdx] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Reset zoom/pan on image change
  useEffect(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, [idx]);

  // Start index
  useEffect(() => { setIdx(startIndex); }, [startIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") handleReset();
      if (e.key === "d" || e.key === "D") onDownload?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const goNext = () => setIdx(i => (i + 1) % images.length);
  const goPrev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const zoomIn  = () => setZoom(z => Math.min(+(z + ZOOM_STEP).toFixed(2), MAX_ZOOM));
  const zoomOut = () => setZoom(z => Math.max(+(z - ZOOM_STEP).toFixed(2), MIN_ZOOM));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const isChanged = zoom !== 1 || pan.x !== 0 || pan.y !== 0;

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.deltaY < 0) setZoom(z => Math.min(+(z + ZOOM_STEP).toFixed(2), MAX_ZOOM));
    else setZoom(z => Math.max(+(z - ZOOM_STEP).toFixed(2), MIN_ZOOM));
  }, []);

  // Panning
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  };
  const handleMouseUp = () => { dragging.current = false; };

  // Touch panning
  const lastTouch = useRef(null);
  const handleTouchStart = (e) => { if (e.touches.length === 1) lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && lastTouch.current) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (zoom > 1) setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    }
  };
  const handleTouchEnd = () => { lastTouch.current = null; };

  // Attach wheel listener with { passive: false }
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const pct = Math.round(zoom * 100);
  const src = images[idx];

  const btnStyle = {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    borderRadius: 8,
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
    transition: "background .15s",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10,14,27,0.97)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.6rem 1rem", flexShrink: 0, zIndex: 10,
      }}>
        {/* Left: counter + label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            background: "#fff", color: "#111", borderRadius: 20,
            padding: "3px 12px", fontWeight: 700, fontSize: "0.8rem",
          }}>
            {images.length > 1 ? `${idx + 1}/${images.length}` : "Part-1"}
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
            Plan view
          </span>
        </div>

        {/* Right: zoom controls + reset + download + close */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Zoom out */}
          <button
            style={{ ...btnStyle, opacity: zoom <= MIN_ZOOM ? 0.4 : 1 }}
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            title="Zoom out (-)"
          >
            <FaSearchMinus size={13} />
          </button>

          {/* Zoom % pill — click resets */}
          <button
            onClick={handleReset}
            title="Reset zoom (0)"
            style={{
              background: isChanged ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)",
              border: isChanged ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.2)",
              color: isChanged ? "#fca5a5" : "#fff",
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              minWidth: 52,
              textAlign: "center",
              cursor: "pointer",
              transition: "all .2s",
              flexShrink: 0,
            }}
          >
            {pct}%
          </button>

          {/* Zoom in */}
          <button
            style={{ ...btnStyle, opacity: zoom >= MAX_ZOOM ? 0.4 : 1 }}
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            title="Zoom in (+)"
          >
            <FaSearchPlus size={13} />
          </button>

          {/* Reset button — only visible when changed */}
          {isChanged && (
            <button
              onClick={handleReset}
              title="Reset view (0)"
              style={{
                ...btnStyle,
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.5)",
                color: "#fca5a5",
                gap: 5,
                width: "auto",
                padding: "0 12px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              <FaUndo size={11} /> Reset
            </button>
          )}

          {/* Download */}
          <button
            style={{ ...btnStyle, background: "linear-gradient(135deg,#ef4444,#f97316)", border: "none", padding: "0 14px", width: "auto", gap: 6, fontWeight: 700, fontSize: "0.8rem" }}
            onClick={onDownload}
            title="Download DWG"
          >
            <FaDownload size={13} />
            <span className="d-none d-md-inline">Download DWG</span>
          </button>

          {/* Close */}
          <button style={{ ...btnStyle, marginLeft: 4 }} onClick={onClose} title="Close (Esc)">
            <FaTimes size={15} />
          </button>
        </div>
      </div>

      {/* ── Main image area ──────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          flex: 1, position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: zoom > 1 ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            style={{
              position: "absolute", left: 14, zIndex: 20,
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
              transition: "background .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <FaChevronLeft size={18} />
          </button>
        )}

        {/* Image */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          width: "calc(100% - 140px)",
          maxWidth: 900,
          height: "100%",
          maxHeight: "calc(100% - 16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          {src && (
            <img
              src={src}
              alt={`Image ${idx + 1}`}
              draggable={false}
              loading="eager"
              decoding="async"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: dragging.current ? "none" : "transform 0.15s ease",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
                userSelect: "none",
                cursor: zoom > 1 ? (dragging.current ? "grabbing" : "grab") : "default",
              }}
              onDoubleClick={zoomIn}
            />
          )}
        </div>

        {/* Next arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            style={{
              position: "absolute", right: 14, zIndex: 20,
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
              transition: "background .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <FaChevronRight size={18} />
          </button>
        )}
      </div>

      {/* ── Thumbnail strip ──────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div style={{
          display: "flex", gap: 8, justifyContent: "center",
          padding: "10px 16px 12px", flexShrink: 0,
          overflowX: "auto",
        }}>
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: 52, height: 40, flexShrink: 0,
                border: i === idx ? "2px solid #ef4444" : "2px solid rgba(255,255,255,0.15)",
                borderRadius: 6, overflow: "hidden", padding: 0,
                background: "#fff",
                cursor: "pointer",
                opacity: i === idx ? 1 : 0.55,
                transition: "opacity .2s, border-color .2s",
              }}
              onMouseEnter={e => { if (i !== idx) e.currentTarget.style.opacity = 0.85; }}
              onMouseLeave={e => { if (i !== idx) e.currentTarget.style.opacity = 0.55; }}
            >
              {/* ✅ Thumbnails: only load when close to current index (±2), else defer */}
              {Math.abs(i - idx) <= 2 ? (
                <img
                  src={url}
                  alt={`thumb ${i + 1}`}
                  loading={i === idx ? "eager" : "lazy"}
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Bottom hint ──────────────────────────────────────────────────── */}
      <div style={{
        textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)",
        paddingBottom: 8, flexShrink: 0,
      }}>
        Scroll to zoom • Drag to pan • Double-click to zoom in • ← → keys • Press <kbd style={{ background: "rgba(255,255,255,0.1)", padding: "1px 5px", borderRadius: 3, color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>0</kbd> to reset
      </div>
    </div>
  );
}
