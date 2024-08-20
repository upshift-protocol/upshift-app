import { augustSdk } from '@/config/august-sdk';
import type { IChainId } from '@augustdigital/sdk';
import type { SelectChangeEvent } from '@mui/material';
import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useChainId, useChains, useSwitchChain } from 'wagmi';

function renderer(value?: string) {
  if (value?.includes(' ')) return value?.split(' ')[0];
  return value;
}

const ChainDropdown = () => {
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const chains = useChains();
  const [activeChain, setActiveChain] = useState<string>('1');

  const handleChange = async (event: SelectChangeEvent) => {
    const changeChainId = Number(event.target.value);
    const foundChain = chains.find(({ id }) => id === Number(changeChainId));
    if (foundChain) switchChain({ chainId: changeChainId });
  };

  useEffect(() => {
    const foundChain = chains.find(({ id }) => id === chainId);
    if (foundChain) {
      setActiveChain(String(chainId));
      augustSdk.switchNetwork(chainId as IChainId);
    }
  }, [chainId]);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          id={`chain-dropdown-${Math.floor(Math.random() * 100)}`}
          value={String(activeChain)}
          renderValue={(value) =>
            renderer(chains.find((chain) => chain.id === Number(value))?.name)
          }
          onChange={handleChange}
          size="small"
          placeholder="Select Network"
        >
          {chains.map((chain) => (
            <MenuItem key={`chain-dropdown-${chain.id}`} value={chain.id}>
              {chain.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChainDropdown;
