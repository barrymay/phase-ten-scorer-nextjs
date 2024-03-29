import { css } from '@emotion/react';
import { animated, useSpring } from '@react-spring/web';
import Head from 'next/head';
import { Fragment, useState } from 'react';
import tw from 'twin.macro';
import Spinner from '../../components/common/Spinner';
import { TournamentCurrentProvider } from '../../components/context/TournamentCurrentContext';
import GameViewControl from '../../components/game/GameViewControl';
import ProviderWrapper from '../../components/game/ProviderWrapper';

const style = css`
  ${tw`relative`}
  .game-container {
    ${tw`absolute top-0 left-0 w-full`}
    &.spinner {
      ${tw`z-scroll-container h-full`}
    }
  }
`;
const GameView = ({
  gameId,
  className,
}: {
  gameId: string;
  className: string;
}): React.ReactNode => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [showCard, setShowCard] = useState(false);

  const gameViewFloatIn = useSpring<{ opacity: number; top: number }>({
    opacity: showSpinner ? 0 : 1,
    top: showSpinner ? 500 : 0,
    onChange: ({ value }) => {
      // TODO can this be typed?
      if ((value as any).top < 100) {
        setShowCard(true);
      }
    },
  });

  const cardFlip = useSpring<{ transform: string }>({
    config: {
      friction: 70,
    },
    from: {
      transform: `rotateY(89.5deg)`,
    },
    transform: showCard ? `rotateY(0deg)` : `rotateY(89.5deg)`,
  });

  return (
    <Fragment>
      <Head>
        <title>Phase 10 Scorer - Game</title>
      </Head>
      <div className={className} css={style}>
        {showSpinner ? (
          <div className="game-container spinner">
            <Spinner />
          </div>
        ) : null}
        <ProviderWrapper>
          <TournamentCurrentProvider tournamentId={gameId}>
            <animated.div style={gameViewFloatIn} className="game-container">
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
