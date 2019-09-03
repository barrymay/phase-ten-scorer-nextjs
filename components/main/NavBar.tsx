/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { faScroll } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken, lighten, rgba } from 'polished';
import React from 'react';
import LinkButton from '../common/button/LinkButton';
import RouteButton, { RouteDefinitions, RouteKeys } from './RouteButton';
import LoginButton from '../common/LoginButton';

const linkTextColor = darken(0.1, '#006699');
const Header = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2em;
  background-image: linear-gradient(
    to right,
    ${lighten('0.5', '#006699')},
    #006699
  );
  border-bottom: 1px solid black;
  .nav-main {
    display: flex;
    flex: 1 1 auto;
  }
`;

const HeaderLinkStyle = css`
  display: flex;
  text-decoration: none;
  user-select: none;
  text-transform: none;
  font-weight: none;
  &:hover {
    color: ${lighten(0.1, linkTextColor)};
  }
  &:active {
    color: ${lighten(0.2, linkTextColor)};
  }
`;

const NavBar: React.FC<{ user: any }> = ({ children, user }) => {
  const LinkStyle = React.useCallback(
    isMinimal =>
      css`
        &.btn-1 {
          font-size: calc(16px + 2vw);
          padding: ${isMinimal ? '0px 10px' : '0px 10px'};
          color: ${linkTextColor};
          font-weight: normal;
          height: unset;
          label {
          }
          &:hover {
            color: ${lighten(0.5, linkTextColor)};
            background: ${rgba(linkTextColor, 0.2)};
          }
          &:active {
            color: ${lighten(0.6, linkTextColor)};
            background: ${rgba(linkTextColor, 0.3)};
          }
        }
      `,
    [],
  );

  return (
    <Header>
      <div className="nav-main">
        <LinkButton href="/" css={[HeaderLinkStyle, LinkStyle(false)]} minimal>
          <FontAwesomeIcon
            css={css`
              padding-right: 4;
              font-size: 0.8em;
            `}
            icon={faScroll}
          />
          <label>Phase 10 Scorer</label>
        </LinkButton>
      </div>
      {Object.entries(RouteDefinitions)
        .filter(([, value]) => !value.hideFromNavBar)
        .map(([key, value]) => (
          <RouteButton
            key={key}
            css={LinkStyle(true)}
            minimal
            routeKey={key as RouteKeys}
          />
        ))}
      <LoginButton css={[HeaderLinkStyle, LinkStyle(true)]} user={user} />
    </Header>
  );
};

export default NavBar;
