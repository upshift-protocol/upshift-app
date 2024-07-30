import { ethers } from 'ethers';
import type { IAddress, INormalizedNumber } from '@augustdigital/sdk';
import { ABI_LENDING_POOLS, toNormalizedBn } from '@augustdigital/sdk';
import { FALLBACK_CHAINID, INFURA_API_KEY } from '../constants/web3';

// TODO: optimize with viem and remove ethers library once latest loan is deployed
export async function getAvailableRedemptions(
  pool: IAddress,
  address?: IAddress,
) {
  // setup
  const ethersProvider = new ethers.InfuraProvider(
    FALLBACK_CHAINID,
    INFURA_API_KEY,
  );
  const poolContract = new ethers.Contract(
    pool,
    ABI_LENDING_POOLS,
    ethersProvider,
  );

  // query getLogs
  const logs = await poolContract.queryFilter(
    '0xcf66e298674611b37498f975575b3a1d8dae11317ccfca151a8bba2e0911f875',
  );
  const iface = new ethers.Interface([
    'event WithdrawalRequested (address ownerAddr, address receiverAddr, uint256 shares, uint256 assets, uint256 year, uint256 month, uint256 day)',
  ]);
  // parse logs
  const events = logs.map((log) => iface.parseLog(log));

  // get pool decimals
  const decimals: number | undefined = await poolContract?.decimals?.();

  // format
  const availableRedemptions: Record<
    string,
    INormalizedNumber | Date | IAddress
  >[] = [];
  events.forEach((ev) => {
    // ensure event is defined
    if (!ev?.args) return;
    const [ownerAddr, receiverAddr, shares, assets, bnYear, bnMonth, bnDay] =
      ev.args;
    if (process.env.NODE_ENV === 'test') {
      console.log('ownerAddr:', ownerAddr);
      console.log('shares:', shares);
    }
    // check if connected users address
    if (address && receiverAddr === address) {
      const [year, month, day] = [
        toNormalizedBn(bnYear, 0),
        toNormalizedBn(bnMonth, 0),
        toNormalizedBn(bnDay, 0),
      ];
      availableRedemptions.push({
        receiver: receiverAddr,
        day,
        month,
        year,
        amount: toNormalizedBn(assets, decimals),
        date: new Date(Number(bnYear), Number(bnMonth) - 1, Number(bnDay)),
      });
    }
  });
  return availableRedemptions;
}
