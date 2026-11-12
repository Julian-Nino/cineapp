export default function Modal({ title, onClose, children, footer, size = '' }) {
  const maxW = size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div
      className="anim-overlay fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-5"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`anim-modal bg-zinc-900 border border-zinc-800 rounded-xl w-full ${maxW} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-base"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-zinc-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
