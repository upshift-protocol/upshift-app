import { toNormalizedBn, type IAddress } from '@augustdigital/sdk';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useGasPrice } from 'wagmi';
import BoxedListAtom from '../atoms/boxed-list';

type IUpcomingRedemptions = {
  contract?: IAddress;
  loading?: boolean;
};

export default function UpcomingRedemptionsMolecule(
  props: IUpcomingRedemptions,
) {
  const { data: gasPrice } = useGasPrice();
  const feeTotal = (gasPrice || BigInt(0)) * BigInt(0);

  function renderValue(value?: string | bigint) {
    if (props.loading)
      return (
        <Skeleton
          style={{ display: 'inline-block', transform: 'translateY(2px)' }}
          width="100px"
          variant="text"
          height="14px"
        />
      );
    return value ?? '-';
  }

  function renderList() {
    return (
      <BoxedListAtom
        items={[
          {
            label: 'Gas Fee',
            value: `${renderValue(toNormalizedBn(feeTotal)?.normalized)}} ETH`,
          },
        ]}
      />
    );
  }

  return (
    <Stack gap={1}>
      <Typography variant="body2">Upcoming Redemptions</Typography>
      {renderList()}
    </Stack>
  );
}
