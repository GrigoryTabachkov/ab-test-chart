import React, { useMemo, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { LineSeries } from '@nivo/line';
import type { RawData } from '../types';
import { processData } from '../utils/dataProcessor';
import { useStore } from '../store/useStore';
import { useZoom } from '../hooks/useZoom';
import styles from './Chart.module.css';

type ChartPoint = {
  x: string;
  [key: string]: string | number | undefined;
};

const Chart: React.FC = () => {
  const { theme, timeframe, chartMode, selectedVariations, zoomKey } = useStore();
  const rawData = useStore(s => s.rawData) as RawData;

  const processedData = useMemo(
    () => processData(rawData, timeframe),
    [rawData, timeframe]
  );

  const visibleData = useMemo<ChartPoint[]>(() => {
    return processedData.map(p => {
      const point: ChartPoint = { x: p.x };
      selectedVariations.forEach(v => {
        if (v in p) point[v] = p[v] as number;
      });
      return point;
    });
  }, [processedData, selectedVariations]);

  const nivoData: LineSeries[] = useMemo(
    () =>
      selectedVariations.map(id => ({
        id,
        data: visibleData.map(d => ({
          x: d.x,
          y: (d[id] as number ?? 0),
        })),
      })),
    [visibleData, selectedVariations]
  );

  const yMax =
    Math.max(
      ...visibleData.flatMap(d =>
        selectedVariations.map(v => (d[v] as number ?? 0))
      )
    ) * 1.1 || 10;

  const { containerRef, zoomLevel, panOffset, reset } = useZoom();

useEffect(() => {
  const unsubscribe = useStore.subscribe(() => {
    reset();
  });
  return () => unsubscribe();
}, [reset]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '560px',
        overflow: 'hidden',
        position: 'relative',
        cursor: zoomLevel > 1 ? 'grab' : 'default',
        borderRadius: '16px',
        background: 'var(--chart-bg, #ffffff)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${100 * zoomLevel}%`,
          height: '100%',
          transform: `translateX(-${panOffset}px) scaleX(${zoomLevel})`,
          transformOrigin: 'left center',
          transition: 'transform 0.12s ease-out',
        }}
      >
        <ResponsiveLine
          key={zoomKey}
          data={nivoData}
          margin={{ top: 50, right: 130, bottom: 70, left: 70 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: yMax }}
          yFormat=" >-.2f"
          axisBottom={{
            legend: timeframe === 'week' ? 'Weeks' : 'Date',
            legendOffset: 40,
            legendPosition: 'middle',
          }}
          axisLeft={{
            legend: 'Conversion Rate %',
            legendOffset: -55,
            legendPosition: 'middle',
            format: v => `${v}%`,
          }}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          enableArea={chartMode === 'area'}
          areaOpacity={0.15}
          curve={chartMode === 'smooth' ? 'monotoneX' : 'linear'}
          enableCrosshair
          crosshairType="x"
          useMesh
          animate
          motionConfig="gentle"
          theme={{
            background: 'transparent',
            text: { fill: theme === 'dark' ? '#e0e0e0' : '#222' },
            grid: { line: { stroke: theme === 'dark' ? '#444' : '#e6e6e6' } },
            tooltip: {
              container: {
                background: theme === 'dark' ? '#1e1e1e' : '#fff',
                color: theme === 'dark' ? '#e0e0e0' : '#222',
                borderRadius: '10px',
                padding: '10px 14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              },
            },
          }}
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              translateX: 100,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 14,
            },
          ]}
          tooltip={({ point }) => {
            const date = point.data.x as string;
            const row = visibleData.find(d => d.x === date);

            return (
              <div className={`${styles.tooltip} ${theme === 'dark' ? styles.dark : ''}`}>
                <strong>{date}</strong>
                {selectedVariations.map(v => (
                  <div key={v}>
                    <span style={{ color: point.seriesId === v ? point.color : '#888' }}>●</span>{' '}
                    {v}: <strong>{Number(row?.[v] ?? 0).toFixed(2)}%</strong>
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Chart;