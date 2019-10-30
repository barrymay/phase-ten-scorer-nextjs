import styled from '@emotion/styled';
import { rgba, darken } from 'polished';
import { AppTheme } from '../../theming/themes';

interface IOwnProps {
  theme: AppTheme;
}

const boxShadow = (props: IOwnProps) =>
  `0 4px 8px 0 ${rgba(darken(0.9, props.theme.default.primary), 0.2)},
   0 6px 20px 0 ${rgba(darken(0.9, props.theme.default.primary), 0.19)}`;

export const CardContainer = styled.div<IOwnProps>`
  > * {
    display: grid;
    padding: 4px;
    border-radius: 4px;
    background-color: ${(props: IOwnProps) => props.theme.default.primaryBgAlt};
    box-shadow: ${(props: IOwnProps) => boxShadow(props)};
  }
`;
