/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Head from 'next/head';
import { TournamentCurrentProvider } from '../../components/context/TournamentCurrentContext';
import GameViewControl from '../../components/game/GameViewControl';
import ProviderWrapper from '../../components/game/ProviderWrapper';
import Spinner from '../../components/common/Spinner';
import { useState, Fragment } from 'react';
import { useSpring, animated } from 'react-spring';

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
  const gameViewFloatIn = useSpring({
    config: {
      friction: 50,
    },
    opacity: showSpinner ? 0 : 1,
    top: showSpinner ? 500 : 0,
  });
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
            <animated.div style={gameViewFloatIn} className="container">
              <GameViewControl
                onReady={() => {
                  setShowSpinner(false);
                }}
              />
            </animated.div>
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
