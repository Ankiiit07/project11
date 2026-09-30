import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BadgeCheck, EyeOff, Eye } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { accountApi, type ProductReviewsResponse, type Review } from '../services/accountApi';
import { refreshReviewSummaries } from '../hooks/useReviewSummaries';

/** Loads a product's reviews (and, when signed in, whether the customer can review it). */
export function useProductReviews(productId: string) {
  const { user, ready } = useUser();
  const signedIn = Boolean(user);
  const [data, setData] = useState<ProductReviewsResponse | null>(null);

  const reload = useCallback(async () => {
    if (!ready || !productId) return;
    try {
      setData(await accountApi.getReviews(productId));
    } catch {
      setData({ reviews: [], summary: { count: 0, average: 0 } });
    }
  }, [productId, ready, signedIn]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, reload };
}

// A star is filled once the average is within a quarter of it (4.5 shows 4, 4.8 shows 5).
export const Stars: React.FC<{ value: number; size?: string }> = ({ value, size = 'h-4 w-4' }) => (
  <span className="flex items-center gap-0.5" aria-hidden="true">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`${size} ${i <= value + 0.25 ? 'fill-primary text-primary' : 'text-foreground/20'}`} />
    ))}
  </span>
);

const ReviewForm: React.FC<{ productId: string; existing?: Review | null; onSaved: () => void }> = ({
  productId,
  existing,
  onSaved,
}) => {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [title, setTitle] = useState(existing?.title || '');
  const [text, setText] = useState(existing?.text || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return setError('Please choose a star rating.');
    setSaving(true);
    setError('');
    try {
      await accountApi.writeReview({ productId, rating, title, text });
      refreshReviewSummaries();
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your review.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-heading text-lg font-bold text-foreground">{existing ? 'Edit your review' : 'Write a review'}</h3>
      <fieldset>
        <legend className="block text-sm font-medium text-foreground/70 mb-2">Your rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              aria-label={`${i} star${i > 1 ? 's' : ''}`}
              aria-pressed={rating === i}
              className="p-1"
            >
              <Star className={`h-7 w-7 ${i <= rating ? 'fill-primary text-primary' : 'text-foreground/25'}`} />
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-foreground/70 mb-2">Title (optional)</label>
        <input
          id="review-title"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-11 px-4 bg-background border border-border rounded-lg"
          placeholder="Sum it up in a few words"
        />
      </div>
      <div>
        <label htmlFor="review-text" className="block text-sm font-medium text-foreground/70 mb-2">Your review</label>
        <textarea
          id="review-text"
          value={text}
          maxLength={2000}
          rows={4}
          required
          minLength={10}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 bg-background border border-border rounded-lg"
          placeholder="How was the taste? Where did you have it?"
        />
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="h-11 px-8 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-heading font-bold rounded-full"
      >
        {saving ? 'Saving…' : existing ? 'Update review' : 'Post review'}
      </button>
    </form>
  );
};

const ProductReviews: React.FC<{ productId: string; data: ProductReviewsResponse | null; reload: () => void }> = ({
  productId,
  data,
  reload,
}) => {
  const { user } = useUser();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState('');

  const moderate = async (review: Review, action: 'hide' | 'show') => {
    setBusy(review.id);
    try {
      await accountApi.moderateReview(review.id, action);
      refreshReviewSummaries();
      reload();
    } finally {
      setBusy('');
    }
  };

  if (!data) return null;
  const { reviews, summary, mine, canReview, isAdmin } = data;
  const showForm = canReview && (!mine || editing);

  return (
    <section id="reviews" aria-labelledby="reviews-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="reviews-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Customer reviews
          </h2>
          {summary.count > 0 ? (
            <div className="flex items-center gap-2 mt-2">
              <Stars value={summary.average} size="h-5 w-5" />
              <span className="text-foreground/80">
                {summary.average.toFixed(1)} out of 5 · {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          ) : (
            <p className="text-foreground/70 mt-2">No reviews yet. Reviews come only from verified buyers.</p>
          )}
        </div>
        {!user && (
          <Link to="/account" className="text-primary font-medium hover:underline">
            Bought this? Sign in to review
          </Link>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            existing={mine}
            onSaved={() => {
              setEditing(false);
              reload();
            }}
          />
        </div>
      )}
      {mine && !editing && (
        <div className="mb-6 p-4 bg-secondary rounded-xl flex items-center justify-between gap-3">
          <p className="text-sm text-foreground/80">
            {mine.status === 'hidden' ? 'Your review is hidden by the store.' : 'Thanks for your review!'}
          </p>
          <button onClick={() => setEditing(true)} className="text-sm font-medium text-primary hover:underline">
            Edit
          </button>
        </div>
      )}
      {user && canReview === false && !mine && (
        <p className="mb-6 text-sm text-foreground/60">You can review this product after you buy it.</p>
      )}

      {reviews.length > 0 && (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className={`bg-card border border-border rounded-xl p-5 ${r.status === 'hidden' ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <Stars value={r.rating} />
                  {r.title && <span className="font-bold text-foreground">{r.title}</span>}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => moderate(r, r.status === 'hidden' ? 'show' : 'hide')}
                    disabled={busy === r.id}
                    className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-primary"
                  >
                    {r.status === 'hidden' ? (
                      <>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mr-1">Hidden</span>
                        <Eye className="h-4 w-4" /> Show
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" /> Hide
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="mt-2 text-foreground/80 whitespace-pre-line">{r.text}</p>
              <p className="mt-3 text-xs text-foreground/60 flex items-center gap-1 flex-wrap">
                {r.name} ·{' '}
                <span className="inline-flex items-center gap-0.5 text-green-700">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                </span>{' '}
                · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </li>
          ))}
        </ul>
      )}

    </section>
  );
};

export default ProductReviews;
