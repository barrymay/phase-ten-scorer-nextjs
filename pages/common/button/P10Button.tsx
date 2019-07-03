/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { Link } from '@reach/router';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ExtraP10ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconRight?: boolean;
  minimal?: boolean;
  faIconDef?: IconDefinition;
}

const buttonColor = '#0e83cd';
const transitionSpeed = '0.3s';

const topLevelStyle = css`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;

  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background: none;
  cursor: pointer;
  padding: 5px;
  display: inline-block;
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

type Props<T extends {}> = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ExtraP10ButtonProps & { renderAs?: string } & T;

function P10Button<T extends {}>(props: Props<T>) {
  let {
    children,
    className,
    renderAs,
    faIconDef,
    minimal,
    iconRight,
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

  const CustomTag = renderAs === 'Link' ? Link : 'button';
  return (
    <CustomTag
      css={[topLevelStyle, dynamicStyle]}
      className={`${className || ''} btn-1 btn-1a`}
      {...otherProps}
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
    </CustomTag>
  );
}

export default P10Button;
