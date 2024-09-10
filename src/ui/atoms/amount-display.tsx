import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { round } from '@augustdigital/sdk';
import Tooltip from '@mui/material/Tooltip';

type IAmountDisplay = {
  symbol?: string;
  children: string | number;
  round?: boolean;
  size?: `${string}px`;
};

export default function AmountDisplay(props: IAmountDisplay) {
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
        <span style={{ fontSize: props?.size || '18px' }}>
          <span style={{ fontFamily: 'monospace' }}>
            {round(props.children)}
          </span>
          {props.symbol ? <span> {props.symbol}</span> : null}
        </span>
      </Tooltip>
    );
  }
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Typography fontFamily="monospace" fontSize={props?.size}>
        {props.children}
      </Typography>
      {props.symbol ? (
        <Typography fontSize={props?.size}>{props.symbol}</Typography>
      ) : null}
    </Stack>
  );
}
