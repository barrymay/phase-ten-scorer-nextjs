import styled from '@emotion/styled';

export const CardContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '> *': {
    marginTop: 10,
    padding: 4,
    borderRadius: 4,
    boxShadow: [
      '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
      '0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    ],
  },
});
