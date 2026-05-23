interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContent({ children, className = "" }: PageContentProps) {
  return (
    <div className={`pb-24 lg:pb-8 ${className}`}>
      {children}
    </div>
  );
}
