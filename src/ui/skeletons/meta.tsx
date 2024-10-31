import { NextSeo } from 'next-seo';
import appConfig from '@/config/app';
import { GoogleTagManager } from '@next/third-parties/google';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const MetaSkeleton = (props: IMetaProps) => {
  return (
    <>
      <GoogleTagManager gtmId="G-H1WDGRZH57" />
      <NextSeo
        {...appConfig}
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          ...appConfig.openGraph,
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: appConfig.locale,
          site_name: appConfig.site_name,
        }}
      />
    </>
  );
};

export default MetaSkeleton;
