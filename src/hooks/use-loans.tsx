import type { IAddress } from '@augustdigital/sdk';
import { ABI_LOAN } from '@augustdigital/sdk';
import { useEffect } from 'react';
import { useReadContracts } from 'wagmi';

// type IVaultAllocationLoan = {
//   id: number;
//   address: IAddress;
//   allocation: string;
//   supply: string;
//   collateral: string;
//   liquidationLTV: string;
// };

const readFunctions = [
  'currentApr',
  'collateralToken',
  'effectiveLoanAmount',
  'loanAmountInPrincipalTokens',
  'principalAmount',
  'principalRepaid',
  'principalToken',
  'loanState',
];

const loanz = [
  '0xaE066F58924c1396DaB12EBC86f011b391F1865c',
  // '0xD98af2187c03802C1390b6378AE15294C23038c2',
  // '0xEeE4414151de8BE6b537a33d57380461d63EE680',
];

export default function useLoans(loanAddresses?: IAddress[]) {
  // const [loans, setLoans] = useState<IVaultAllocationLoan[]>([]);

  const list = loanAddresses?.length ? loanAddresses : loanz;

  const { data: loansWithData } = useReadContracts({
    contracts: readFunctions
      .map((func) => {
        return list.map((l) => ({
          address: l as IAddress,
          abi: ABI_LOAN,
          functionName: func,
        }));
      })
      .flat(),
  });

  useEffect(() => {
    const reads = list.map((_loan) => {
      return readFunctions.map((func) => ({
        [func]: loansWithData,
      }));
    });

    // const reads = readFunctions.map((func) => {
    //   return list.map((listItem, i) => ({
    //     [func]:
    //   }));
    // });

    console.log(reads);

    // const returnObj = loanAddresses.map((loan, i) => {
    //   return {
    //     id: Math.floor(i % readFunctions.length),
    //     address: loan,
    //     allocation: loansWithData[i]
    //   }
    // })
    // const continuousList = loansWithData
    //   .map((readCall, i) => {
    //     if (readCall.result || String(readCall.result) === '{}') {
    //       return readCall.result as string | number | bigint;
    //     }
    //     return undefined;
    //   })
    // const loansAmount = loansWithData?.length;
    // const loansMatrix = [];
    // continuousList.forEach((item, i) => {
    //   if
    // })

    // setLoans(returnObj);
  }, [loansWithData]);

  // return {
  //   loans,
  // };
}
