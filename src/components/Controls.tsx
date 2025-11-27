import React from 'react';
import html2canvas from 'html2canvas';
import { useStore } from '../store/useStore';
import styles from './Controls.module.css';

const VARIATIONS = ['Original', 'Variation A', 'Variation B', 'Variation C'];

export const Controls: React.FC = () => {
  const {
    theme,
    toggleTheme,
    timeframe,
    setTimeframe,
    chartMode,
    setChartMode,
    selectedVariations,
    toggleVariation,
    resetZoom,
  } = useStore();

  const exportToPNG = async () => {
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      alert('Chart not ready yet');
      return;
    }

    try {
      const canvas = await html2canvas(mainElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        logging: false,
        width: mainElement.scrollWidth,
        height: mainElement.scrollHeight,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        foreignObjectRendering: false,
        ignoreElements: (el) =>
          el.classList?.contains('nivo-tooltip') || false,
      });

      const link = document.createElement('a');
      link.download = `ab-test-chart-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed — open DevTools console for details');
    }
  };

  return (
    <div className={styles.controls}>
      <div className={styles.group}>
        <strong>Variations</strong>
        {VARIATIONS.map((v) => (
          <label key={v} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedVariations.includes(v)}
              onChange={() => toggleVariation(v)}
            />
            {v}
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <strong>Timeframe</strong>
        <div className={styles.buttonGroup}>
          <button
            className={timeframe === 'day' ? styles.active : ''}
            onClick={() => setTimeframe('day')}
          >
            Day
          </button>
          <button
            className={timeframe === 'week' ? styles.active : ''}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <strong>Style</strong>
        <div className={styles.buttonGroup}>
          {(['line', 'smooth', 'area'] as const).map((m) => (
            <button
              key={m}
              className={chartMode === m ? styles.active : ''}
              onClick={() => setChartMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <button onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
        <button onClick={resetZoom}>Reset Zoom</button>
        <button onClick={exportToPNG}>Export PNG</button>
      </div>
    </div>
  );
};