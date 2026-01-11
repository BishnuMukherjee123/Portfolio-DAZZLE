interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
}

export const Badge = ({ children, variant = 'secondary', className = '' }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 hover:scale-110';
  
  const variantClasses = {
    default: 'bg-gray-900 dark:bg-white text-white dark:text-black',
    secondary: 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};