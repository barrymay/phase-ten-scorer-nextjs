/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { faUserPlus, faUserSlash } from '@fortawesome/pro-regular-svg-icons';
import React, { useEffect, useRef, useState, Fragment } from 'react';
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

  const keyHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addPlayer(event.currentTarget.value);
    } else if (event.key === 'Escape') {
      setName('');
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
      .slice(0, 20)
      .replace(/[^\w\d\s]/g, '');
    setName(newValue);
  };

  useEffect(() => {
    let { current: input } = textRef;
    if (triggerFocus && input) {
      input.focus();
    }
    setTriggerFocus(false);
  }, [triggerFocus]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        .header {
          justify-content: center;
          padding: 5px 0px 10px 0px;
          font-weight: 700;
        }
      `}
    >
      <div className="header">Player Setup</div>
      <CardContainer>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            .list-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 2px;
              .list-header-name {
                font-weight: bold;
              }
              button {
                padding-top: 0px;
                padding-bottom: 0px;
              }
            }
            .list-label {
              font-weight: bold;
              padding-bottom: 2px;
            }
          `}
        >
          <div className="list-header">
            <div className="list-header-name" data-testid="player-counter">
              Players: {Object.keys(players).length}
            </div>
            <P10Button minimal faIconDef={faUserSlash} onClick={clearAll}>
              Clear All
            </P10Button>
          </div>
          <div>
            <PlayerEntry>
              <label htmlFor="player_add_input">Player Name:</label>
              <PlayerNameInput
                id="player_add_input"
                ref={textRef}
                value={name}
                onChange={changeHandler}
                onKeyUp={keyHandler}
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
          </div>
          <div className="list-label" data-testid="player-counter">
            Players:
          </div>
          <PlayerList players={players} />
          <div
            css={css`
              padding-top: 2px;
              display: flex;
              justify-content: flex-end;
            `}
          ></div>
        </div>
      </CardContainer>
    </div>
  );
};

export default PlayerSetupControl;
