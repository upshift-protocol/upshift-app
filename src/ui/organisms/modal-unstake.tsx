import Stack from '@mui/material/Stack';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import useInput from '@/hooks/use-input';
import useUnStake from '@/hooks/use-unstake';
import type { IActiveStakePosition } from '@/utils/types';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';

export default function UnStakeModalMolecule(
  props: IActiveStakePosition | undefined,
) {
  const inInputProps = useInput(
    props?.stakingToken.address,
    props?.chainId as IChainId,
    {
      balance: props?.stakingToken.totalStaked?.raw
        ? BigInt(props?.stakingToken.totalStaked?.raw as string)
        : BigInt(0),
      decimals: props?.stakingToken?.decimals as number,
    },
  );
  const { handleUnStake, isSuccess, button, expected } = useUnStake({
    ...inInputProps,
    rewardDistributor: props?.rewardDistributor as IAddress,
    token: props?.stakingToken.address,
    name: props?.stakingToken.name,
    symbol: props?.stakingToken?.symbol,
    decimals: props?.stakingToken?.decimals,
    totalSupply: props?.stakingToken.totalSupply?.normalized,
    chainId: props?.chainId as IChainId,
    value: props?.stakingToken.totalStaked?.normalized,
  });

  return (
    <ModalAtom
      title="Unstake"
      buttonProps={{
        children: 'Unstake',
        variant: 'outlined',
        color: 'error',
        disabled: !props?.rewardDistributor,
      }}
      // TODO: leave modal open for 4 seconds
      onClose={inInputProps.clearInput}
      closeWhen={isSuccess}
    >
      <Stack gap={2}>
        <AssetInputMolecule
          {...inInputProps}
          address={props?.stakingToken?.address}
          type="Out"
          chainId={props?.chainId as IChainId}
          value={props?.stakingToken.totalStaked?.normalized}
        />
        <TxFeesAtom
          function="stake"
          in={props?.stakingToken?.address}
          out={props?.rewardDistributor}
          fee={BigInt(expected.fee.raw)}
          loading={+expected.loading}
          chainId={props?.chainId}
        />
      </Stack>
      <Stack mt={3}>
        <Web3Button
          onClick={handleUnStake}
          size="large"
          variant="contained"
          disabled={button.disabled}
          chainid={props?.chainId}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
