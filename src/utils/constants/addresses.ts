export const REWARD_DISTRIBUTOR_ADDRESS = (chainId: number) => {
  switch (chainId) {
    case 43114:
      return '0x46942b0Ab51be779C68daDe814969D03a6b8f8f8';
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
