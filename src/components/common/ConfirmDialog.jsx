export default function ConfirmDialog({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div
      className="anim-overlay fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-5"
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div className="anim-modal bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl">
        <div className="px-6 py-8 text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center text-2xl mx-auto mb-4">
            🗑️
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {title || '¿Estás seguro?'}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {message || 'Esta acción no se puede deshacer.'}
          </p>
        </div>
        <div className="flex justify-center gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-red-500/15 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
