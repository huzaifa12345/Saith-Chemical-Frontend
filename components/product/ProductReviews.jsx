'use client';

import { useState } from 'react';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { themeApi } from '@/lib/api-client';

export default function ProductReviews({ productId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const rating = formData.get('rating');
    const comment = formData.get('comment');

    if (!name || !rating || !comment) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ratingValue = parseInt(rating, 10);
    if (Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      toast.error('Please select a valid rating between 1 and 5');
      return;
    }

    try {
      setSubmitting(true);
      await themeApi.createReview({
        customer_name: String(name).trim(),
        rating: ratingValue,
        comment: String(comment).trim(),
        product_id: productId || null,
      });
      toast.success('Review submitted successfully!');
      e.target.reset();

      if (productId) {
        const reviewsData = await themeApi.getProductReviews(productId);
        setReviews(reviewsData?.reviews || []);
      }
    } catch (error) {
      toast.error(
        'Failed to submit review: ' +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row mt-5">
      <div className="col-12">
        <div className="review-section-card">
          <h3 className="section-heading mb-4 text-center">
            Customer Satisfaction
          </h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="write-review-card">
                <h5>Post a Review</h5>
                <form onSubmit={handleReviewSubmit}>
                  <input
                    type="text"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Your Name"
                    required
                  />
                  <select
                    name="rating"
                    className="form-control mb-2"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Rating
                    </option>
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Good</option>
                    <option value="3">3 Stars - Average</option>
                    <option value="2">2 Stars - Poor</option>
                    <option value="1">1 Star - Very Poor</option>
                  </select>
                  <textarea
                    name="comment"
                    className="form-control mb-3"
                    placeholder="Share your experience..."
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-submit-review w-100"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-md-8">
              {reviews.length === 0 ? (
                <div className="empty-reviews p-5 text-center">
                  <p className="mb-0 text-muted">
                    No reviews yet. Be the first to rate this product!
                  </p>
                </div>
              ) : (
                <div className="reviews-scroll-area">
                  {reviews.map((r, i) => (
                    <div
                      key={r.id || `${r.customer_name}-${i}`}
                      className="review-card-modern mb-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center gap-3">
                          <div className="user-avatar-circle">
                            {r.customer_name
                              ? r.customer_name.charAt(0).toUpperCase()
                              : 'U'}
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold text-navy">
                              {r.customer_name}
                              <span className="verified-badge-text ms-2">
                                <FaCheckCircle className="ms-1" /> Verified
                                Buyer
                              </span>
                            </h6>
                            <small className="text-muted">
                              Purchased recently
                            </small>
                          </div>
                        </div>
                        <div className="stars-wrapper">
                          {[...Array(5)].map((_, s) => (
                            <FaStar
                              key={s}
                              size={14}
                              color={s < r.rating ? '#ffc300' : '#e0e0e0'}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="review-content-body mt-3">
                        <p className="mb-0">{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
