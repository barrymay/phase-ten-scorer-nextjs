/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import P10Button from './button/P10Button';
import {
  faSignOut,
  faSignIn,
  faSpinner,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Router from 'next/router';

const LoginStyles = styled.div`
  display: flex;
  align-items: center;
`;
const LoginButton: React.FC<{ className?: string; user: any }> = ({
  className,
  user,
}) => {
  const login = () => {
    Router.push('/login');
  };

  const logout = () => {
    Router.push('/logout');
  };

  // TODO: Remove hardcoded width
  return (
    <LoginStyles>
      <div>
        {!user && (
          <P10Button
            minimal
            className={className}
            faIconDef={faSignIn}
            title="Log in"
            onClick={() => login()}
          />
        )}

        {user && (
          <Fragment>
            <P10Button
              minimal
              className={className}
              faIconDef={faSignOut}
              title="Log out"
              onClick={() => logout()}
            />
          </Fragment>
        )}
      </div>
    </LoginStyles>
  );
};

export default LoginButton;
