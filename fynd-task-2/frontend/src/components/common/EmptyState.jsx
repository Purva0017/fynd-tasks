import { FileText } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = FileText, 
  title = 'No data', 
  description = 'No items to display' 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted max-w-md">{description}</p>
    </div>
  );
}
