import BaseSkeleton from '@/ui/skeletons/base';
import SectionSkeleton from '@/ui/skeletons/section';
import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';

export default function Custom404() {
  return (
    <BaseSkeleton>
      <SectionSkeleton id="not-found">
        <Stack
          minHeight={'50vh'}
          height="100%"
          width="100%"
          justifyContent={'center'}
          alignItems="center"
          gap="1rem"
        >
          <Typography variant="h1">Page Not Found</Typography>
          <Typography variant="subtitle1">
            Seems like what you&apos;re looking for does not exist.
          </Typography>
          <Link href="/">
            <Button variant="contained">Take Me Home</Button>
          </Link>
        </Stack>
      </SectionSkeleton>
    </BaseSkeleton>
  );
}
