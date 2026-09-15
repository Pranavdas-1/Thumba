import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showCount?: boolean;
};

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
}: RatingStarsProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1.5 text-ink-700">
      <div className="flex items-center text-gold-600" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? "fill-gold-600 text-gold-600"
                : "fill-ivory-200 text-ivory-300"
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs tracking-tight text-ink-500">
          {rating.toFixed(1)} {reviewCount !== undefined && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
}
