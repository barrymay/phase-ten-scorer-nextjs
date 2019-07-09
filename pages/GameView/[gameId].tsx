/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import { TournamentCurrentProvider } from '../../components/context/TournamentCurrentContext';
import GameViewControl from '../../components/game/GameViewControl';
import ProviderWrapper from '../../components/game/ProviderWrapper';

const GameView = ({ gameId }: { gameId: string }) => {
  return (
    <div>
      <Head>
        <title>Phase 10 Scorer - Game</title>
      </Head>
      <ProviderWrapper>
        <TournamentCurrentProvider tournamentId={gameId}>
          <GameViewControl />
        </TournamentCurrentProvider>
      </ProviderWrapper>
    </div>
  );
};

GameView.getInitialProps = async ({ query }: { query: { gameId: string } }) => {
  return { ...query };
};

export default GameView;
