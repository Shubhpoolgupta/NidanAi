import Home from './components/Home';
import Aurora from './components/Aurora/Aurora';
import './App.css';

function App() {
  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen w-full py-8 px-4 bg-transparent overflow-x-hidden">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-red-500 mb-2">
          NidanAi
        </h1>
        <p className="text-lg text-slate-600">
          From data to clarity — simplifying medical jargon with intelligence.
        </p>
      </div>

      <Home />

      <div className="text-sm text-gray-500 mt-6 z-10 text-center max-w-xl">
        NidanAi explains reports in plain language. It is not medical advice —
        please consult your doctor about your results.
      </div>
    </div>
  );
}

export default App;