import { useState, useEffect, useCallback } from "react";
import { FaStar, FaPenAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getProductReviews,
  submitProductReview,
  getMyProductReview,
} from "@/service/api";

const PAGE_SIZE = 4; // reviews per page

/* ─── star row ───────────────────────────────────────────────────────────── */
function StarRow({ value, size = 18, onHover, onClick }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, cursor: onClick ? "pointer" : "default" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ color: s <= value ? "#f59e0b" : "#d1d5db", fontSize: size, lineHeight: 1, transition: "color .15s" }}
          onMouseEnter={() => onHover && onHover(s)}
          onMouseLeave={() => onHover && onHover(0)}
          onClick={() => onClick && onClick(s)}
        >★</span>
      ))}
    </span>
  );
}

/* ─── review card ────────────────────────────────────────────────────────── */
function ReviewCard({ r }) {
  const name = [r.firstname, r.lastname].filter(Boolean).join(" ") || "Anonymous";
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const date = r.created_at
    ? new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f0f4f8",
      borderRadius: 14,
      padding: "1rem 1.25rem",
      display: "flex",
      gap: "0.85rem",
      transition: "box-shadow .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: "linear-gradient(135deg,#ef4444,#f97316)",
        color: "#fff", display: "flex", alignItems: "center",
        justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0,
      }}>{initials}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-1">
          <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{name}</span>
          <span style={{ fontSize: "0.73rem", color: "#9ca3af" }}>{date}</span>
        </div>
        <StarRow value={r.rating} size={13} />
        {r.title && (
          <div style={{ fontWeight: 600, fontSize: "0.84rem", marginTop: 5 }}>{r.title}</div>
        )}
        {r.review && (
          <p style={{ fontSize: "0.83rem", color: "#4b5563", margin: "4px 0 0", lineHeight: 1.6 }}>
            {r.review}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── beautiful empty state ──────────────────────────────────────────────── */
function EmptyReviews({ onWrite }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "2.5rem 1.5rem", textAlign: "center",
    }}>
      {/* Star illustration */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
        border: "2px dashed #fcd34d",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "1.1rem",
      }}>
        <span style={{ fontSize: 30, lineHeight: 1 }}>⭐</span>
      </div>

      <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1f2937", marginBottom: 6 }}>
        No Reviews Yet
      </div>
      <p style={{ fontSize: "0.85rem", color: "#6b7280", maxWidth: 280, margin: "0 0 1.2rem" }}>
        Be the first to share your experience with this product. Your review helps others make better decisions!
      </p>

      {/* 5 hollow stars as CTA hint */}
      <div style={{ display: "flex", gap: 4, marginBottom: "1.3rem" }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} style={{ fontSize: 22, color: "#d1d5db", cursor: "pointer", transition: "color .2s" }}
            onMouseEnter={e => {
              const siblings = e.currentTarget.parentNode.children;
              for (let i = 0; i < siblings.length; i++) {
                siblings[i].style.color = i <= e.currentTarget.dataset.idx - 1 ? "#f59e0b" : "#d1d5db";
              }
            }}
            onMouseLeave={e => {
              const siblings = e.currentTarget.parentNode.children;
              for (let i = 0; i < siblings.length; i++) siblings[i].style.color = "#d1d5db";
            }}
            onClick={onWrite}
            data-idx={s}
          >★</span>
        ))}
      </div>

      <button
        onClick={onWrite}
        style={{
          background: "linear-gradient(135deg,#ef4444,#dc2626)",
          color: "#fff", border: "none", borderRadius: 10,
          padding: "0.55rem 1.4rem", fontWeight: 600, fontSize: "0.85rem",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
        }}
      >
        <FaPenAlt size={12} /> Write the First Review
      </button>
    </div>
  );
}

