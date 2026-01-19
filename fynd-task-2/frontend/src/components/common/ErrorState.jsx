import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Error</h3>
      <p className="text-muted mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
