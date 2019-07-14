/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { CSSProperties } from '@emotion/serialize';
import { Merge } from '@react-spring/shared';
import { ButtonHTMLAttributes, useEffect, useMemo, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

export type PhaseState = 'default' | 'complete' | 'new-complete';
interface ISpringType extends CSSProperties {
  color: string;
  backgroundColor: string;
}

const getStateColors = (value: PhaseState) => {
  switch (value) {
    case 'complete':
      return {
        transformStyle: 'preserve-3d',
        transform: 'rotateX(180deg)',
      };
    case 'new-complete':
      return {
        transformStyle: 'preserve-3d',
        transform: 'rotateX(180deg)',
      };
    default:
      return {
        transformStyle: 'preserve-3d',
        transform: 'rotateX(0deg)',
      };
  }
};

const PhaseButton: React.FC<
  Merge<ButtonHTMLAttributes<HTMLElement>, { completedState: PhaseState }>
> = props => {
  const { completedState, children, ...nonChildProps } = props;
  const lastState = useRef<PhaseState | null>('default');
  const lastColor = useRef<string>('whtie');

  const phaseStyle = useMemo(() => {
    const desiredBackgroundColor =
      completedState === 'new-complete' ? 'green' : 'black';

    if (lastState.current === 'default' || desiredBackgroundColor === 'black') {
      lastColor.current = desiredBackgroundColor;
    }
    lastState.current = completedState;

    return css`
      min-width: 100px;
      border: 0px solid black;
      outline: none;
      background: inherit;
      color: inherit;
      padding: 2px;
      cursor: pointer;
      &.complete {
        cursor: default;
      }
      height: 18px;
      .card {
        border: 1px solid black;
        border-radius: 0.25em;
        padding: 2px;
        height: 100%;
        position: relative;

        .front,
        .back {
          will-change: color, background-color;
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .front {
          z-index: 2;
          transform: rotateY(0deg);
        }
        .back {
          color: white;
          background-color: ${lastColor.current};
          transform: rotateY(180deg) rotateZ(180deg);
        }
      }
    `;
  }, [completedState]);

  // @ts-ignore
  const [propsFlip, setFlip] = useSpring<ISpringType>(() => {
    return {
      ...getStateColors(completedState),
    };
  });

  useEffect(() => {
    setFlip(getStateColors(completedState));
  }, [completedState]);

  return (
    <button className={completedState} css={phaseStyle} {...nonChildProps}>
      <animated.div className="card" style={propsFlip}>
        <div className="back">{children}</div>
        <div className="front">{children}</div>
      </animated.div>
    </button>
  );
};

export default PhaseButton;
