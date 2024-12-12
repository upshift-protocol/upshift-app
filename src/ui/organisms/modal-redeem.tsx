import Stack from '@mui/material/Stack';
import type { IChainId, IPoolWithUnderlying } from '@augustdigital/sdk';
import useWithdraw from '@/hooks/use-withdraw';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import UpcomingRedemptionsMolecule from '../molecules/upcoming-redemptions';

export default function RedeemModalMolecule(props?: IPoolWithUnderlying) {
  const {
    handleWithdraw,
    isSuccess,
    button,
    pool,
    isLoading,
    selectedRedemption,
  } = useWithdraw({
    asset: props?.asset,
    pool: props?.address,
    poolName: props?.name,
    value: (props as any)?.redeemable?.normalized, // TODO: add type interface
    redemptions: (props as any)?.availableRedemptions,
    chainId: props?.chainId as IChainId,
  });

  return (
    <ModalAtom
      title="Redeem"
      buttonProps={{
        children: 'Redeem',
        variant: 'contained',
        color: 'primary',
        disabled: !props?.address,
      }}
      closeWhen={isSuccess}
    >
      <Stack spacing={2} position="relative">
        <AssetInputMolecule
          address={props?.address}
          type="Out"
          value={(props as any)?.redeemable?.normalized}
          chainId={props?.chainId as IChainId}
        />
        <UpcomingRedemptionsMolecule
          redemptions={(props as any)?.availableRedemptions}
          loading={pool?.loading}
          asset={props?.symbol}
        />
        <Box pt={1}>
          <FormControl fullWidth>
            <InputLabel id="Selected-Redemption">
              Selected Redemption
            </InputLabel>
            <Select
              labelId="Selected-Redemption"
              value={selectedRedemption}
              label="Selected Redemption"
            >
              {(props as any)?.availableRedemptions?.map(
                (red: any, i: number) => (
                  <MenuItem key={`available-redemption-${i}`} value={red}>
                    {new Date(red.date).toLocaleDateString()}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack mt={1}>
        <Web3Button
          style={{ marginTop: '1rem' }}
          size="large"
          variant="contained"
          onClick={async (e) => {
            e.preventDefault();
            await handleWithdraw(selectedRedemption);
          }}
          disabled={button.disabled || pool?.loading}
          chainid={props?.chainId}
          loading={+isLoading}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
