import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useThemeMode } from '@/stores/theme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data?: ChartData<'doughnut'>; // Make data optional to handle empty state
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  console.log({ data });
  const { isDark } = useThemeMode();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          padding: 20,
          color: isDark ? 'white' : 'black',
        },
      },
      tooltip: {
        enabled: data?.labels?.length,
        callbacks: {
          label(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  // If no data is passed, show an empty doughnut chart
  const emptyData = {
    labels: ['Empty'],
    empty: true,
    datasets: [
      {
        data: [100], // Single value filling the entire chart
        backgroundColor: ['#e0e0e0'], // Gray color for the empty chart
        borderWidth: 4,
        borderColor: !isDark ? 'white' : 'rgb(18,18,18)',
      },
    ],
  };

  const modifiedData =
    data && data?.labels?.length
      ? {
          ...data,
          empty: false,
          datasets: data.datasets.map((dataset) => ({
            ...dataset,
            borderWidth: 4,
            borderColor: !isDark ? 'white' : 'rgb(18,18,18)',
          })),
        }
      : emptyData;

  console.log({ modifiedData });
  return (
    <Doughnut
      data={modifiedData}
      // @ts-ignore
      options={
        !modifiedData?.empty
          ? options
          : {
              ...options,
              plugins: { ...options.plugins, legend: { display: false } },
            }
      }
      width={400}
      height={400}
    />
  );
};

export default DonutChart;
