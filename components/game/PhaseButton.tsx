/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { CSSProperties, SerializedStyles } from '@emotion/serialize';

import {
  ButtonHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  cloneElement,
  Children,
} from 'react';
import { animated, useSpring } from 'react-spring';
import { Merge } from '../../ts-common/merge';
import useMeasure from '../common/useMeasure';

export type PhaseState = 'default' | 'complete' | 'new-complete';
interface ISpringType extends CSSProperties {
  color: string;
  backgroundColor: string;
}

const getStateColors = (value: PhaseState) => {
  switch (value) {
    case 'complete':
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

const baseButtonStyles = css`
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
  .card {
    border: 1px solid black;
    border-radius: 0.25em;
    position: relative;

    .front,
    .back {
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
      transform: rotateY(180deg) rotateZ(180deg);
    }
  }
`;

function useAnimatedCardFlip(
  completedState: PhaseState,
  // @ts-ignore
): [SpringValues<ISpringType>, SerializedStyles] {
  const lastState = useRef<PhaseState | null>('default');
  const lastBgColor = useRef<string>('whtie');

  const phaseStyle = useMemo(() => {
    const desiredBackgroundColor =
      completedState === 'new-complete' ? 'green' : 'black';

    if (lastState.current === 'default' || completedState === 'complete') {
      lastBgColor.current = desiredBackgroundColor;
    }
    lastState.current = completedState;

    return css(
      baseButtonStyles,
      css`
        .card > .back {
          background-color: ${lastBgColor.current};
        }
      `,
    );
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

  return [propsFlip, phaseStyle];
}

const PhaseButton: React.FC<
  Merge<ButtonHTMLAttributes<HTMLElement>, { completedState: PhaseState }>
> = props => {
  const { completedState, children, ...nonChildProps } = props;
  const [propsFlip, phaseStyle] = useAnimatedCardFlip(completedState);
  const [buttonSizer, buttonSize] = useMeasure<HTMLDivElement>();

  return (
    <button className={completedState} css={[phaseStyle]} {...nonChildProps}>
      <animated.div
        className="card"
        style={propsFlip}
        css={css`
          min-height: ${buttonSize.height}px;
        `}
      >
        <div className="back">{children}</div>
        <div className="front">
          {Children.map(children, (child, index) => {
            return cloneElement(
              // @ts-ignore
              child,
              index === 0 ? { ref: buttonSizer.ref } : undefined,
            );
          })}
        </div>
      </animated.div>
    </button>
  );
};

export default PhaseButton;
