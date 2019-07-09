import { NextContext } from 'next';
import Head from 'next/head';
import { MainMenu } from './main/MainMenu';

function Start() {
  return (
    <div>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>
      <MainMenu />
    </div>
  );
}
Start.getInitialProps = async ({ req }: NextContext) => {
  let pageProps = {};

  return { pageProps };
};

export default Start;
