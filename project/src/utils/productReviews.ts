// Product Reviews & Ratings Utility
import toast from 'react-hot-toast';

export interface ProductReview {
    id: string;
    productId: string;
    productName: string;
    buyerId: string;
    buyerName: string;
    rating: number; // 1-5
    title: string;
    comment: string;
    photos?: string[];
    helpful: number;
    notHelpful: number;
    verified: boolean; // Verified purchase
    createdAt: string;
    updatedAt?: string;
    response?: {
        sellerId: string;
        sellerName: string;
        message: string;
        respondedAt: string;
    };
}

export interface RatingsSummary {
    productId: string;
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    verifiedPurchases: number;
    recommendationPercentage: number;
}

const REVIEWS_KEY = 'agri_product_reviews';
const HELPFUL_VOTES_KEY = 'agri_helpful_votes';

// Get all reviews
export function getAllReviews(): ProductReview[] {
    const stored = localStorage.getItem(REVIEWS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save reviews
function saveReviews(reviews: ProductReview[]): void {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

// Get reviews for a product
export function getProductReviews(productId: string): ProductReview[] {
    const reviews = getAllReviews();
    return reviews.filter((r) => r.productId === productId);
}

// Get reviews by buyer
export function getBuyerReviews(buyerId: string): ProductReview[] {
    const reviews = getAllReviews();
    return reviews.filter((r) => r.buyerId === buyerId);
}

// Add review
export function addReview(
    reviewData: Omit<ProductReview, 'id' | 'helpful' | 'notHelpful' | 'createdAt'>
): ProductReview | null {
    const reviews = getAllReviews();

    // Check if user already reviewed this product
    const existingReview = reviews.find(
        (r) => r.productId === reviewData.productId && r.buyerId === reviewData.buyerId
    );

    if (existingReview) {
        toast.error('You have already reviewed this product');
        return null;
    }

    // Validate rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
        toast.error('Rating must be between 1 and 5');
        return null;
    }

    const newReview: ProductReview = {
        ...reviewData,
        id: `review_${Date.now()}`,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    saveReviews(reviews);
    toast.success('Review posted successfully!');
    return newReview;
}

// Update review
export function updateReview(
    reviewId: string,
    updates: Partial<Pick<ProductReview, 'rating' | 'title' | 'comment' | 'photos'>>
): ProductReview | null {
    const reviews = getAllReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);

    if (index === -1) {
        toast.error('Review not found');
        return null;
    }

    // Validate rating if being updated
    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
        toast.error('Rating must be between 1 and 5');
        return null;
    }

    reviews[index] = {
        ...reviews[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    saveReviews(reviews);
    toast.success('Review updated successfully!');
    return reviews[index];
}

// Delete review
export function deleteReview(reviewId: string, buyerId: string): boolean {
    const reviews = getAllReviews();
    const review = reviews.find((r) => r.id === reviewId);

    if (!review) {
        toast.error('Review not found');
        return false;
    }

    // Only allow buyer to delete their own review
    if (review.buyerId !== buyerId) {
        toast.error('You can only delete your own reviews');
        return false;
    }

    const filtered = reviews.filter((r) => r.id !== reviewId);
    saveReviews(filtered);
    toast.success('Review deleted successfully!');
    return true;
}

// Add seller response
export function addSellerResponse(
    reviewId: string,
    sellerId: string,
    sellerName: string,
    message: string
): ProductReview | null {
    const reviews = getAllReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);

    if (index === -1) {
        toast.error('Review not found');
        return null;
    }

    reviews[index].response = {
        sellerId,
        sellerName,
        message,
        respondedAt: new Date().toISOString(),
    };

    saveReviews(reviews);
    toast.success('Response added successfully!');
    return reviews[index];
}

// Vote helpful
export function voteHelpful(reviewId: string, userId: string): ProductReview | null {
    const reviews = getAllReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);

    if (index === -1) {
        toast.error('Review not found');
        return null;
    }

    // Check if user already voted
    const votes = getHelpfulVotes();
    const voteKey = `${reviewId}_${userId}`;

    if (votes[voteKey]) {
        toast.info('You have already voted on this review');
        return reviews[index];
    }

    reviews[index].helpful += 1;
    saveReviews(reviews);

    // Save vote
    votes[voteKey] = 'helpful';
    localStorage.setItem(HELPFUL_VOTES_KEY, JSON.stringify(votes));

    toast.success('Thank you for your feedback!');
    return reviews[index];
}

// Vote not helpful
export function voteNotHelpful(reviewId: string, userId: string): ProductReview | null {
    const reviews = getAllReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);

    if (index === -1) {
        toast.error('Review not found');
        return null;
    }

    // Check if user already voted
    const votes = getHelpfulVotes();
    const voteKey = `${reviewId}_${userId}`;

    if (votes[voteKey]) {
        toast.info('You have already voted on this review');
        return reviews[index];
    }

    reviews[index].notHelpful += 1;
    saveReviews(reviews);

    // Save vote
    votes[voteKey] = 'not_helpful';
    localStorage.setItem(HELPFUL_VOTES_KEY, JSON.stringify(votes));

    return reviews[index];
}

