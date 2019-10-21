import React from 'react';
import styled from '@emotion/styled';
import { useAppTheme } from '../../theming/AppThemeProvider';
import { rgba, darken } from 'polished';

const CardContainer: React.FC = props => {
  const theme = useAppTheme();

  const InnerCardContainer = styled.div`
    > * {
      display: grid;
      padding: 4px;
      border-radius: 4px;
      background-color: ${theme.default.primaryBgAlt};
      box-shadow: 0 4px 8px 0 ${rgba(darken(0.9, theme.default.primary), 0.2)},
        0 6px 20px 0 ${rgba(darken(0.9, theme.default.primary), 0.19)};
    }
  `;

  return <InnerCardContainer>{props.children}</InnerCardContainer>;
};

export default CardContainer;
