import Stack from '@mui/material/Stack';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import useInput from '@/hooks/use-input';
import useClaimReward from '@/hooks/use-claim';
import type { IActiveStakePosition } from '@/utils/types';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';

export default function ClainRewardModalMolecule(
  props: IActiveStakePosition | undefined,
) {
  const inInputProps = useInput(
    props?.rewardToken?.address,
    props?.chainId as IChainId,
  );
  const { handleClaimReward, isSuccess, button, expected } = useClaimReward({
    ...inInputProps,
    rewardDistributor: props?.rewardDistributor as IAddress,
    token: props?.rewardToken.address,
    name: props?.rewardToken.name,
    symbol: props?.rewardToken?.symbol,
    decimals: props?.rewardToken?.decimals,
    chainId: props?.chainId as IChainId,
    value: props?.rewardToken?.redeemable?.normalized,
  });

  return (
    <ModalAtom
      title="Claim Reward"
      buttonProps={{
        children: 'Claim Reward',
        variant: 'outlined',
        color: 'primary',
        disabled: !props?.rewardDistributor,
      }}
      // TODO: leave modal open for 4 seconds
      onClose={inInputProps.clearInput}
      closeWhen={isSuccess}
    >
      <Stack gap={2}>
        <AssetInputMolecule
          {...inInputProps}
          address={props?.rewardToken?.address}
          type="Out"
          chainId={props?.chainId as IChainId}
          isNative={true}
          value={props?.rewardToken?.redeemable?.normalized}
        />
        <TxFeesAtom
          function="claim"
          in={props?.rewardToken?.address}
          out={props?.rewardDistributor}
          fee={BigInt(expected.fee.raw)}
          loading={+expected.loading}
          chainId={props?.chainId}
        />
      </Stack>
      <Stack mt={3}>
        <Web3Button
          onClick={handleClaimReward}
          size="large"
          variant="contained"
          disabled={button.disabled}
          chainId={props?.chainId}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
