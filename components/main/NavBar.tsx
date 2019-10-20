/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { faScroll, faMoon } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { lighten, rgba } from 'polished';
import React from 'react';
import LinkButton from '../common/button/LinkButton';
import RouteButton, { RouteDefinitions, RouteKeys } from './RouteButton';
import LoginButton from '../common/LoginButton';
import { useThemeToggle, useAppTheme } from '../theming/AppThemeProvider';
import P10Button from '../common/button/P10Button';

function useHeader() {
  const theme = useAppTheme();
  return styled.div`
    display: flex;
    justify-content: center;
    font-size: 2em;
    background-image: linear-gradient(
      to right,
      ${theme.navbar.accentBg},
      ${theme.navbar.primaryBg}
    );
    border-bottom: 1px solid black;
    .nav-main {
      display: flex;
      flex: 1 1 auto;
    }
  `;
}

function useHeaderLinkStyle() {
  const theme = useAppTheme();

  return css`
    display: flex;
    text-decoration: none;
    user-select: none;
    text-transform: none;
    font-weight: none;
    &:hover {
      color: ${lighten(0.1, theme.navbar.primary)};
    }
    &:active {
      color: ${lighten(0.2, theme.navbar.primary)};
    }
  `;
}

const NavBar: React.FC<{ user: any; isAuthAllowed: boolean }> = ({
  user,
  isAuthAllowed,
}) => {
  const theme = useAppTheme();

  const Header = useHeader();
  const HeaderLinkStyle = useHeaderLinkStyle();
  const themeToggle = useThemeToggle();
  const LinkStyle = React.useCallback(
    isMinimal =>
      css`
        &.btn-1 {
          font-size: 0.8em;
          padding: ${isMinimal ? '0px 10px' : '0px 10px'};
          color: ${theme.navbar.primary};
          font-weight: normal;
          height: unset;
          label {
            padding-left: 4px;
            font-size: 50%;
            @media (min-width: 375px) {
              font-size: 70%;
            }
            @media (min-width: 500px) {
              font-size: 100%;
            }
          }
          &:hover {
            color: ${lighten(0.5, theme.navbar.primary)};
            background: ${rgba(theme.navbar.primary, 0.2)};
          }
          &:active {
            color: ${lighten(0.6, theme.navbar.primary)};
            background: ${rgba(theme.navbar.primary, 0.3)};
          }
        }
      `,
    [theme.navbar.primary],
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
      <P10Button
        css={[HeaderLinkStyle, LinkStyle(false)]}
        onClick={() => themeToggle()}
        minimal
      >
        <FontAwesomeIcon
          css={css`
            padding-right: 4;
            font-size: 0.8em;
          `}
          icon={faMoon}
        />
      </P10Button>
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
      {isAuthAllowed && (
        <LoginButton css={[HeaderLinkStyle, LinkStyle(true)]} user={user} />
      )}
    </Header>
  );
};

export default NavBar;