// Get helpful votes
function getHelpfulVotes(): { [key: string]: string } {
    const stored = localStorage.getItem(HELPFUL_VOTES_KEY);
    if (!stored) return {};
    try {
        return JSON.parse(stored);
    } catch {
        return {};
    }
}

// Calculate ratings summary
export function calculateRatingsSummary(productId: string): RatingsSummary {
    const reviews = getProductReviews(productId);

    if (reviews.length === 0) {
        return {
            productId,
            averageRating: 0,
            totalReviews: 0,
            ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            verifiedPurchases: 0,
            recommendationPercentage: 0,
        };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingBreakdown = {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
    };

    const verifiedPurchases = reviews.filter((r) => r.verified).length;

    // Recommendation percentage (4 and 5 star reviews)
    const recommendedReviews = reviews.filter((r) => r.rating >= 4).length;
    const recommendationPercentage = (recommendedReviews / reviews.length) * 100;

    return {
        productId,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: reviews.length,
        ratingBreakdown,
        verifiedPurchases,
        recommendationPercentage: Math.round(recommendationPercentage),
    };
}

// Get top reviews (most helpful)
export function getTopReviews(productId: string, limit: number = 5): ProductReview[] {
    const reviews = getProductReviews(productId);
    return reviews
        .sort((a, b) => b.helpful - a.helpful)
        .slice(0, limit);
}

// Get recent reviews
export function getRecentReviews(productId: string, limit: number = 5): ProductReview[] {
    const reviews = getProductReviews(productId);
    return reviews
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}

// Get reviews by rating
export function getReviewsByRating(productId: string, rating: number): ProductReview[] {
    const reviews = getProductReviews(productId);
    return reviews.filter((r) => r.rating === rating);
}

// Get verified reviews
export function getVerifiedReviews(productId: string): ProductReview[] {
    const reviews = getProductReviews(productId);
    return reviews.filter((r) => r.verified);
}

// Search reviews
export function searchReviews(productId: string, query: string): ProductReview[] {
    const reviews = getProductReviews(productId);
    const lowerQuery = query.toLowerCase();

    return reviews.filter(
        (r) =>
            r.title.toLowerCase().includes(lowerQuery) ||
            r.comment.toLowerCase().includes(lowerQuery) ||
            r.buyerName.toLowerCase().includes(lowerQuery)
    );
}

// Check if user can review product (has purchased it)
export function canReviewProduct(productId: string, buyerId: string): boolean {
    // This would check order history in a real app
    // For demo, we'll allow all reviews
    const reviews = getAllReviews();
    const hasReviewed = reviews.some(
        (r) => r.productId === productId && r.buyerId === buyerId
    );
    return !hasReviewed;
}
