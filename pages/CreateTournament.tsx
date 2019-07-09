import Head from 'next/head';
import CreateTournamentControl from '../components/game/CreateTournamentControl';
import ProviderWrapper from '../components/game/ProviderWrapper';

function CreateTournament() {
  return (
    <div>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>
      <ProviderWrapper>
        <CreateTournamentControl />
      </ProviderWrapper>
    </div>
  );
}

export default CreateTournament;
