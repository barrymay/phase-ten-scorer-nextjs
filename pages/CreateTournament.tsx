import { NextContext } from 'next';
import Head from 'next/head';
import CreateTournamentControl from './game/CreateTournamentControl';
import ProviderWrapper from './game/ProviderWrapper';

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
CreateTournament.getInitialProps = async ({ req }: NextContext) => {
  let pageProps = {};

  return { pageProps };
};

export default CreateTournament;
