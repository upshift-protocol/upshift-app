import {
  Box,
  Button,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import { useAccount, useReadContracts } from 'wagmi';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { Fragment } from 'react';
import AssetSelectorAtom from '../atoms/asset-selector';

type IAssetInput = {
  chainId?: IChainId;
  address?: IAddress;
  value?: string;
  type?: 'In' | 'Out';
  handleMax?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleInput?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  loading?: number;
};

const StyledTextField = styled(TextField)({
  flexGrow: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
  },
});

export default function AssetInputMolecule(props: IAssetInput) {
  const { address } = useAccount();

  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        ...props,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address || zeroAddress],
      },
      {
        ...props,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        ...props,
        abi: erc20Abi,
        functionName: 'symbol',
      },
    ],
  });

  function renderBalance() {
    if (isLoading) {
      return (
        <Skeleton
          variant="text"
          style={{ display: 'inline-block' }}
          width="60px"
        />
      );
    }

    return (
      <Fragment>
        {formatUnits(
          data?.[0]?.result || BigInt(0),
          data?.[1]?.result || 18,
        ).slice(0, 8) || '0'}{' '}
        {data?.[2]?.result}
      </Fragment>
    );
  }

  return (
    <Stack>
      {props.type === 'In' && (
        <Box position="relative">
          <Typography
            color="GrayText"
            fontSize={10}
            position="absolute"
            left={14}
            top={38}
          >
            Balance: {renderBalance()}
          </Typography>
        </Box>
      )}
      <Stack direction="row">
        <StyledTextField
          id="outlined-basic"
          label={`Amount ${props.type}`}
          variant="outlined"
          type="number"
          disabled={props.type === 'Out' || !address}
          required={props.type === 'In'}
          value={props.value}
          onChange={props.handleInput}
          focused={!!props.loading}
        />
        {props.loading ? (
          <Skeleton
            style={{ position: 'absolute', transform: 'translate(14px, 15px)' }}
            width="120px"
          />
        ) : null}
        {props.type === 'In' && props.handleMax && (
          <Box position="relative">
            <Box position="absolute" left={-72} top={12.5} textAlign={'right'}>
              <Button
                size="small"
                onClick={props.handleMax}
                disabled={!address}
              >
                MAX
              </Button>
            </Box>
          </Box>
        )}
        <AssetSelectorAtom {...props} loading={!!props?.loading} forInput />
      </Stack>
    </Stack>
  );
}
