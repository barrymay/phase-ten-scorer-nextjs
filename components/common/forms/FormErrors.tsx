/** @jsx jsx */
import { jsx } from '@emotion/core';
import { transparentize } from 'polished';
import React from 'react';
import { FieldErrors } from 'react-hook-form/dist/types';

interface IFormErrorsProps {
  errors: FieldErrors<any>;
  className?: string;
}

const FormErrors: React.FC<IFormErrorsProps> = ({ errors, className }) => {
  return errors && Object.keys(errors).length ? (
    <ul
      className={className}
      css={{
        border: '1px solid red',
        backgroundColor: transparentize(0.8, 'red'),
        paddingLeft: 20,
        margin: 0,
        li: {
          paddingLeft: 0,
        },
      }}
    >
      {errors &&
        Object.keys(errors)
          .filter(item => errors[item] && !!errors[item]!.message)
          .map(item => (
            <li data-testid={`formError-${item}`} key={item}>
              <span>{errors[item]!.message}</span>
            </li>
          ))}
    </ul>
  ) : null;
};

export default FormErrors;
