interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const glassCardClasses = 'bg-gray-900/75 backdrop-blur-xl border border-white/10 shadow-lg';

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`${glassCardClasses} px-5 py-2.5 rounded-lg text-gray-100 hover:bg-gray-900/85 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium`}
      >
        Previous
      </button>
      
      <span className="text-gray-900 text-sm font-semibold bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${glassCardClasses} px-5 py-2.5 rounded-lg text-gray-100 hover:bg-gray-900/85 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium`}
      >
        Next
      </button>
    </div>
  );
};

