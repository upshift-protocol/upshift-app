import { useThemeMode } from '@/stores/theme';
import { Grid, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
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
  const [isChartsDataLoading, setIsChartsDataLoading] = useState(true);

  const chartData = useMemo(() => {
    const returnObj: any = { protocolExposure: null, tokenExposure: null };
    if (pool?.address) {
      setIsChartsDataLoading(true);
      try {
        returnObj.protocolExposure = getProtocolExposureData(pool);
        returnObj.tokenExposure = getTokenExposureData(pool);
      } catch (error) {
        console.error('chartData:', error);
      } finally {
        setIsChartsDataLoading(false);
      }
    }
    return returnObj;
  }, [pool?.address]);

  return (
    <Grid
      container
      spacing={0}
      justifyContent="space-around"
      mt={{
        xs: 4,
        lg: 6,
      }}
    >
      <Grid
        item
        style={{
          position: 'relative',
          background: isDark ? '#202426' : '#f0f2f6',
        }}
        xs={12}
        sm={6}
        sx={{
          height: !isChartsDataLoading ? '280px' : '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: {
            sm: 'flex-start',
            md: 'center',
          },
          padding: isChartsDataLoading ? '2rem' : '2%',
          borderRadius: {
            xs: '0.25rem',
            sm: '0',
          },
          borderTopLeftRadius: { xs: '0', sm: '0.25rem' },
          borderBottomLeftRadius: { xs: '0', sm: '0.25rem' },
        }}
      >
        <Typography
          sx={{
            position: 'absolute',
            top: { xs: '-4rem', md: '-6rem' },
            left: '0',
            mt: { xs: 1, md: 5 },
            mb: { xs: 20, md: 0 },
          }}
          variant="h6"
        >
          Protocol Exposure
        </Typography>

        <DonutChart
          data={chartData.protocolExposure}
          isLoading={isChartsDataLoading}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          height: !isChartsDataLoading ? '280px' : '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: {
            sm: 'flex-start',
            md: 'center',
          },
          padding: isChartsDataLoading ? '2rem' : '2%',
          position: 'relative',
          background: isDark ? '#202426' : '#f0f2f6',
          borderRadius: {
            xs: '0.25rem',
            sm: '0',
          },
          borderTopRightRadius: { xs: '0', sm: '0.25rem' },
          borderBottomRightRadius: { xs: '0', sm: '0.25rem' },
        }}
        mt={{
          xs: 12,
          sm: 0,
        }}
      >
        <DonutChart
          data={chartData.tokenExposure}
          isLoading={isChartsDataLoading}
        />

        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            top: { xs: '-4rem', md: '-6rem' },
            left: '0',
            mt: { xs: 1, md: 5 },
            mb: { xs: 20, md: 0 },
          }}
        >
          Token Exposure
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ExposureCharts;
