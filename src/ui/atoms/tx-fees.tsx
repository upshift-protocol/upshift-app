import { useThemeMode } from '@/stores/theme';
import type { IAddress, IPoolAction } from '@augustdigital/sdk';
import { Stack, styled, Typography } from '@mui/material';

type ITxFees = {
  function: IPoolAction;
  in?: IAddress;
  out?: IAddress;
  amount?: string | number;
};

const StackOutline = styled(Stack)<{ isDark: boolean }>`
  border-radius: 4px;
  padding: 0.5rem 1rem;
  gap: 6px;
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)')};
`;

const StackRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function TxFeesAtom(props: ITxFees) {
  const { isDark } = useThemeMode();

  function renderList() {
    switch (props.function) {
      case 'claim':
        return (
          <StackOutline isDark={isDark}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                $0.02
              </Typography>
            </StackRow>
          </StackOutline>
        );
      case 'withdraw':
        return (
          <StackOutline isDark={isDark}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                $0.02
              </Typography>
            </StackRow>
          </StackOutline>
        );
      case 'deposit':
        return (
          <StackOutline isDark={isDark}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                $0.02
              </Typography>
            </StackRow>
            <StackRow>
              <Typography variant="body2">Collateral Exposure</Typography>
              <Typography variant="body2" fontFamily="monospace">
                USDC
              </Typography>
            </StackRow>
            <StackRow>
              <Typography variant="body2">Estimated APY</Typography>
              <Typography variant="body2" fontFamily="monospace">
                2.36%
              </Typography>
            </StackRow>
          </StackOutline>
        );
      default:
        return (
          <StackOutline isDark={isDark}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                $0.02
              </Typography>
            </StackRow>
          </StackOutline>
        );
    }
  }

  return (
    <Stack gap={1}>
      <Typography variant="body2">Transaction Overview</Typography>
      {renderList()}
    </Stack>
  );
}