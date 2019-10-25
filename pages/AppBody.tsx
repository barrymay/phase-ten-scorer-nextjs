/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useAppTheme } from '../components/theming/AppThemeProvider';

const AppBody: React.FC = props => {
  const theme = useAppTheme();
  return (
    <div
      css={css`
        flex: 1 1 auto;
        color: ${theme.default.primary};
        background-color: ${theme.default.primaryBg};
      `}
    >
      {props.children}
    </div>
  );
};

export default AppBody;