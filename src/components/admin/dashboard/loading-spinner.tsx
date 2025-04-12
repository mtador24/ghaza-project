
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
        <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
      </div>
    </div>
  );
}
