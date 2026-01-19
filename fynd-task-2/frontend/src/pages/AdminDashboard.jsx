import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Star,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { StarDisplay } from '../components/common/StarRating';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { useAdminReviews, useAdminAnalytics } from '../hooks/useApi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useToast } from '../hooks/useToast';

const CHART_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

const PAGE_SIZES = [10, 25, 50, 100];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Filters state
  const [filters, setFilters] = useState({
    rating: '',
    search: '',
    limit: 25,
    offset: 0,
  });

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, offset: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Queries
  const analyticsQuery = useAdminAnalytics();
  const reviewsQuery = useAdminReviews(filters);

  // Handle unauthorized errors
  useEffect(() => {
    if (reviewsQuery.error?.response?.status === 401 || analyticsQuery.error?.response?.status === 401) {
      toast.error({
        title: 'Unauthorized',
        description: 'Your session has expired. Please login again.',
      });
      sessionStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  }, [reviewsQuery.error, analyticsQuery.error, navigate, toast]);

  // Pagination
  const totalPages = Math.ceil((reviewsQuery.data?.total || 0) / filters.limit);
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      offset: (page - 1) * prev.limit,
    }));
  };

  const handleLimitChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      offset: 0,
    }));
  };

  const handleRatingFilter = (e) => {
    setFilters((prev) => ({
      ...prev,
      rating: e.target.value,
      offset: 0,
    }));
  };

  // Prepare chart data
  const chartData = analyticsQuery.data
    ? Object.entries(analyticsQuery.data.countByRating || {}).map(([rating, count]) => ({
        rating: `${rating} Star`,
        count,
        fill: CHART_COLORS[parseInt(rating) - 1],
      }))
    : [];

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-secondary">Monitor and manage customer feedback</p>
        </div>

        {/* Analytics Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analytics Overview
          </h2>

          {analyticsQuery.isError ? (
            <ErrorState
              message={analyticsQuery.error?.friendlyMessage || 'Failed to load analytics'}
              onRetry={() => analyticsQuery.refetch()}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {/* Total Card */}
              <Card className="lg:col-span-2">
                <CardContent className="pt-6">
                  {analyticsQuery.isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted mb-1">Total Submissions</p>
                      <p className="text-4xl font-bold text-foreground">
                        {analyticsQuery.data?.total?.toLocaleString() || 0}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Rating Count Cards */}
              {[1, 2, 3, 4, 5].map((rating) => (
                <Card key={rating}>
                  <CardContent className="pt-6">
                    {analyticsQuery.isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 mb-1">
                          <Star
                            className="h-4 w-4"
                            style={{ fill: CHART_COLORS[rating - 1], color: CHART_COLORS[rating - 1] }}
                          />
                          <span className="text-sm text-muted">{rating} Star</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                          {analyticsQuery.data?.countByRating?.[rating]?.toLocaleString() || 0}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bar Chart */}
          {!analyticsQuery.isError && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Ratings Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsQuery.isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="rating" className="text-muted" />
                        <YAxis className="text-muted" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgb(var(--card))',
                            borderColor: 'rgb(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                          labelStyle={{ color: 'rgb(var(--text))' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Reviews Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Reviews
          </h2>

          {/* Filters */}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <Input
                      placeholder="Search reviews..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="w-full md:w-40">
                  <Select value={filters.rating} onChange={handleRatingFilter}>
                    <option value="">All Ratings</option>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Page Size */}
                <div className="w-full md:w-32">
                  <Select value={filters.limit} onChange={handleLimitChange}>
                    {PAGE_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size} per page
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Refresh */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => reviewsQuery.refetch()}
                  disabled={reviewsQuery.isFetching}
                >
                  <RefreshCcw className={`h-4 w-4 ${reviewsQuery.isFetching ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          {reviewsQuery.isError ? (
            <ErrorState
              message={reviewsQuery.error?.friendlyMessage || 'Failed to load reviews'}
              onRetry={() => reviewsQuery.refetch()}
            />
          ) : reviewsQuery.isLoading ? (
            <ReviewsSkeletons />
          ) : reviewsQuery.data?.items?.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={MessageSquare}
                  title="No reviews found"
                  description={
                    filters.search || filters.rating
                      ? 'Try adjusting your filters'
                      : 'No reviews have been submitted yet'
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <ReviewsTable reviews={reviewsQuery.data?.items || []} />
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {reviewsQuery.data?.items?.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted">
                  Showing {filters.offset + 1} to{' '}
                  {Math.min(filters.offset + filters.limit, reviewsQuery.data?.total || 0)} of{' '}
                  {reviewsQuery.data?.total || 0} reviews
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-foreground px-2">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

// Reviews Table Component
function ReviewsTable({ reviews }) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted">Rating</th>
              <th className="text-left p-4 text-sm font-medium text-muted">Review</th>
              <th className="text-left p-4 text-sm font-medium text-muted">AI Summary</th>
              <th className="text-left p-4 text-sm font-medium text-muted">Actions</th>
              <th className="text-left p-4 text-sm font-medium text-muted">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted">Created</th>
              <th className="w-10 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <>
                <tr key={review.id} className="border-b border-border hover:bg-accent/50">
                  <td className="p-4">
                    <StarDisplay value={review.rating} />
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="text-sm text-foreground truncate" title={review.review}>
                      {review.review.substring(0, 100)}
                      {review.review.length > 100 ? '...' : ''}
                    </p>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="text-sm text-secondary truncate" title={review.aiSummary}>
                      {review.aiSummary?.substring(0, 80) || '-'}
                      {review.aiSummary?.length > 80 ? '...' : ''}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {review.aiActions?.slice(0, 2).map((action, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                      {review.aiActions?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{review.aiActions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="p-4 text-sm text-muted whitespace-nowrap">
                    {format(new Date(review.createdAt), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="p-4">
                    {(review.status === 'FAILED' || review.review.length > 100 || review.aiActions?.length > 2) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(review.id)}
                      >
                        {expandedRows.has(review.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
                {expandedRows.has(review.id) && (
                  <tr key={`${review.id}-expanded`} className="bg-accent/30">
                    <td colSpan={7} className="p-4">
                      <ExpandedContent review={review} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Review Card Component (Mobile)
function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <StarDisplay value={review.rating} />
          <StatusBadge status={review.status} />
        </div>

        <p className="text-sm text-foreground">
          {expanded ? review.review : review.review.substring(0, 150)}
          {review.review.length > 150 && !expanded && '...'}
        </p>

        {review.aiSummary && (
          <div>
            <p className="text-xs font-medium text-muted mb-1">AI Summary</p>
            <p className="text-sm text-secondary">{review.aiSummary}</p>
          </div>
        )}

        {review.aiActions?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {review.aiActions.map((action, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {action}
              </Badge>
            ))}
          </div>
        )}

        {review.status === 'FAILED' && review.errorMessage && (
          <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Error</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">{review.errorMessage}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted">
            {format(new Date(review.createdAt), 'MMM d, yyyy HH:mm')}
          </span>
          {(review.review.length > 150 || review.status === 'FAILED') && (
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Expanded Content Component
function ExpandedContent({ review }) {
  return (
    <div className="space-y-4">
      {review.review.length > 100 && (
        <div>
          <p className="text-xs font-medium text-muted mb-1">Full Review</p>
          <p className="text-sm text-foreground">{review.review}</p>
        </div>
      )}

      {review.aiActions?.length > 2 && (
        <div>
          <p className="text-xs font-medium text-muted mb-2">All Actions</p>
          <div className="flex flex-wrap gap-1">
            {review.aiActions.map((action, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {action}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {review.status === 'FAILED' && review.errorMessage && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Error Message</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">{review.errorMessage}</p>
        </div>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const variants = {
    PENDING: 'warning',
    PROCESSING: 'secondary',
    COMPLETED: 'success',
    FAILED: 'destructive',
  };

  return (
    <Badge variant={variants[status] || 'outline'}>
      {status}
    </Badge>
  );
}

// Loading Skeletons
function ReviewsSkeletons() {
  return (
    <Card>
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </Card>
  );
}
