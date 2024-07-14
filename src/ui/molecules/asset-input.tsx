import { Stack, styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import AssetSelectorAtom from '../atoms/asset-selector';

type IAssetInput = {
  chain?: number;
  address?: string;
  value?: string;
  type?: 'In' | 'Out';
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
  return (
    <Stack direction="row">
      <StyledTextField
        id="outlined-basic"
        label={`Amount ${props.type}`}
        variant="outlined"
        type="number"
        disabled={props.type === 'Out'}
        required={props.type === 'In'}
        value={props.value}
      />
      <AssetSelectorAtom symbol={props.address} forInput />
    </Stack>
  );
}
