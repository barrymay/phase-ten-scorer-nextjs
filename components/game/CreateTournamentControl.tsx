/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Router from 'next/router';
import React, { useEffect } from 'react';
import useForm from 'react-hook-form';
import FormErrors from '../common/forms/FormErrors';
import { useTournamentContext } from '../context/TournamentContext';
import PlayerSelector from './PlayerSelector';
import { CardContainer } from '../common/styles/basic';

interface IFormData {
  tourneyName: string;
  players: string[];
}

const CreateTournamentControl: React.FC = () => {
  const {
    handleSubmit,
    register,
    errors,
    getValues,
    setValue,
    triggerValidation,
  } = useForm<IFormData>({
    mode: 'onSubmit',
    defaultValues: {
      players: [],
    },
  });
  const { tournaments, addTournament } = useTournamentContext();
  const tournamentNames = tournaments.map(item => item.name);

  useEffect(() => {
    register(
      { name: 'players' },
      {
        validate: (inputValue: string[]) => {
          if (!inputValue || !Array.isArray(inputValue)) {
            return 'Invalid result from player list';
          }
          if (!inputValue.length) {
            return 'At least one player must be selected';
          } else if (inputValue.length > 4) {
            return 'Only 4 players are allowed';
          }
          return '';
        },
      },
    );
  }, [register]);

  const onSubmit = (submitVal: any) => {
    const name = getValues().tourneyName;
    const players = getValues().players;
    const newTournament = addTournament({ name, players });
    Router.push(`/GameView/${newTournament.id}`);
  };

  const onPlayerSelectorChange = (newValue: string[]) => {
    setValue('players', newValue);
    triggerValidation({
      name: 'players',
    });
  };

  const styledLabel = css`
    padding-bottom: 4px;
  `;

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
      <div className="header">Tournament Manager</div>
      <CardContainer>
        <form
          css={{
            width: 280,
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label css={styledLabel}>
            Tournament Name:
            <input
              css={css`
                width: 100%;
              `}
              data-testid="tourneyName"
              name="tourneyName"
              autoComplete="off"
              ref={register({
                maxLength: {
                  value: 20,
                  message: 'Tournament Name must be less than 20 characters',
                },
                required: 'Tournament Name is required',
                validate: (name: string) => {
                  if (tournamentNames.includes(name)) {
                    return `Tournament name '${name}' is already in use`;
                  }
                },
              })}
              type="text"
            />
          </label>
          <label css={styledLabel}>
            Selected Players:
            <PlayerSelector onChange={onPlayerSelectorChange} />
          </label>
          <FormErrors css={{ marginTop: 10 }} errors={errors} />
          <div
            css={{ display: 'flex', marginTop: 10, justifyContent: 'flex-end' }}
          >
            <button type="submit">Submit</button>
          </div>
        </form>
      </CardContainer>
    </div>
  );
};

export default CreateTournamentControl;
