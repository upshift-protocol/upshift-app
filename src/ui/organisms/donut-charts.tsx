import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useThemeMode } from '@/stores/theme';
import { Skeleton } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data?: ChartData<'doughnut'>;
  isLoading?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, isLoading }) => {
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
          usePointStyle: true,
          pointStyle: 'circle',
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
    cutout: '55%',
  };

  const emptyData = {
    labels: ['Empty'],
    empty: true,
    datasets: [
      {
        data: [100],
        backgroundColor: ['#e0e0e0'],
        borderWidth: 4,
        borderColor: !isDark ? '#f0f2f6' : '#202426',
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
            borderColor: !isDark ? '#f0f2f6' : '#202426',
          })),
        }
      : emptyData;

  if (isLoading)
    return (
      <Skeleton variant="circular" width={250} height={250} animation="wave" />
    );

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
    />
  );
};

export default DonutChart;
