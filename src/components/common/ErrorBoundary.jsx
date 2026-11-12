import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-bold mb-2">Ocurrió un error inesperado</h2>
            <p className="text-sm text-zinc-400 mb-4">
              La vista no pudo renderizarse debido a un problema con los datos recibidos.
            </p>
            {this.state.error && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-left mb-6 text-xs text-red-400 font-mono overflow-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-[#e50914] hover:bg-[#b2070f] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              🔄 Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

