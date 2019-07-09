import { NextContext } from 'next';
import Head from 'next/head';
import ProviderWrapper from './game/ProviderWrapper';
import PlayerSetupControl from './playerSetup/PlayerSetupControl';

function PlayerSetup() {
  return (
    <div>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>
      <ProviderWrapper>
        <PlayerSetupControl />
      </ProviderWrapper>
    </div>
  );
}
PlayerSetup.getInitialProps = async ({ req }: NextContext) => {
  let pageProps = {};

  return { pageProps };
};

export default PlayerSetup;
