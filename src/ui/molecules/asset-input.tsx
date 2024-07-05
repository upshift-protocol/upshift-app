import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import AssetSelectorAtom from '../atoms/asset-selector';

type IAssetInput = {
  symbol?: string;
  value?: string;
  type?: 'In' | 'Out';
};

export default function AssetInputMolecule(props: IAssetInput) {
  return (
    <Stack direction="row">
      <TextField
        id="outlined-basic"
        label={`Amount ${props.type}`}
        variant="outlined"
        type="number"
        disabled={props.type === 'Out'}
        value={props.value}
        style={{
          flexGrow: '1',
        }}
      />
      <AssetSelectorAtom symbol={props.symbol} forInput />
    </Stack>
  );
}
