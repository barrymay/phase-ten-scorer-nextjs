/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { ILinkButtonProps } from './LinkButton';

export interface ExtraP10ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconRight?: boolean;
  minimal?: boolean;
  faIconDef?: IconDefinition;
}

const buttonColor = '#0e83cd';
const transitionSpeed = '0.3s';

const topLevelStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background: none;
  cursor: pointer;
  padding: 5px;
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

  /* Button 1 */
  &.btn-1 {
    border: 3px solid ${buttonColor};
    color: ${buttonColor};
    &:focus {
      background-color: lighten(${buttonColor}, 40%);
    }
    &:hover,
    &:active {
      color: white;
      background: ${buttonColor};
    }
  }
`;

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

function P10Button<T extends {}>(props: Props<T>) {
  let {
    children,
    className,
    renderAs,
    faIconDef,
    minimal,
    iconRight,
    href,
    ...otherProps
  } = props;

  const dynamicStyle = css`
    &.btn-1 {
      flex-direction: ${iconRight ? 'row-reverse' : 'row'};
      align-items: center;
      justify-content: center;
      margin: ${minimal ? '0px' : '2px 0px'};
      border-width: ${minimal ? '0px' : ''};
      padding: ${minimal ? '2px' : ''};
      height: ${minimal ? '100%' : ''};
    }
  `;

  const content = (Tag: 'button' | 'a') => {
    return (
      <Tag
        css={[topLevelStyle, dynamicStyle]}
        className={`${className || ''} btn-1 btn-1a`}
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

  return renderAs === 'Link' ? (
    <Link href={href} passHref>
      {content('a')}
    </Link>
  ) : (
    content('button')
  );
}

export default P10Button;
