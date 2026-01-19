import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StarRating({ value, onChange, disabled = false, size = 'default' }) {
  const sizes = {
    sm: 'h-5 w-5',
    default: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const gaps = {
    sm: 'gap-1',
    default: 'gap-1',
    lg: 'gap-2',
    xl: 'gap-3',
  };

  return (
    <div className={cn('flex', gaps[size] || gaps.default)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onChange?.(star)}
          disabled={disabled}
          className={cn(
            'transition-all duration-200 hover:scale-110 focus:outline-none focus:scale-110',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <Star
            className={cn(
              sizes[size] || sizes.default,
              'transition-colors drop-shadow-sm',
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-gray-300 dark:text-gray-600 hover:text-yellow-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({ value, size = 'sm' }) {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizes[size],
            star <= value
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-transparent text-gray-300 dark:text-gray-600'
          )}
        />
      ))}
    </div>
  );
}
