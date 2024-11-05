export const REWARD_DISTRIBUTOR_ADDRESS = (chainId: number) => {
  switch (chainId) {
    case 43114:
      return '0x5e08C2e17ad7420ac7cB612474D40ecdE47719a1';
    default:
      return '0x0000000000000000000000000000000000000000';
  }
};

export const AVAX_PRICE_FEED_ADDRESS = (chainId: number) => {
  switch (chainId) {
    case 1:
      return '0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7';
    default:
      return '0x';
  }
};
