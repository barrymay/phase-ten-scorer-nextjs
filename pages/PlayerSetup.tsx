import Head from 'next/head';
import ProviderWrapper from '../components/game/ProviderWrapper';
import PlayerSetupControl from '../components/playerSetup/PlayerSetupControl';

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

export default PlayerSetup;
