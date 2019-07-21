/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import useForm from 'react-hook-form';
import ValidatedInput from '../common/forms/ValidatedInput';
import { IRoundPlayerData } from '../context/TournamentContext';
import { ISingleScoreFormFuncs } from './ScoringWizard';
import PhaseScorer from './PhaseScorer';
import { IPlayer } from '../context/PlayersContext';

// validation will prevent non-numerics
interface IFormData {
  playerId: string;
  score: string | null;
  phaseCompleted: string | null;
}

const formStyle = css`
  display: flex;
  flex-direction: column;
  label {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }
`;

const SingleScoreForm: React.ForwardRefExoticComponent<
  React.RefAttributes<ISingleScoreFormFuncs> & {
    player: IPlayer;
    onSubmitScore: (playerId: string, result: IRoundPlayerData) => void;
    inputPhase?: number;
  }
> = forwardRef(({ onSubmitScore, inputPhase, player }, ref) => {
  const [tabIndex, setTabIndex] = useState(0);
  const scoreRef = useRef<HTMLInputElement | null>(null);

  const { handleSubmit, register, errors, getValues, setValue } = useForm<
    IFormData
  >({
    mode: 'onSubmit',
    defaultValues: {
      score: null,
      phaseCompleted: null,
    },
  });
  // HACK - useForm should prevent updates on its own setValue being mutated
  const setValueRef = useRef(setValue);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    register({ name: 'phaseCompleted' });
  }, [register]);

  useEffect(() => {
    if (inputPhase && inputPhase > 0) {
      setValueRef.current('phaseCompleted', '' + inputPhase);
    }
  }, [inputPhase]);

  useImperativeHandle<ISingleScoreFormFuncs, ISingleScoreFormFuncs>(
    ref,
    () => ({
      performSubmit() {
        formRef.current && formRef.current.dispatchEvent(new Event('submit'));
      },
      setFocus() {
        setTimeout(() => {
          scoreRef.current && scoreRef.current.focus();
        }, 100);
      },
      enableTabIndex(enabled: boolean) {
        setTabIndex(enabled ? 0 : -1);
      },
    }),
  );

  const updatePhase = useCallback(
    (phase: number | undefined) => {
      setValue('phaseCompleted', `${phase || ''}`);
    },
    [setValue],
  );

  const onSubmit = () => {
    let { score, phaseCompleted } = getValues();
    // TODO - this if check shouldn't need to occur
    if (score && phaseCompleted) {
      onSubmitScore(player.id, {
        score: +score,
        phaseCompleted: +phaseCompleted,
      });
    }
  };

  const restrictInput = (e: FormEvent<HTMLInputElement>) => {
    const newValue =
      e.currentTarget && e.currentTarget.value.replace(/[^\d]/g, '');
    setValue(e.currentTarget.name as keyof IFormData, newValue);
  };

  return (
    <React.Fragment>
      <form css={formStyle} ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <label>
          Score:
          <ValidatedInput
            name="score"
            autoComplete="off"
            onInput={restrictInput}
            errors={errors}
            tabIndex={tabIndex}
            inputRef={registerRef => {
              register(registerRef, {
                required: 'Score is required',
                validate: (inputScore: string) => {
                  let value = +inputScore;
                  if (value < 0 || value > 500) {
                    return 'Score must be between 0 and 500';
                  }
                  return '';
                },
              });
              scoreRef.current = registerRef;
            }}
            type="text"
          />
        </label>
        <label>
          Completed Phase:
          <PhaseScorer
            player={player}
            startingPhase={inputPhase}
            onMarkedPhaseUpdate={updatePhase}
          />
        </label>
      </form>
    </React.Fragment>
  );
});

export default SingleScoreForm;
