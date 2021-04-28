import { css } from '@emotion/react';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldErrors } from 'react-hook-form/dist/types';
import tw from 'twin.macro';
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
  if (!name) {
    throw new Error(`${ValidatedInput.name} requires name attribute`);
  }
  const error = errors?.[name];
  return (
    <div
      css={css`
        ${tw`flex items-center border-2 border-gray-100`}
        ${error && tw`border-2 border-red-500`}
        > input {
          &:focus,
          &:hover,
          &:active {
            ${tw`outline-none`}
          }
          ${tw`flex border-none w-full`}
        }
        > svg {
          ${tw`pr-1`}
        }
      `}
    >
      <input {...inputProps} name={name} ref={inputRef} type="text" />
      {error && (
        <FontAwesomeIcon
          title={error.message}
          icon={faTimes}
          tw="text-red-500"
        />
      )}
    </div>
  );
};

export default ValidatedInput;
