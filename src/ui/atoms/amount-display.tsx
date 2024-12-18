import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { formatCompactNumber, formatUsd } from '@/utils/helpers/ui';
import { Chip } from '@mui/material';
import { usePricesStore } from '@/stores/prices';

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
  const { prices } = usePricesStore();
  const usdValue =
    prices?.data?.find((p) => p.symbol === props.symbol)?.price || 1;

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
              <Chip
                size="small"
                label={formatUsd(Number(props?.children) * usdValue)}
              />
            </Typography>
          ) : null}
          <Typography
            component={'span'}
            width={'fit-content'}
            whiteSpace={'nowrap'}
            fontSize={props?.size || '16px'}
          >
            <Typography component={'span'}>
              {formatCompactNumber(Number(props.children))}
            </Typography>
            {props.symbol ? (
              <Typography component={'span'}> {props.symbol}</Typography>
            ) : null}
          </Typography>
          {props?.usd && usdValue && direction === 'column' ? (
            <Typography component="span" variant="caption">
              {formatUsd(Number(props?.children) * usdValue)}
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
