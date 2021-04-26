/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, {
  FormEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import ValidatedInput from '../common/forms/ValidatedInput';
import { IPlayer } from '../context/PlayersContext';
import { IRoundPlayerData } from '../context/TournamentContext';
import PhaseScorer from './PhaseScorer';
import { ISingleScoreFormFuncs } from './ScoringWizard';

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

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IFormData>({
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
    register('phaseCompleted');
  }, [register]);

  useEffect(() => {
    setValueRef.current('phaseCompleted', `${inputPhase || 0}`);
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
    const { score, phaseCompleted } = getValues();
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
            type="number"
            pattern="\d*"
            autoComplete="off"
            onInput={restrictInput}
            errors={errors}
            tabIndex={tabIndex}
            inputRef={(registerRef) => {
              register('score', {
                required: 'Score is required',
                validate: (inputScore: string | null) => {
                  if (inputScore) {
                    const value = +inputScore;
                    return (
                      (value >= 0 && value <= 500) ||
                      'Score must be between 0 and 500'
                    );
                  }
                },
              });
              scoreRef.current = registerRef;
            }}
          />
        </label>
        <label>
          Completed Phase:
          <PhaseScorer
            css={css`
              max-width: 100%;
            `}
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
