import Head from 'next/head';
import CreateTournamentControl from '../components/game/CreateTournamentControl';
import ProviderWrapper from '../components/game/ProviderWrapper';
import { Fragment } from 'react';

const CreateTournament: React.FC = () => {
  return (
    <Fragment>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>
      <ProviderWrapper>
        <CreateTournamentControl />
      </ProviderWrapper>
    </Fragment>
  );
};

export default CreateTournament;
