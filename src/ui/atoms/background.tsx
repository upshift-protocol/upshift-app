import Stack from '@mui/material/Stack';

type IBackground = {
  variant?: 'circular' | 'default';
  children: JSX.Element;
  color?: string;
};

export default function Background({ variant, children, color }: IBackground) {
  switch (variant) {
    case 'circular':
      return (
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={color}
          borderRadius={'50%'}
          width={'fit-content'}
          p={0.25}
          boxShadow={'0px 0px 8px 0px rgba(255,255,255,1);'}
        >
          {children}
        </Stack>
      );
    default:
      return (
        <Stack justifyContent={'center'} alignItems={'center'} bgcolor={color}>
          {children}
        </Stack>
      );
  }
}
