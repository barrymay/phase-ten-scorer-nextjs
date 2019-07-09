/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { faUserPlus, faUserSlash } from '@fortawesome/pro-regular-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { ignoreElements, map, pluck, withLatestFrom } from 'rxjs/operators';
import P10Button from '../common/button/P10Button';
import { CardContainer } from '../common/styles/basic';
import { usePlayersDispatch, usePlayersState } from '../context/PlayersContext';
import PlayerList from './PlayerList';

const PlayerNameInput = styled.input`
  max-width: 200px;
  margin-left: 4px;
`;

const PlayerEntry = styled.div({
  display: 'flex',
  alignItems: 'center',
});

export const PlayerSetupControl: React.FC = () => {
  const dispatchPlayers = usePlayersDispatch();
  const players = usePlayersState();
  const [name, setName] = useState('');
  const [triggerFocus, setTriggerFocus] = useState(false);
  const textRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);

  const addPlayer = (name: string) => {
    dispatchPlayers({ type: 'ADD', playerName: name.trim() });
    setName('');
    setTriggerFocus(true);
  };

  const clickAdd = () => {
    addPlayer(name);
  };

  const clearAll = () => {
    dispatchPlayers({ type: 'SET', players: {} });
    setName('');
  };

  const [changeCallback] = useEventCallback<
    React.ChangeEvent<HTMLInputElement>
  >(event$ =>
    event$.pipe(
      pluck('target', 'value'),
      map(value => {
        value = value.slice(0, 20).replace(/[^\w\d\s]/g, '');
        setName(value);
      }),
    ),
  );

  const [keyUpCallback] = useEventCallback<
    React.KeyboardEvent<HTMLInputElement>,
    undefined,
    [typeof name]
  >(
    (event$, input$) => {
      return event$.pipe(
        withLatestFrom(input$),
        map(([event, input]) => {
          switch (event.key) {
            case 'Enter':
              addPlayer(input[0]);
              break;
            case 'Escape':
              setName('');
              break;
          }
          return;
        }),
        ignoreElements(),
      );
    },
    undefined,
    [name],
  );

  useEffect(() => {
    let { current: input } = textRef;
    if (triggerFocus && input) {
      input.focus();
    }
    setTriggerFocus(false);
  }, [triggerFocus]);

  return (
    <CardContainer>
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <div data-testid="player-counter">
          Players: {Object.keys(players).length}
        </div>
        <PlayerEntry>
          <label htmlFor="player_add_input">Player Name:</label>
          <PlayerNameInput
            id="player_add_input"
            ref={textRef}
            value={name}
            onChange={changeCallback}
            onKeyUp={keyUpCallback}
            type="text"
          />
          <P10Button
            css={css`
              margin-left: 4px;
            `}
            onClick={clickAdd}
            faIconDef={faUserPlus}
            title="Add Player"
            minimal
          />
        </PlayerEntry>
        <PlayerList players={players} />
        <div
          css={css`
            padding-top: 2px;
            display: flex;
            justify-content: flex-end;
          `}
        >
          <P10Button minimal faIconDef={faUserSlash} onClick={clearAll}>
            Clear All
          </P10Button>
        </div>
      </div>
    </CardContainer>
  );
};

export default PlayerSetupControl;
