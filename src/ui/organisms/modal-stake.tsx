import Stack from '@mui/material/Stack';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import useInput from '@/hooks/use-input';
import useStake from '@/hooks/use-stake';
import type { IActiveStakePosition } from '@/utils/types';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';

export default function StakeModalMolecule(
  props: IActiveStakePosition | undefined,
) {
  const inInputProps = useInput(
    props?.stakingToken?.address,
    props?.chainId as IChainId,
  );
  const { handleStake, isSuccess, button, expected } = useStake({
    ...inInputProps,
    rewardDistributor: props?.rewardDistributor as IAddress,
    token: props?.stakingToken.address,
    name: props?.stakingToken.name,
    symbol: props?.stakingToken?.symbol,
    decimals: props?.stakingToken?.decimals,
    totalSupply: props?.stakingToken.totalSupply?.normalized,
    chainId: props?.chainId as IChainId,
  });

  return (
    <ModalAtom
      title="Stake"
      buttonProps={{
        children: 'Stake',
        variant: 'contained',

        disabled: !props?.stakingToken.address,
      }}
      // TODO: leave modal open for 4 seconds
      onClose={inInputProps.clearInput}
      closeWhen={isSuccess}
    >
      <Stack gap={2}>
        <AssetInputMolecule
          {...inInputProps}
          address={props?.stakingToken?.address}
          type="In"
          chainId={props?.chainId as IChainId}
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
          onClick={handleStake}
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
