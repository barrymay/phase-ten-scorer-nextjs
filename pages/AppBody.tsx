import { css } from 'twin.macro';
import { useAppTheme } from '../components/theming/AppThemeProvider';

const AppBody: React.FC = (props) => {
  const theme = useAppTheme();
  return (
    <div
      tw="flex-auto text-black dark:text-white"
      css={css`
        background-color: ${theme.default.primaryBg};
      `}
    >
      {props.children}
    </div>
  );
};

export default AppBody;
