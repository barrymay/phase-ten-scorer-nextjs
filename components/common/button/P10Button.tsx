import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useMemo } from 'react';
import { css } from 'twin.macro';
import { ILinkButtonProps } from './LinkButton';

export interface ExtraP10ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconRight?: boolean;
  minimal?: boolean;
  faIconDef?: IconDefinition;
  color?: string;
}

const buttonColor = '#0e83cd';
const transitionSpeed = '0.3s';

type LinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type Props<T extends ButtonProps | LinkProps> = T &
  ExtraP10ButtonProps &
  Partial<ILinkButtonProps> & { renderAs?: string } & T;

function P10Button<T extends Record<string, unknown>>(
  props: Props<T>,
): JSX.Element {
  const {
    children,
    className,
    renderAs,
    faIconDef,
    minimal,
    iconRight,
    href,
    color = buttonColor,
    ...otherButtonProps
  } = props;

  const topLevelStyle = useMemo(
    () => css`
      display: flex;
      align-items: center;
      justify-content: center;

      text-decoration: none;
      font-family: inherit;
      font-size: inherit;
      color: ${color};
      background: none;
      cursor: pointer;
      padding: ${minimal ? '2px' : '5px'};
      margin: ${minimal ? '0px' : '2px 0px'};
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
      outline: none;
      position: relative;
      -webkit-transition: all ${transitionSpeed};
      -moz-transition: all ${transitionSpeed};
      transition: all ${transitionSpeed};
      &:after {
        content: '';
        position: absolute;
        z-index: -1;
        -webkit-transition: all ${transitionSpeed};
        -moz-transition: all ${transitionSpeed};
        transition: all ${transitionSpeed};
      }
      border: 3px solid ${color};
      border-width: ${minimal ? '1px' : ''};
      border-color: ${minimal ? 'transparent' : ''};

      /* Button 1 */
      &.btn-1 {
        &:focus {
          background-color: lighten(${color}, 40%);
        }
        &:hover,
        &:active {
          color: white;
          background: ${color};
        }

        flex-direction: ${iconRight ? 'row-reverse' : 'row'};
        align-items: center;
        justify-content: center;
        height: ${minimal ? '100%' : ''};
      }
    `,
    [color, iconRight, minimal],
  );

  const content = (Tag: 'button' | 'a'): JSX.Element => {
    return (
      <Tag
        css={[topLevelStyle]}
        className={`btn-1 btn-1a ${className || ''}`}
        {...otherButtonProps}
      >
        {faIconDef ? (
          <FontAwesomeIcon
            icon={faIconDef}
            css={{
              fontSize: children ? '0.8em' : undefined,
              paddingRight: !iconRight && children ? 4 : 0,
              paddingLeft: iconRight && children ? 4 : 0,
            }}
          />
        ) : null}
        {children}
      </Tag>
    );
  };

  if (renderAs === 'Link') {
    if (!href) {
      throw new Error("Linked Buttons must have defined href's");
    }
    return (
      <Link href={href} passHref>
        {content('a')}
      </Link>
    );
  }
  return content('button');
}

export default P10Button;
