/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Head from 'next/head';
import { TournamentCurrentProvider } from '../../components/context/TournamentCurrentContext';
import GameViewControl from '../../components/game/GameViewControl';
import ProviderWrapper from '../../components/game/ProviderWrapper';
import Spinner from '../../components/common/Spinner';
import { useState, Fragment, useRef } from 'react';
import { useSpring, animated, SpringHandle, useChain } from 'react-spring';

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

  // TODO - help react-spring get rid of need of null here
  const floatInRef = useRef<SpringHandle>(null);
  const gameViewFloatIn = useSpring<{ opacity: number; top: number }>({
    ref: floatInRef,
    opacity: showSpinner ? 0 : 1,
    top: showSpinner ? 500 : 0,
  });

  const cardFlipRef = useRef<SpringHandle>(null);
  const cardFlip = useSpring<{ transform: string }>({
    ref: cardFlipRef,
    config: {
      friction: 70,
    },
    from: {
      transform: `rotateY(89.5deg)`,
    },
    transform: `rotateY(0deg)`,
  });

  useChain([floatInRef, cardFlipRef]);
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
                divSpring={cardFlip}
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
