import { Skeleton, Stack, Typography } from '@mui/material';
import type { INormalizedNumber } from '@augustdigital/sdk';
import BoxedListAtom from '../atoms/boxed-list';

type IUpcomingRedemptions = {
  redemptions?: {
    date: Date;
    amount: INormalizedNumber;
  }[];
  loading?: boolean;
  asset?: string;
};

export default function UpcomingRedemptionsMolecule(
  props: IUpcomingRedemptions,
) {
  function renderValue(value?: string) {
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
        items={
          props?.redemptions?.map((redemption) => ({
            value: `${renderValue(redemption.amount.normalized)} ${props?.asset || ''}`,
            label: `${renderValue(redemption.date.toLocaleDateString())}`,
          })) ?? []
        }
      />
    );
  }

  return (
    <Stack gap={1}>
      <Typography variant="body2">Available Redemptions</Typography>
      {renderList()}
    </Stack>
  );
}
