import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowRight, CheckCircle, Zap, Plus, MessagesSquare } from 'lucide-react';
import { UserLayout } from '../components/layout/UserLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { StarRating } from '../components/common/StarRating';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useSubmitReview } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';

const MAX_CHARS = 2000;
const MIN_CHARS = 10;

export function UserDashboard() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const { toast } = useToast();
  const submitMutation = useSubmitReview();

  const validate = () => {
    const newErrors = {};
    
    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!review.trim()) {
      newErrors.review = 'Please enter your feedback';
    } else if (review.trim().length < MIN_CHARS) {
      newErrors.review = `Please enter at least ${MIN_CHARS} characters`;
    } else if (review.length > MAX_CHARS) {
      newErrors.review = `Review must be ${MAX_CHARS} characters or less`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const response = await submitMutation.mutateAsync({
        rating,
        review: review.trim(),
      });
      
      setResult(response);
      toast.success({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback!',
      });
    } catch (error) {
      toast.error({
        title: 'Submission Failed',
        description: error.friendlyMessage || 'Failed to submit feedback. Please try again.',
      });
    }
  };

  const handleSubmitAnother = () => {
    setResult(null);
    setRating(0);
    setReview('');
    setErrors({});
  };

  const handleReviewChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setReview(value);
      if (errors.review) {
        setErrors((prev) => ({ ...prev, review: undefined }));
      }
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const charCount = review.trim().length;
  const charsNeeded = MIN_CHARS - charCount;

  // Success View - Show after submission
  if (result) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center px-4 py-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Card className="w-full max-w-lg">
            <CardContent className="pt-10 pb-8 px-8">
              {/* Success Icon */}
              <div className="flex justify-center mb-5">
                <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Thank You Message */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Thank you!
                </h1>
                <p className="text-secondary">
                  Your feedback has been submitted
                </p>
              </div>

              {/* AI Response Card */}
              <div className="bg-background-secondary rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    AI Response
                  </span>
                </div>
                <p className="text-foreground leading-relaxed">
                  {result.aiResponse}
                </p>
              </div>

              {/* Submit Another Button */}
              <Button
                onClick={handleSubmitAnother}
                variant="outline"
                className="w-full h-12 text-base"
              >
                <Plus className="h-5 w-5 mr-2" />
                Submit Another
              </Button>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <p className="text-xs text-muted mt-6">
            Powered by AI · Responses generated in real-time
          </p>
        </div>
      </UserLayout>
    );
  }

  // Feedback Form View
  return (
    <UserLayout>
      <div className="flex flex-col items-center justify-center px-4 py-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Card className="w-full max-w-lg">
          <CardContent className="pt-8 pb-7 px-8">
            {/* Header Icon */}
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessagesSquare className="h-7 w-7 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                How was your experience?
              </h1>
              <p className="text-secondary">
                We'd love to hear your thoughts
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating - In a pill container */}
              <div className="flex flex-col items-center">
                <div className="bg-background-secondary rounded-full px-8 py-4">
                  <StarRating
                    value={rating}
                    onChange={handleRatingChange}
                    disabled={submitMutation.isPending}
                    size="xl"
                  />
                </div>
                <p className="mt-3 text-sm text-muted">
                  {errors.rating ? (
                    <span className="text-destructive">{errors.rating}</span>
                  ) : rating > 0 ? (
                    <>
                      {rating === 1 && 'Very Poor'}
                      {rating === 2 && 'Poor'}
                      {rating === 3 && 'Average'}
                      {rating === 4 && 'Good'}
                      {rating === 5 && 'Excellent'}
                    </>
                  ) : (
                    'Select a rating'
                  )}
                </p>
              </div>

              {/* Review Text */}
              <div>
                <Textarea
                  value={review}
                  onChange={handleReviewChange}
                  placeholder="Share your thoughts with us..."
                  disabled={submitMutation.isPending}
                  className="min-h-[120px] text-base resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted">
                    {charsNeeded > 0 ? `${charsNeeded} more characters` : ''}
                  </span>
                  <span className="text-xs text-muted">
                    {charCount}
                  </span>
                </div>
                {errors.review && (
                  <p className="mt-1 text-sm text-destructive">{errors.review}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full h-12 text-base"
              >
                {submitMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-muted mt-6">
          Powered by AI · Responses generated in real-time
        </p>
      </div>
    </UserLayout>
  );
}
