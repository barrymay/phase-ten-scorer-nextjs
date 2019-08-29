/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Head from 'next/head';
import { TournamentCurrentProvider } from '../../components/context/TournamentCurrentContext';
import GameViewControl from '../../components/game/GameViewControl';
import ProviderWrapper from '../../components/game/ProviderWrapper';
import Spinner from '../../components/common/Spinner';
import { useState, Fragment } from 'react';

const style = css`
  position: relative;

  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    &.spinner {
      z-index: 999;
      height: 100px;
    }
  }
`;
const GameView = ({
  gameId,
  className,
}: {
  gameId: string;
  className: string;
}) => {
  const [showSpinner, setShowSpinner] = useState(true);
  return (
    <Fragment>
      <Head>
        <title>Phase 10 Scorer - Game</title>
      </Head>
      <div className={className} css={style}>
        {showSpinner ? (
          <div className="container spinner">
            <Spinner />
          </div>
        ) : null}
        <ProviderWrapper>
          <TournamentCurrentProvider tournamentId={gameId}>
            <div className="container">
              <GameViewControl
                onReady={() => {
                  setShowSpinner(false);
                }}
              />
            </div>
          </TournamentCurrentProvider>
        </ProviderWrapper>
      </div>
    </Fragment>
  );
};

GameView.getInitialProps = async ({ query }: { query: { gameId: string } }) => {
  return { ...query };
};

export default GameView;
