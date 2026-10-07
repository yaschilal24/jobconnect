const map = {
  APPLIED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-700',
  SHORTLISTED: 'bg-purple-100 text-purple-700',
  INTERVIEW: 'bg-indigo-100 text-indigo-700',
  SELECTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-200 text-gray-700',
  PENDING: 'bg-amber-100 text-amber-700',
  VERIFIED: 'bg-green-100 text-green-700',
  OPEN: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-200 text-gray-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${map[status] || 'bg-gray-100 text-gray-700'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}