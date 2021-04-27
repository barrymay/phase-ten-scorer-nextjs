import { css } from '@emotion/react';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldErrors } from 'react-hook-form/dist/types';
import { useAppTheme } from '../../theming/AppThemeProvider';

interface OwnProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  inputRef: ((ref: any) => void) | undefined;
  errors?: FieldErrors<any>;
}

const ValidatedInput: React.FC<OwnProps> = ({
  name,
  inputRef,
  errors,
  ...inputProps
}) => {
  const theme = useAppTheme();
  if (!name) {
    throw new Error(`${ValidatedInput.name} requires name attribute`);
  }
  const error = errors && errors[name];
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        border: 1px solid ${theme.default.border};
        > input {
          &:focus,
          &:hover,
          &:active {
            outline: none;
          }
          flex: 1 1 auto;
          border: none;
          width: 100%;
        }
        > svg {
          padding-right: 4px;
        }
      `}
    >
      <input {...inputProps} name={name} ref={inputRef} type="text" />
      {error && (
        <FontAwesomeIcon
          title={error.message}
          icon={faTimes}
          css={css`
            color: red;
          `}
        />
      )}
    </div>
  );
};

export default ValidatedInput;
