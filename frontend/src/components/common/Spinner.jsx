export default function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center p-8 ${className}`}>
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}