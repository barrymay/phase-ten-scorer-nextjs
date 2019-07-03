
import * as React from 'react';
import { render } from 'react-testing-library';
import { usePlayersState, usePlayersDispatch, PlayersProvider } from '../../../pages/context/PlayersContext';

const Sample: React.FC = () => {
  const players = usePlayersState();
  const playerDispatch = usePlayersDispatch();

  React.useEffect(() => {
    playerDispatch({ type: 'REMOVE', playerId: 'Invalid' });
    playerDispatch({ type: 'REMOVE', playerId: 'Invalid2' });

    playerDispatch({
      type: 'SET',
      players: {
        Test1: {
          id: 'Test1',
          name: 'TestName',
          losses: 0,
          wins: 0,
        },
      },
    });

    playerDispatch({ type: 'ADD', playerName: 'Barry' });

    //@ts-ignore - testing non-action reducer
    playerDispatch({ type: 'foo' });
  }, [playerDispatch]);

  return <div data-testid="test-length">{Object.keys(players).length}</div>;
};

const Sample1: React.FC = () => {
  usePlayersState();
  return <div />;
};

const Sample2: React.FC = () => {
  usePlayersDispatch();
  return <div />;
};

it('Player Provider - test all reducer states', () => {
  const { getByTestId } = render(
    <PlayersProvider>
      <Sample />
    </PlayersProvider>
  );

  const value = getByTestId('test-length');
  expect(value.textContent).toMatch('2');
});

it('Player Provider - fail state when no context', () => {
  expect(() => render(<Sample1 />)).toThrowError(
    /usePlayersState must be used in/
  );
});

it('Player Provider - fail state when no context', () => {
  expect(() => render(<Sample2 />)).toThrowError(
    /usePlayersDispatch must be used in/
  );
});

it('Player Provider - fail state when no context', () => {
  expect(() =>
    render(
      <PlayersProvider testValue={'loading'}>
        <Sample1 />
      </PlayersProvider>
    )
  ).toThrowError(/Player state is not loaded/);
});
