import { useThemeMode } from '@/stores/theme';
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  getProtocolExposureData,
  getTokenExposureData,
} from '@/utils/helpers/charts';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import DonutChart from './donut-charts';

const ExposureCharts = ({
  pool,
}: {
  pool: IPoolWithUnderlying | undefined;
}) => {
  const { isDark } = useThemeMode();
  const [protocolData, setProtocolData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isChartsDataLoading, setIsChartsDataLoading] = useState(true);

  useEffect(() => {
    if (pool) {
      try {
        setIsChartsDataLoading(true);

        const protocolExposureData = getProtocolExposureData(pool);
        const tokenExposureData = getTokenExposureData(pool);

        setProtocolData(protocolExposureData);
        setTokenData(tokenExposureData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsChartsDataLoading(false);
      }
    }
  }, [pool]);

  return (
    <Grid
      container
      spacing={0}
      justifyContent="space-around"
      style={{
        background: isDark ? '#202426' : '#f0f2f6',
        borderRadius: '0.25rem',
      }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          height: !isChartsDataLoading ? '350px' : '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: {
            sm: 'flex-start',
            md: 'center',
          },
          padding: isChartsDataLoading ? '16px' : '4rem 2rem',
        }}
      >
        <DonutChart data={protocolData} isLoading={isChartsDataLoading} />
        <Typography
          variant="h6"
          mt={{
            xs: 2,
            md: 6,
          }}
          mb={{ xs: 16, md: 0 }}
        >
          Protocol Exposure
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          height: !isChartsDataLoading ? '350px' : '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: {
            sm: 'flex-start',
            md: 'center',
          },
          padding: isChartsDataLoading ? '16px' : '4rem 2rem',
        }}
      >
        <DonutChart data={tokenData} isLoading={isChartsDataLoading} />

        <Typography
          variant="h6"
          mt={{
            xs: 2,
            md: 6,
          }}
          mb={{ xs: 8, md: 0 }}
        >
          Token Exposure
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ExposureCharts;
