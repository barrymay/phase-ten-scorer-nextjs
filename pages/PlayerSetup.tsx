import Head from 'next/head';
import ProviderWrapper from '../components/game/ProviderWrapper';
import PlayerSetupControl from '../components/playerSetup/PlayerSetupControl';
import { Fragment } from 'react';

const PlayerSetup: React.FC = () => {
  return (
    <Fragment>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>

      <ProviderWrapper>
        <PlayerSetupControl />
      </ProviderWrapper>
    </Fragment>
  );
};

export default PlayerSetup;
