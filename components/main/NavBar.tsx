/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { faScroll, faMoon } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { rgba } from 'polished';
import React from 'react';
import LinkButton from '../common/button/LinkButton';
import RouteButton, { RouteDefinitions, RouteKeys } from './RouteButton';
import LoginButton from '../common/LoginButton';
import { useThemeToggle, useAppTheme } from '../theming/AppThemeProvider';
import P10Button from '../common/button/P10Button';
import { AppTheme } from '../theming/themes';

interface IHeaderProps {
  theme: AppTheme;
}
const Header = styled.div<IHeaderProps>`
  display: flex;
  justify-content: center;
  font-size: 2em;
  background-image: linear-gradient(
    to right,
    ${(props: IHeaderProps) => props.theme.navbar.primaryBg},
    ${(props: IHeaderProps) => props.theme.navbar.primaryBgAlt}
  );
  border-bottom: 1px solid black;
  .nav-main {
    display: flex;
    flex: 1 1 auto;
  }
`;

const NavBar: React.FC<{ user: any; isAuthAllowed: boolean }> = ({
  user,
  isAuthAllowed,
}) => {
  const theme = useAppTheme();

  const HeaderLinkStyle = css`
    display: flex;
    text-decoration: none;
    user-select: none;
    text-transform: none;
    font-weight: none;
    color: ${theme.navbar.primary};

    &:hover {
      color: ${theme.navbar.primaryAlt};
    }
    &:active {
      color: ${theme.navbar.primaryAlt};
    }
  `;

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
            color: ${theme.navbar.primaryAlt};
            background: ${rgba(theme.navbar.primary, 0.2)};
          }
          &:active {
            color: ${theme.navbar.primaryAlt};
            background: ${rgba(theme.navbar.primary, 0.3)};
          }
        }
      `,
    [theme.navbar.primary, theme.navbar.primaryAlt],
  );

  return (
    <Header theme={theme}>
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
        title="Toggle Night Mode"
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
