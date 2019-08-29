/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import P10Button from './button/P10Button';
import {
  faSignOutAlt as faSignOut,
  faSignInAlt as faSignIn,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
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
    window.location.href = `${window.location.origin}/login`;
  };

  const logout = () => {
    window.location.href = `${window.location.origin}/logout`;
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
