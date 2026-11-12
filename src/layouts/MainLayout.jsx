import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { isMock } from '../services/api';

const NAV = [
  { to: '/media',       icon: '🎬', label: 'Catálogo'    },
  { to: '/generos',     icon: '🏷️', label: 'Géneros'     },
  { to: '/directores',  icon: '🎥', label: 'Directores'  },
  { to: '/productoras', icon: '🏢', label: 'Productoras' },
  { to: '/tipos',       icon: '📋', label: 'Tipos'       },
];

const TITLES = {
  '/media':       'Catálogo de Media',
  '/generos':     'Géneros',
  '/directores':  'Directores',
  '/productoras': 'Productoras',
  '/tipos':       'Tipos de Contenido',
};

export default function MainLayout() {
  const { pathname } = useLocation();
  const title    = TITLES[pathname] || 'CineApp';
  const mockMode = isMock();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* ── SIDEBAR ── */}
      <aside className="w-60 shrink-0 bg-black border-r border-zinc-800 flex flex-col fixed top-0 left-0 h-screen z-40 overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-zinc-800">
          <div className="w-9 h-9 bg-[#e50914] rounded-lg flex items-center justify-center text-lg shrink-0">
            🎬
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Cine<span className="text-[#e50914]">App</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="px-2 py-4 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-2 mb-2">
            Menú
          </p>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                  isActive
                    ? 'bg-[#e50914]/15 text-[#e50914] font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <span className="text-base w-5 text-center">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-zinc-800">
          <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600">
            <span className="text-base w-5 text-center">⚙️</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">

        {/* Navbar */}
        <nav className="h-[60px] bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-lg font-bold">{title}</h1>
          <div>
            {mockMode ? (
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="anim-pulse w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Modo Mock
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="anim-pulse w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                API Live
              </div>
            )}
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
