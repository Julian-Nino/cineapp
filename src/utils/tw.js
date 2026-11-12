/** Clases de Tailwind reutilizadas en todos los módulos de tabla */

export const tw = {
  // Botones
  btnPrimary:    'inline-flex items-center gap-2 px-4 py-2 bg-[#e50914] hover:bg-[#b2070f] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50',
  btnSecondary:  'inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50',
  btnDanger:     'inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/15 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50',
  btnEdit:       'inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-lg text-xs font-semibold transition-colors',

  // Form
  label:         'block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5',
  input:         'w-full bg-zinc-800 border border-zinc-700 text-white px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/10 placeholder:text-zinc-500 transition font-[inherit]',
  inputError:    'w-full bg-zinc-800 border border-red-500 text-white px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 placeholder:text-zinc-500 transition font-[inherit]',
  errorMsg:      'flex items-center gap-1 text-xs text-red-500 mt-1',
  formGroup:     'mb-4',
  formRow:       'grid grid-cols-2 gap-4',

  // Badges
  badgeActive:   'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/25',
  badgeInactive: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-700/50 text-zinc-400 border border-zinc-700/50',
  badgePelicula: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25',
  badgeSerie:    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/25',
  badgeTipo:     'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/25',

  // Table
  tableWrapper:  'bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden',
  actionBar:     'flex items-center justify-between px-5 py-4 border-b border-zinc-800',
  searchWrap:    'relative',
  searchIcon:    'absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none',
  searchInput:   'bg-zinc-800 border border-zinc-700 text-white pl-9 pr-3 py-2 rounded-lg text-sm w-60 outline-none focus:border-[#e50914] placeholder:text-zinc-500 transition',
  th:            'px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 bg-white/[0.02]',
  td:            'px-5 py-3.5 text-sm border-b border-zinc-800/50 align-middle',
  trBody:        'hover:bg-white/[0.02] transition-colors',

  // Page
  pageHeader:    'flex items-center justify-between mb-6',
  pageTitle:     'text-2xl font-extrabold',
  pageSubtitle:  'text-sm text-zinc-400 mt-0.5',
};

