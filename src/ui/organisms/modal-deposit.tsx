import Stack from '@mui/material/Stack';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import useInput from '@/hooks/use-input';
import useDeposit from '@/hooks/use-deposit';
import useLoans from '@/hooks/use-loans';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';

export default function DepositModalMolecule(
  props: IPoolWithUnderlying | undefined,
) {
  const inInputProps = useInput(props?.underlying?.address);
  const { handleDeposit, isSuccess, button, expected } = useDeposit({
    ...inInputProps,
    asset: props?.asset,
    pool: props?.address,
  });
  const { loans, isLoading } = useLoans(props?.loans?.map((l) => l.address));

  return (
    <ModalAtom
      title="Deposit"
      buttonProps={{
        children: 'Deposit',
        variant: 'outlined',
      }}
      // TODO: leave modal open for 4 seconds
      onClose={inInputProps.clearInput}
      closeWhen={isSuccess}
    >
      <Stack gap={2}>
        <AssetInputMolecule
          {...inInputProps}
          address={props?.underlying?.address}
          type="In"
        />
        <AssetInputMolecule
          address={props?.address}
          type="Out"
          value={expected.loading ? ' ' : expected.out.normalized}
          loading={+expected.loading}
        />
        <TxFeesAtom
          function="deposit"
          in={props?.underlying?.address}
          out={props?.address}
          fee={expected.fee.raw}
          loading={+expected.loading}
          pool={{
            loading: isLoading,
            apy: props?.apy?.normalized,
            collateral: loans?.map((l) => l.collateralToken),
          }}
        />
        <Web3Button
          onClick={handleDeposit}
          size="large"
          variant="contained"
          disabled={button.disabled}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
