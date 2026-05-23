interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 py-4 md:flex-row md:items-center md:justify-between md:py-6">
      <div>
        <h1 className="text-h3 lg:text-h2 text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-small text-foreground-muted">{description}</p>
        )}
      </div>
      {actions && <div className="mt-3 flex gap-2 md:mt-0">{actions}</div>}
    </div>
  );
}
