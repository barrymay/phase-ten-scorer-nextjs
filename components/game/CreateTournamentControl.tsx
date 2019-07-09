/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { navigate } from '@reach/router';
import React, { useEffect } from 'react';
import useForm from 'react-hook-form';
import { DataType, ErrorMessages } from 'react-hook-form/dist/types';
import FormErrors from '../common/forms/FormErrors';
import { useTournamentContext } from '../context/TournamentContext';
import PlayerSelector from './PlayerSelector';

interface IFormData {
  tourneyName: string;
  players: string[];
}

interface IErrorProps {
  errors: ErrorMessages<DataType>;
  className?: string;
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
    let name = getValues().tourneyName;
    let players = getValues().players;
    addTournament({ name, players });
    navigate('/');
  };

  const onPlayerSelectorChange = (newValue: string[]) => {
    setValue('players', newValue);
    triggerValidation({
      name: 'players',
    });
  };

  const styledLabel = css`
    padding-top: 4;
    padding-right: 4;
  `;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <form
        css={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          width: 280,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label css={styledLabel}>
          Tournament Name:
          <input
            css={{ width: '100%' }}
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
    </div>
  );
};

export default CreateTournamentControl;
