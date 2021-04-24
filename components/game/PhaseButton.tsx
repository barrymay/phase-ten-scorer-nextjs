/** @jsx jsx */
import {
  ButtonHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  cloneElement,
  Children,
  RefObject,
  isValidElement,
  CSSProperties,
} from 'react';
import { animated, useSpring, UseSpringProps } from '@react-spring/web';
import { Merge } from '../../ts-common/merge';
import { useAppTheme } from '../theming/AppThemeProvider';
import { AppTheme } from '../theming/themes';
import { jsx, css, SerializedStyles } from '@emotion/react';

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
        transform: 'rotateX(180deg)',
      };
    default:
      return {
        transform: 'rotateX(0deg)',
      };
  }
};

function getBaseButtonStyles(theme: AppTheme) {
  return css`
    min-width: 65px;
    border: 0px solid ${theme.default.border};
    outline: none;
    background: inherit;
    color: inherit;
    padding: 2px;
    cursor: pointer;
    &.complete {
      cursor: default;
    }
    .card {
      border: 1px solid ${theme.default.border};
      border-radius: 0.25em;
      position: relative;
      box-sizing: content-box;

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
        color: ${theme.default.primaryBg};
        transform: rotateY(180deg) rotateZ(180deg);
      }
    }
  `;
}

function useAnimatedCardFlip(
  completedState: PhaseState,
): [UseSpringProps<ISpringType>, SerializedStyles] {
  const theme = useAppTheme();
  const baseButtonStyles = getBaseButtonStyles(theme);
  const lastState = useRef<PhaseState | null>('default');
  const lastBgColor = useRef<string>('whtie');

  const phaseStyle = useMemo(() => {
    const desiredBackgroundColor =
      completedState === 'new-complete' ? 'green' : theme.default.primary;

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
  }, [baseButtonStyles, completedState, theme.default.primary]);

  const [propsFlip, api] = useSpring(() => {
    return {
      ...getStateColors(completedState),
    };
  });

  useEffect(() => {
    api.start(getStateColors(completedState));
  }, [completedState, api]);

  return [propsFlip, phaseStyle];
}

const PhaseButton: React.FC<Merge<
  ButtonHTMLAttributes<HTMLElement>,
  {
    completedState: PhaseState;
    buttonHeight: number;
    measureRef?: RefObject<HTMLElement>;
  }
>> = props => {
  const {
    completedState,
    children,
    buttonHeight,
    measureRef,
    ...nonChildProps
  } = props;
  const [propsFlip, phaseStyle] = useAnimatedCardFlip(completedState);

  return (
    <button className={completedState} css={[phaseStyle]} {...nonChildProps}>
      <animated.div
        className="card"
        // @ts-expect-error - React-spring not resolving propsFlip typing properly
        style={propsFlip}
        css={css`
          transform-style: preserve-3d;
          min-height: ${buttonHeight}px;
        `}
      >
        <div className="back">{children}</div>
        <div className="front">
          {Children.map(children, (child, index) => {
            return isValidElement(child)
              ? cloneElement(
                  child,
                  measureRef && index === 0 ? { ref: measureRef } : undefined,
                )
              : null;
          })}
        </div>
      </animated.div>
    </button>
  );
};

export default PhaseButton;
