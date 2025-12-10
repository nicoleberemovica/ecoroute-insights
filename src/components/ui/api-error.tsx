import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ApiErrorProps {
  error: string;
  onRetry?: () => void;
}

export function ApiError({ error, onRetry }: ApiErrorProps) {
  const isLimitExceeded = error === "API_LIMIT_EXCEEDED";

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-destructive">
            {isLimitExceeded ? "API Usage Limit Reached" : "Error Processing Request"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLimitExceeded
              ? "You've reached the maximum API calls for the free tier. Please upgrade your Kith API plan to continue using this feature."
              : error}
          </p>
          {onRetry && !isLimitExceeded && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}