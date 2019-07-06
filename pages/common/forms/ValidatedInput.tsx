/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { DataType, ErrorMessages } from 'react-hook-form/dist/types';
import FontAwesomeServerIcon from '../font-awesome/FontAwesomeServerIcon';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

interface OwnProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  inputRef: ((ref: any) => void) | undefined;
  errors?: ErrorMessages<DataType>;
}

const ValidatedInput: React.FC<OwnProps> = ({
  name,
  inputRef,
  errors,
  ...inputProps
}) => {
  if (!name) {
    throw new Error(`${ValidatedInput.name} requires name attribute`);
  }
  const error = errors && errors[name];
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        border: 1px solid black;
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
        <FontAwesomeServerIcon
          title={error.message}
          iconDef={faTimes}
          css={css`
            color: red;
          `}
        />
      )}
    </div>
  );
};

export default ValidatedInput;
