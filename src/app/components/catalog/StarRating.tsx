import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
  showNumber = false
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const displayRating = hoveredRating || rating;

  const handleClick = (value: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readOnly && setHoveredRating(value)}
          onMouseLeave={() => !readOnly && setHoveredRating(0)}
          disabled={readOnly}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <svg
            className={`${sizeClasses[size]} transition-colors`}
            fill={value <= displayRating ? '#FCD34D' : 'none'}
            stroke={value <= displayRating ? '#FCD34D' : '#D1D5DB'}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {showNumber && (
        <span className="ml-1 text-sm text-[#6B7280]">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
