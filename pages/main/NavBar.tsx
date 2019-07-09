/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { faScroll } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { darken, lighten } from 'polished';
import React from 'react';
import LinkButton from '../common/button/LinkButton';
import RouteButton, { RouteDefinitions, RouteKeys } from './RouteButton';

const linkTextColor = darken(0.1, '#006699');

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '2em',
  backgroundImage: `linear-gradient(to right, ${lighten(
    '0.5',
    '#006699',
  )}, #006699)`,
  borderBottom: '1px solid black',
});

const HeaderLinkStyle = css`
  display: flex;
  align-items: center;
  text-decoration: none;
  user-select: none;
  &:hover {
    color: ${lighten(0.1, linkTextColor)};
  }
  &:active {
    color: ${lighten(0.2, linkTextColor)};
  }
`;

const NavBar: React.FC = ({ children }) => {
  const LinkStyle = React.useCallback(
    isMinimal =>
      css`
        font-size: ${isMinimal ? '.8em' : '1em'};
        padding: ${isMinimal ? '0px 10px' : '0px 10px'};
        color: ${linkTextColor};
        &:hover {
          color: ${lighten(0.5, linkTextColor)};
          background: rgba(0, 0, 0, 0.2);
        }
        &:active {
          color: ${lighten(0.6, linkTextColor)};
          background: rgba(0, 0, 0, 0.3);
        }
      `,
    [],
  );

  return (
    <Header>
      <LinkButton href="/" css={[HeaderLinkStyle, LinkStyle(false)]} minimal>
        <FontAwesomeIcon
          css={{
            paddingRight: 4,
            fontSize: '.8em',
          }}
          icon={faScroll}
        />
        Phase 10 Scorer
      </LinkButton>
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
    </Header>
  );
};

export default NavBar;
