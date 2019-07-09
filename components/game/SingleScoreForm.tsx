/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import useForm from 'react-hook-form';
import ValidatedInput from '../common/forms/ValidatedInput';
import { IRoundPlayerData } from '../context/TournamentContext';
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
    round: IRoundPlayerData | undefined;
    onSubmitScore: (result: IRoundPlayerData) => void;
  }
> = forwardRef(({ round, onSubmitScore }, ref) => {
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
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (round) {
      setValue('score', '' + round.score);
      setValue('phaseCompleted', '' + round.phaseCompleted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

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

  const onSubmit = () => {
    let { score, phaseCompleted } = getValues();
    // TODO - this if check shouldn't need to occur
    if (score && phaseCompleted) {
      onSubmitScore({
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
          <ValidatedInput
            name="phaseCompleted"
            autoComplete="off"
            onInput={restrictInput}
            tabIndex={tabIndex}
            errors={errors}
            inputRef={register({
              required: 'A phase must is required (0 if no phase completed)',
              validate: (inputScore: string) => {
                let value = +inputScore;
                if (value < 0 || value > 10) {
                  return 'A valid phase (from 0 to 10) must be entered';
                }
              },
            })}
            type="text"
          />
        </label>
      </form>
    </React.Fragment>
  );
});

export default SingleScoreForm;
