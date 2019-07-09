/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import P10Button, { ExtraP10ButtonProps } from './P10Button';

export interface ILinkButtonProps extends ExtraP10ButtonProps {
  href: string;
}

const LinkButton: React.FC<ILinkButtonProps> = ({
  children,
  ...buttonProps
}) => {
  return (
    <P10Button renderAs="Link" {...buttonProps}>
      {children}
    </P10Button>
  );
};

export default LinkButton;
