/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Fragment } from 'react';
import { useAuth0 } from '../common/auth/react-auth0-wrapper';
import styled from '@emotion/styled';
import P10Button from './button/P10Button';
import {
  faSignOutAlt as faSignOut,
  faSignInAlt as faSignIn,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginStyles = styled.div`
  display: flex;
  align-items: center;
`;
const LoginButton: React.FC<{ className?: string }> = ({ className }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    loading,
    user,
  } = useAuth0();

  // TODO: Remove hardcoded width
  return (
    <LoginStyles>
      {loading ? (
        <div
          css={css`
            width: 45.59px;
          `}
        ></div>
      ) : (
        <div>
          {!isAuthenticated && (
            <P10Button
              minimal
              className={className}
              faIconDef={faSignIn}
              title="Log in"
              onClick={() => loginWithRedirect({})}
            />
          )}

          {isAuthenticated && (
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
      )}
    </LoginStyles>
  );
};

export default LoginButton;
