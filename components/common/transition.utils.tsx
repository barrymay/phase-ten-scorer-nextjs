import { css } from '@emotion/react';

export const getFadeCss = (
  parentSelector: string,
  transitionTimeMs: number,
) => css`
  flex: 1;
  position: relative;
  ${parentSelector} {
    > .page {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &.fade-enter {
      > .page {
        opacity: 0;
        z-index: 1;
      }
    }
    &.fade-enter.fade-enter-active {
      > .page {
        opacity: 1;
        transition: opacity ${transitionTimeMs}ms ease-in;
      }
    }
    &.fade-exit {
      > .page {
        opacity: 1;
      }
    }
    &.fade-exit.fade-exit-active {
      > .page {
        opacity: 0;
        transition: opacity ${transitionTimeMs}ms ease-out;
      }
    }
  }
`;

export const getMoveCss = (
  parentSelector: string,
  transitionTimeMs: number,
  moveLeft = false,
) => {
  const moveFactor = moveLeft ? 1 : -1;
  return css`
    flex: 1;
    position: relative;
    overflow: hidden;

    ${parentSelector} {
      > .page {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition: transform ${transitionTimeMs}ms ease;
      }
      &.move-enter {
        > .page {
          transform: translateX(${100 * moveFactor}%);
        }
      }
      &.move-enter.move-enter-active {
        > .page {
          transform: translateX(0);
        }
      }
      &.move-exit {
        > .page {
          transform: translateX(0);
        }
      }
      &.move-exit.move-exit-active {
        > .page {
          transform: translateX(${-100 * moveFactor}%);
        }
      }
    }
  `;
};
