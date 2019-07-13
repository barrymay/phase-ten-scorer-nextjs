/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Merge } from '@react-spring/shared';
import { ButtonHTMLAttributes, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

type PhaseState = 'default' | 'complete' | 'new-complete';
interface ISpringType {
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
        color: 'white',
        backgroundColor: 'blue',
      };
    default:
      return {
        color: 'black',
        backgroundColor: 'white',
      };
  }
};

const phaseStyle = css`
  min-width: 100px;
  padding: 2px;
  border: 1px solid black;
  border-radius: 0.25em;
  cursor: pointer;
  &.completed {
    cursor: default;
  }
`;

const PhaseButton: React.FC<
  Merge<ButtonHTMLAttributes<HTMLElement>, { isCompleted: boolean }>
> = props => {
  const { isCompleted, children, ...nonChildProps } = props;

  const [propsFlip, setFlip] = useSpring<ISpringType>(() => {
    const phaseState: PhaseState = isCompleted ? 'complete' : 'default';

    return {
      ...getStateColors(phaseState),
    };
  });

  useEffect(() => {
    const phaseState: PhaseState = isCompleted ? 'complete' : 'default';
    setFlip(getStateColors(phaseState));
  }, [isCompleted]);

  const className = `phase ${isCompleted ? 'completed' : ''}`;
  return (
    <animated.div style={propsFlip} css={phaseStyle} {...nonChildProps}>
      {children}
    </animated.div>
  );
};

export default PhaseButton;
