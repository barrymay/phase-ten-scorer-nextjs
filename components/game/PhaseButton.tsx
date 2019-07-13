/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { CSSProperties } from '@emotion/serialize';
import { Merge } from '@react-spring/shared';
import { ButtonHTMLAttributes, MouseEvent, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';

type PhaseState = 'default' | 'complete' | 'new-complete';
interface ISpringType extends CSSProperties {
  color: string;
  backgroundColor: string;
}

const getFlipState = (
  isCompleted: boolean,
  currentFlip: boolean,
): PhaseState => {
  return isCompleted ? 'complete' : currentFlip ? 'new-complete' : 'default';
};

const getStateColors = (value: PhaseState) => {
  switch (value) {
    case 'complete':
      return {
        color: 'white',
        backgroundColor: 'black',
      };
    case 'new-complete':
      return {
        transformStyle: 'preserve-3d',
        transform: 'rotateY(180deg)',
      };
    default:
      return {
        transformStyle: 'preserve-3d',
        transform: 'rotateY(0deg)',
      };
  }
};

const phaseStyle = css`
  min-width: 100px;
  border: 0px solid black;
  outline: none;
  cursor: pointer;
  &.completed {
    cursor: default;
  }
  height: 20px;
  .card {
    border: 1px solid black;
    border-radius: 0.25em;
    padding: 2px;
    width: 100%;
    height: 100%;
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
      background-color: green;
      transform: rotateY(180deg);
    }
  }
`;

const PhaseButton: React.FC<
  Merge<ButtonHTMLAttributes<HTMLElement>, { isCompleted: boolean }>
> = props => {
  const { isCompleted, children, ...nonChildProps } = props;
  const [currentFlip, setCurrentFlip] = useState(isCompleted);

  // @ts-ignore
  const [propsFlip, setFlip] = useSpring<ISpringType>(() => {
    return {
      ...getStateColors(getFlipState(isCompleted, currentFlip)),
    };
  });

  useEffect(() => {
    const phaseState: PhaseState = isCompleted ? 'complete' : 'default';
    setFlip(getStateColors(getFlipState(isCompleted, currentFlip)));
  }, [isCompleted, currentFlip]);

  const flipButton = (e: MouseEvent<HTMLButtonElement>) => {
    setCurrentFlip(!currentFlip);
    console.log('Hit', e.currentTarget);
  };

  const className = `phase ${isCompleted ? 'completed' : ''}`;
  return (
    <button css={phaseStyle} onClick={flipButton} {...nonChildProps}>
      <animated.div className="card" style={propsFlip}>
        <div className="back">{children}</div>
        <div className="front">{children}</div>
      </animated.div>
    </button>
  );
};

export default PhaseButton;
