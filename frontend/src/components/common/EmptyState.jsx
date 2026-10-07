export default function EmptyState({ title = 'Nothing here', message, icon = '📭' }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {message && <p className="text-gray-500 mt-1">{message}</p>}
    </div>
  );
}