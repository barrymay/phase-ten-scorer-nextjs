/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import {
  dom,
  icon,
  IconName,
  IconDefinition,
} from '@fortawesome/fontawesome-svg-core';
import React, {
  Props,
  PropsWithChildren,
  DetailedHTMLProps,
  Component,
  useContext,
} from 'react';
import { NextAppContext } from 'next/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IFontAwesomeServerProps extends DetailedHTMLProps<any, any> {
  iconDef: IconDefinition;
}

export const FontAwesomeServerIcon: React.FC<
  IFontAwesomeServerProps
> = props => {
  const isServer = typeof window === 'undefined';
  const { iconDef, ...otherProps } = props;
  const iconValue = icon({
    prefix: iconDef.prefix,
    iconName: iconDef.iconName,
  });

  const iconHTML = iconValue ? iconValue.html : `failed ${iconDef.iconName}`;
  return isServer ? (
    <div
      {...otherProps}
      dangerouslySetInnerHTML={{
        __html: `${iconHTML}`,
      }}
    ></div>
  ) : (
    <FontAwesomeIcon icon={iconDef}></FontAwesomeIcon>
  );
};

export default FontAwesomeServerIcon;
