/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { CSSProperties } from '@emotion/serialize';
import { Merge } from '@react-spring/shared';
import { ButtonHTMLAttributes, MouseEvent, useEffect, useState } from 'react';
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
        color: 'white',
        backgroundColor: 'black',
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

const phaseStyle = css`
  min-width: 100px;
  border: 0px solid black;
  outline: none;
  background: inherit;
  color: inherit;
  padding: 2px;
  cursor: pointer;
  &.completed {
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
      transform: rotateY(180deg) rotateZ(180deg);
    }
  }
`;

const PhaseButton: React.FC<
  Merge<ButtonHTMLAttributes<HTMLElement>, { completedState: PhaseState }>
> = props => {
  const { completedState, children, ...nonChildProps } = props;

  // @ts-ignore
  const [propsFlip, setFlip] = useSpring<ISpringType>(() => {
    return {
      ...getStateColors(completedState),
    };
  });

  useEffect(() => {
    setFlip(getStateColors(completedState));
  }, [completedState]);

  const className = `phase ${completedState === 'complete' ? 'completed' : ''}`;
  return (
    <button css={phaseStyle} {...nonChildProps}>
      <animated.div className="card" style={propsFlip}>
        <div className="back">{children}</div>
        <div className="front">{children}</div>
      </animated.div>
    </button>
  );
};

export default PhaseButton;
