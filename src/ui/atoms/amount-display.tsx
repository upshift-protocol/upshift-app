import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { formatCompactNumber } from '@/utils/helpers/ui';
import useFetcher from '@/hooks/use-fetcher';
import type { UseQueryResult } from '@tanstack/react-query';

type IAmountDisplay = {
  symbol?: string;
  children: string | number;
  round?: boolean;
  size?: `${string}px`;
  usd?: boolean;
  direction?: 'row' | 'column';
};

export default function AmountDisplay({
  direction = 'column',
  ...props
}: IAmountDisplay) {
  const { data: usdValue } = useFetcher({
    queryKey: ['price', props?.symbol || ''],
    enabled: !!props.symbol && props?.usd,
    initialData: '',
  }) as UseQueryResult<number>;

  if (props.round) {
    return (
      <Tooltip
        title={props.children}
        disableHoverListener={
          props.children === '0' || props.children === '0.0'
        }
        placement="top"
        arrow
      >
        <Stack
          display="flex"
          alignItems={direction === 'row' ? 'center' : 'end'}
          direction={direction}
          gap={direction === 'row' ? 1 : 0}
          component="span"
        >
          {props?.usd && usdValue && direction === 'row' ? (
            <Typography
              sx={{ opacity: '0.9' }}
              component="span"
              variant="caption"
            >
              ({' '}
              {formatCompactNumber(Number(props?.children) * usdValue, {
                symbol: true,
              })}{' '}
              )
            </Typography>
          ) : null}
          <Typography
            component={'span'}
            width={'fit-content'}
            whiteSpace={'nowrap'}
            fontSize={props?.size || '16px'}
          >
            <Typography component={'span'} fontFamily={'monospace'}>
              {formatCompactNumber(Number(props.children))}
            </Typography>
            {props.symbol ? (
              <Typography component={'span'}> {props.symbol}</Typography>
            ) : null}
          </Typography>
          {props?.usd && usdValue && direction === 'column' ? (
            <Typography component="span" variant="caption">
              {formatCompactNumber(Number(props?.children) * usdValue, {
                symbol: true,
              })}
            </Typography>
          ) : null}
        </Stack>
      </Tooltip>
    );
  }
  return (
    <Stack alignItems={'end'} direction={direction}>
      <Stack direction="row" gap={1} alignItems="center">
        <Typography
          fontFamily="monospace"
          component={'span'}
          fontSize={props?.size}
          whiteSpace={'nowrap'}
        >
          {props.children}
        </Typography>
        {props.symbol ? (
          <Typography component="span" fontSize={props?.size}>
            {props.symbol}
          </Typography>
        ) : null}
      </Stack>
      {props?.usd && usdValue ? (
        <Typography component="span" variant="caption">
          {formatCompactNumber(Number(props?.children) * usdValue, {
            symbol: true,
          })}
        </Typography>
      ) : null}
    </Stack>
  );
}
