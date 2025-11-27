import { useRef } from 'react';
import Chart from './components/Chart';
import { Controls } from './components/Controls';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const theme = useStore(s => s.theme);
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>A/B Test Conversion Rate Chart</h1>
      </header>

      <Controls />

      <main ref={chartRef} >
        <Chart />
      </main>

      <footer>
        React + TypeScript + @nivo/line
      </footer>
    </div>
  );
}

export default App;
