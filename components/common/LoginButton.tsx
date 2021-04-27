import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faSignIn, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import React, { Fragment } from 'react';
import P10Button from './button/P10Button';

const LoginStyles = styled.div`
  display: flex;
  align-items: center;
  label {
    font-size: 0.8em;
  }
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
            iconRight
            title="Log out"
            onClick={() => logout()}
          >
            <img
              width={32}
              css={css`
                border-radius: 4px;
              `}
              title={user.displayName}
              src={user.picture}
            ></img>
          </P10Button>
        </Fragment>
      )}
    </LoginStyles>
  );
};

export default LoginButton;
