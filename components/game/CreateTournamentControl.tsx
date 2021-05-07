import Router from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import tw, { css } from 'twin.macro';
import LinkButton from '../common/button/LinkButton';
import FormErrors from '../common/forms/FormErrors';
import { CardContainer } from '../common/styles/basic';
import { usePlayersState } from '../context/PlayersContext';
import { useTournamentContext } from '../context/TournamentContext';
import { useAppTheme } from '../theming/AppThemeProvider';
import PlayerSelector from './PlayerSelector';

interface IFormData {
  tourneyName: string;
  players: string[];
}

const CreateTournamentControl: React.FC = () => {
  const players = usePlayersState();

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useForm<IFormData>({
    mode: 'onSubmit',
    defaultValues: {
      players: [],
    },
  });
  const theme = useAppTheme();

  const { tournaments, addTournament } = useTournamentContext();
  const tournamentNames = tournaments.map((item) => item.name);

  useEffect(() => {
    register('players', {
      validate: (inputValue: string[]) => {
        if (!inputValue || !Array.isArray(inputValue)) {
          return 'Invalid result from player list';
        }
        if (!inputValue.length) {
          return 'At least one player must be selected';
        } else if (inputValue.length > 4) {
          return 'Only 4 players are allowed';
        }
      },
    });
  }, [register]);

  const onSubmit = (submitVal: any) => {
    const name = getValues().tourneyName;
    const players = getValues().players;
    const newTournament = addTournament({ name, players });
    Router.push(`/GameView/${newTournament.id}`);
  };

  const onPlayerSelectorChange = (newValue: string[]) => {
    setValue('players', newValue);
    trigger('players');
  };

  const styledLabel = css`
    ${tw`pb-4`}
  `;

  return (
    <div
      css={css`
        ${tw`flex flex-col items-center`}
        .header {
          ${tw`justify-center pt-1 pb-2 font-weight[700]`}
        }
      `}
    >
      <div className="header">Tournament Manager</div>
      <CardContainer theme={theme}>
        <form
          css={{
            width: 280,
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label css={styledLabel}>
            Tournament Name:
            <input
              tw="w-full"
              data-testid="tourneyName"
              autoComplete="off"
              {...register('tourneyName', {
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
            {players.length ? (
              <PlayerSelector onChange={onPlayerSelectorChange} />
            ) : (
              <div tw="flex items-center justify-center">
                <div tw="flex justify-center">No Players Defined - </div>
                <LinkButton minimal href={'/PlayerSetup'}>
                  Setup
                </LinkButton>
              </div>
            )}
          </label>
          <FormErrors css={{ marginTop: 10 }} errors={errors} />
          <div tw="flex mt-1" css={{ justifyContent: 'flex-end' }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </CardContainer>
    </div>
  );
};

export default CreateTournamentControl;
