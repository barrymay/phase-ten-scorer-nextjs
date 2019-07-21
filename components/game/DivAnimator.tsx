/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import { animated, useSprings } from 'react-spring';

export interface CarouselSpringProps {
  x: number;
}

const Container = styled.div`
  position: relative;
  max-width: 300px;
  overflow: hidden;
  cursor: pointer;
  & > div {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

function getProcessFunc(
  width: number = 200,
  fromBoundsRef: React.MutableRefObject<Array<{ x: number }>>,
  curSelection: number = 0,
  isSpringAtRest?: boolean,
) {
  return function processPosition(index: number) {
    const nextValue = index * width - curSelection * width;
    const fromValue = isSpringAtRest
      ? { x: nextValue }
      : fromBoundsRef.current[index];
    const newValue = {
      x: nextValue,
      from: fromValue,
      onStart: () => {
        fromBoundsRef.current[index] = { x: nextValue };
      },
    };
    return newValue;
  };
}

const DivAnimator: React.FC<{
  currentIndex: number;
  boundsWidth: number;
  boundsHeight: number;
}> = ({ children, currentIndex, boundsWidth = 0, boundsHeight = 0 }) => {
  const childArr = React.Children.toArray(children);
  const fromBoundsRef = useRef<Array<{ x: number }>>([]);
  const currentSelectionRef = useRef(0);
  const pastSelectionRef = useRef(0);

  // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  // Initital state doesn't matter, just a placeholder
  const [springs, setSprings] = useSprings<CarouselSpringProps>(
    childArr.length,
    () => ({ x: 0 }),
  );

  useEffect(() => {
    fromBoundsRef.current = Array.from(new Array(childArr.length).keys()).map(
      item => ({
        x: item * boundsWidth,
      }),
    );
  }, [boundsWidth, childArr.length]);

  useEffect(() => {
    pastSelectionRef.current = currentSelectionRef.current;
    currentSelectionRef.current = currentIndex;
    setSprings(
      getProcessFunc(
        boundsWidth,
        fromBoundsRef,
        currentSelectionRef.current,
        pastSelectionRef.current === currentSelectionRef.current,
      ),
    );
  }, [boundsWidth, setSprings, currentIndex]);

  return (
    <Container
      css={css`
        height: ${boundsHeight}px;
      `}
    >
      {springs.map(({ x }, i) => (
        <animated.div
          key={i}
          style={{
            transform: x.to(x => `translate3d(${x}px,0,0)`),
          }}
        >
          <div>{childArr[i]}</div>
        </animated.div>
      ))}
    </Container>
  );
};

export default DivAnimator;