/* ─── Write-review Modal ─────────────────────────────────────────────────── */
function ReviewModal({ onClose, onSubmit, form, setForm, submitting, existing }) {
  const activeRating = form.hoverRating || form.rating;
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        zIndex: 1050, backdropFilter: "blur(3px)",
      }} />

      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", zIndex: 1051,
        background: "#fff", borderRadius: 18, width: "min(520px, 95vw)",
        padding: "2rem", boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
      }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h5 style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem" }}>
              {existing ? "Edit Your Review" : "Write a Review"}
            </h5>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
              Share your honest experience
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "#f3f4f6", border: "none", borderRadius: 8,
            width: 32, height: 32, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#374151",
          }}>×</button>
        </div>

        {/* Star picker */}
        <div className="mb-3">
          <label style={{ fontWeight: 600, fontSize: "0.84rem", display: "block", marginBottom: 8 }}>
            Your Rating <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StarRow value={activeRating} size={36}
              onHover={s => setForm(f => ({ ...f, hoverRating: s }))}
              onClick={s => setForm(f => ({ ...f, rating: s }))}
            />
            {activeRating > 0 && (
              <span style={{
                fontSize: "0.8rem", fontWeight: 600,
                background: "#fff7ed", color: "#c2410c",
                padding: "2px 10px", borderRadius: 99,
              }}>{labels[activeRating]}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label style={{ fontWeight: 600, fontSize: "0.84rem", display: "block", marginBottom: 4 }}>
            Review Title <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
          </label>
          <input type="text" className="form-control"
            placeholder="Summarise your experience"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            maxLength={150} style={{ fontSize: "0.9rem" }}
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label style={{ fontWeight: 600, fontSize: "0.84rem", display: "block", marginBottom: 4 }}>
            Review <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea className="form-control" rows={4}
            placeholder="Tell others what you liked or disliked…"
            value={form.review}
            onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
            style={{ fontSize: "0.9rem", resize: "vertical" }}
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={form.rating === 0 || submitting}
          style={{
            width: "100%", padding: "0.72rem",
            background: form.rating === 0
              ? "#e5e7eb"
              : "linear-gradient(135deg,#ef4444,#dc2626)",
            color: form.rating === 0 ? "#9ca3af" : "#fff",
            border: "none", borderRadius: 12, fontWeight: 700,
            fontSize: "0.95rem",
            cursor: form.rating === 0 ? "not-allowed" : "pointer",
            boxShadow: form.rating > 0 ? "0 4px 14px rgba(239,68,68,0.3)" : "none",
            transition: "all .2s",
          }}
        >
          {submitting ? "Submitting…" : existing ? "Update Review" : "Submit Review"}
        </button>
      </div>
    </>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function RatingsSection({
  productId, isAuthenticated,
  reviewsData, setReviewsData,
  myReview, setMyReview,
  showReviewModal, setShowReviewModal,
  reviewForm, setReviewForm,
  reviewSubmitting, setReviewSubmitting,
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      const res = await getProductReviews(productId);
      setReviewsData(res.data);
    } catch {}
  }, [productId, setReviewsData]);

  const fetchMine = useCallback(async () => {
    if (!productId || !isAuthenticated) return;
    try {
      const res = await getMyProductReview(productId);
      const r = res.data.review;
      setMyReview(r);
      if (r) setReviewForm(f => ({ ...f, rating: r.rating, title: r.title || "", review: r.review || "" }));
    } catch {}
  }, [productId, isAuthenticated, setMyReview, setReviewForm]);

  useEffect(() => { fetchReviews(); fetchMine(); }, [fetchReviews, fetchMine]);
  // reset pagination when product changes
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [productId]);

  const handleOpenModal = () => {
    if (!isAuthenticated) { toast.info("Please log in to write a review."); return; }
    setShowReviewModal(true);
  };

  const handleSubmit = async () => {
    if (reviewForm.rating === 0) return;
    setReviewSubmitting(true);
    try {
      await submitProductReview(productId, {
        rating: reviewForm.rating,
        title: reviewForm.title,
        review: reviewForm.review,
      });
      toast.success("Review submitted! 🎉");
      setShowReviewModal(false);
      await fetchReviews();
      await fetchMine();
    } catch {
      toast.error("Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise(r => setTimeout(r, 300)); // small UX delay
    setVisibleCount(v => v + PAGE_SIZE);
    setLoadingMore(false);
  };

  const { reviews = [], avgRating = 0, total = 0, distribution = [] } = reviewsData;
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <>
      <div id="ratings" className="section-card mt-4">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <h3 className="section-title mb-0">Ratings &amp; Reviews</h3>
          <button
            onClick={handleOpenModal}
            style={{
              background: "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "#fff", border: "none", borderRadius: 10,
              padding: "0.48rem 1rem", fontWeight: 600, fontSize: "0.83rem",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 3px 10px rgba(239,68,68,0.28)",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.88}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            <FaStar size={12} />
            {myReview ? "Edit My Review" : "Write a Review"}
          </button>
        </div>

        {/* ── Aggregate panel (only when there are reviews) ──────────── */}
        {total > 0 && (
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.4rem",
            alignItems: "center", background: "#fafafa", borderRadius: 14,
            padding: "1.1rem 1.3rem", marginBottom: "1.4rem", border: "1px solid #f0f0f0",
          }}>
            {/* Big number */}
            <div style={{ textAlign: "center", minWidth: 78 }}>
              <div style={{
                fontSize: "2.8rem", fontWeight: 800, lineHeight: 1,
                background: "linear-gradient(135deg,#ef4444,#f97316)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {avgRating.toFixed(1)}
              </div>
              <StarRow value={Math.round(avgRating)} size={15} />
              <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 4 }}>
                {total} review{total !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Bar chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {distribution.map(({ star, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.76rem" }}>
                    <span style={{ width: 16, textAlign: "right", color: "#374151", fontWeight: 600 }}>{star}</span>
                    <FaStar size={10} style={{ color: "#f59e0b", flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 7, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`, height: "100%",
                        background: pct === 0 ? "transparent" : "linear-gradient(90deg,#f59e0b,#ef4444)",
                        borderRadius: 99, transition: "width 0.7s ease",
                      }} />
                    </div>
                    <span style={{ width: 26, color: "#6b7280", textAlign: "right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Reviews list or empty state ────────────────────────────── */}
        {reviews.length === 0 ? (
          <EmptyReviews onWrite={handleOpenModal} />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {visibleReviews.map(r => <ReviewCard key={r.id} r={r} />)}
            </div>

            {/* Load More */}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  marginTop: "1rem", width: "100%",
                  padding: "0.6rem 1rem", borderRadius: 12,
                  border: "1.5px solid #e5e7eb", background: "#fff",
                  color: "#374151", fontWeight: 600, fontSize: "0.84rem",
                  cursor: "pointer", transition: "background .15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                {loadingMore ? (
                  <>
                    <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14, borderWidth: 2 }} />
                    Loading…
                  </>
                ) : (
                  <>Load More Reviews ({reviews.length - visibleCount} remaining)</>
                )}
              </button>
            )}

            {/* Collapse back when all shown */}
            {!hasMore && reviews.length > PAGE_SIZE && (
              <button
                onClick={() => setVisibleCount(PAGE_SIZE)}
                style={{
                  marginTop: "0.75rem", width: "100%",
                  padding: "0.5rem", borderRadius: 12,
                  border: "1.5px solid #e5e7eb", background: "none",
                  color: "#9ca3af", fontWeight: 600, fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Show less ↑
              </button>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showReviewModal && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmit}
          form={reviewForm}
          setForm={setReviewForm}
          submitting={reviewSubmitting}
          existing={!!myReview}
        />
      )}
    </>
  );
}
