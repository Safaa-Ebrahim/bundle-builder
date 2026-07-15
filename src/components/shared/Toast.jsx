import { FiCheckCircle } from 'react-icons/fi'

export default function Toast({ show, message }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-text-primary text-white text-sm font-medium px-4 py-3 rounded-lg shadow-card transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
    >
      <FiCheckCircle className="w-4 h-4 text-success shrink-0" />
      {message}
    </div>
  )
}
