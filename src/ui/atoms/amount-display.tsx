import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type IAmountDisplay = {
  symbol?: string;
  children: string | number;
};

export default function AmountDisplay(props: IAmountDisplay) {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Typography fontFamily="monospace">{props.children}</Typography>
      {props.symbol ? <Typography>{props.symbol}</Typography> : null}
    </Stack>
  );
}
