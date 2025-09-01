import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Controller,
  FieldPath,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Input } from 'ui/components/Input';
import { Checkbox } from 'ui/components/Checkbox';
import { Select } from 'ui/components/Select';
import {
  Degree,
  DegreeLevel,
  SalaryPeriod,
  TravelModeEnum,
  WEEK_HOURS,
  WeekHours,
} from '@repo/dto';
import { Textarea } from 'ui/components/Textarea';
import { Switch } from 'ui/components/Switch';
import { SwitchOption } from 'types/ui/SwitchOption';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { RowContainer } from 'ui/containers/RowContainer';
import { SkillChip } from 'ui/components/SkillChip';
import {
  FormCol,
  FormRow,
  Label,
  Section,
  SectionTitle,
} from 'ui/components/FormElements';
import { Button } from 'ui/components/Button';
import { SquaredButton } from 'ui/components/SquareButton';
import { Separator } from 'ui/components/Separator';
import styled from 'styled-components';
import { useI18n } from 'hooks/useI18n';

export type CandidateFormHandles = {
  submitForm: () => void;
};

type FocusRole = {
  role: string;
};

type TravelOption = {
  travelMode: TravelModeEnum;
  minutesOfRoad?: number;
  onSiteDays?: number;
};

type Flags = 'unemployed';

export type CandidateFormState = {
  candidateName: string;
  age: number;
  location: string;
  unemployed: boolean;
  currentEmployer?: string;
  currentPosition?: string;
  experienceDescription: string;
  yearsOfExperience: number;
  degrees: Degree[];
  focusRoles: FocusRole[];
  ambitions?: string;
  salaryPeriod: SalaryPeriod;
  grossSalary: number;
  hoursAWeek: WeekHours;
  hardSkills: string[];
  travelOptions: TravelOption[];
};

interface CandidateFormProps {
  defaultValues?: Partial<CandidateFormState>;
  onSubmit: SubmitHandler<CandidateFormState>;
}

const TravelOptionWrapper = styled.div`
  position: relative;
`;

const TravelOptionDeleteButton = styled(SquaredButton)`
  position: absolute;
  top: -${({ theme }) => theme.spacing.xs};
  right: 0;
`;

export const candidateFormDefaultValues: CandidateFormState = {
  candidateName: '',
  age: 1,
  location: '',
  unemployed: false,
  currentEmployer: '',
  currentPosition: '',
  experienceDescription: '',
  yearsOfExperience: 0,
  degrees: [],
  focusRoles: [
    {
      role: '',
    },
  ],
  salaryPeriod: SalaryPeriod.YEAR,
  grossSalary: 0,
  hoursAWeek: 40,
  hardSkills: [],
  travelOptions: [
    {
      travelMode: TravelModeEnum.REMOTE,
    },
  ],
};

const salaryPeriodValues = Object.values(SalaryPeriod);

if (salaryPeriodValues.length !== 2) {
  throw new Error(
    `Expected exactly 2 SalaryPeriod values, got ${salaryPeriodValues.length}`,
  );
}

const salarySwitchOptions = salaryPeriodValues.map((el) => ({
  label: el,
  value: el,
})) as [SwitchOption, SwitchOption];

const flagToFields: {
  [key in Flags]: FieldPath<CandidateFormState>[];
} = {
  unemployed: ['currentPosition', 'currentEmployer'],
};

// TODO refactor the form with widgets
export const CandidateForm = forwardRef<
  CandidateFormHandles,
  CandidateFormProps
>(({ defaultValues, onSubmit }, ref) => {
  const { t } = useI18n();
  const { control, handleSubmit, setValue, setError, watch } =
    useForm<CandidateFormState>({
      defaultValues: {
        ...candidateFormDefaultValues,
        ...defaultValues,
      },
    });

  const { fields, append, remove } = useFieldArray<
    CandidateFormState,
    'focusRoles',
    'id'
  >({
    name: 'focusRoles',
    control,
  });

  const {
    fields: degreeFields,
    append: appendDegree,
    remove: removeDegree,
  } = useFieldArray<CandidateFormState, 'degrees', 'id'>({
    name: 'degrees',
    control,
  });

  const {
    fields: travelModeFields,
    append: appendTravelMode,
    remove: removeTravelMode,
  } = useFieldArray<CandidateFormState, 'travelOptions', 'id'>({
    name: 'travelOptions',
    control,
  });

  // Flags sections
  const unemployed = watch('unemployed');

  const flags = { unemployed } satisfies Record<Flags, boolean>;

  const hardSkillsInputRef = useRef<HTMLInputElement>(null);
  const hardSkills = watch('hardSkills');

  const addHardSkill = (newHard: string) => {
    if (!hardSkills.includes(newHard))
      setValue('hardSkills', [...hardSkills, newHard]);
  };

  const removeHardSkill = (oldHard: string) => {
    const updatedSkills = hardSkills.filter((skill) => skill !== oldHard);

    setValue('hardSkills', updatedSkills);
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onSubmit),
  }));

  useEffect(() => {
    (Object.keys(flags) as Flags[]).forEach((flag) => {
      flagToFields[flag]?.forEach((name) => setError(name, {}));
    });
  }, [JSON.stringify(flags)]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.personalInformation')}</SectionTitle>
        <FormRow>
          <FormCol>
            <Label htmlFor="candidateName">{t('forms.candidate.fields.fullName.label')}</Label>
            <Controller
              name="candidateName"
              control={control}
              rules={{
                required: t('forms.candidate.fields.fullName.error'),
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder={t('forms.candidate.fields.fullName.placeholder')}
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="age">{t('forms.candidate.fields.age.label')}</Label>
            <Controller
              name="age"
              control={control}
              rules={{
                required: t('forms.candidate.fields.age.error'),
                min: {
                  value: 1,
                  message: t('forms.candidate.fields.age.minError'),
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  placeholder={t('forms.candidate.fields.age.placeholder')}
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
        </FormRow>
        <Label htmlFor="location">{t('forms.candidate.fields.location.label')}</Label>
        <Controller
          name="location"
          control={control}
          rules={{
            required: t('forms.candidate.fields.location.error'),
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={t('forms.candidate.fields.location.placeholder')}
              error={fieldState.error?.message}
            />
          )}
        />
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.employmentInformation')}</SectionTitle>
        <FormRow>
          <FormCol>
            <Controller
              name="unemployed"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  checked={value}
                  onCheck={onChange}
                  label={t('forms.candidate.fields.unemployed.label')}
                />
              )}
            />
          </FormCol>
        </FormRow>
        <FormRow>
          <FormCol>
            <Label htmlFor="currentEmployer">{t('forms.candidate.fields.currentEmployer.label')}</Label>
            <Controller
              name="currentEmployer"
              control={control}
              rules={{
                required: {
                  value: !unemployed,
                  message: t('forms.candidate.fields.currentEmployer.error'),
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder={t('forms.candidate.fields.currentEmployer.placeholder')}
                  error={fieldState.error?.message}
                  disabled={unemployed}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="currentPosition">{t('forms.candidate.fields.currentPosition.label')}</Label>
            <Controller
              name="currentPosition"
              control={control}
              rules={{
                required: {
                  value: !unemployed,
                  message: t('forms.candidate.fields.currentPosition.error'),
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder={t('forms.candidate.fields.currentPosition.placeholder')}
                  error={fieldState.error?.message}
                  disabled={unemployed}
                />
              )}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.workExperience')}</SectionTitle>
        <FormRow>
          <FormCol>
            <Label htmlFor="experienceDescription">
              {t('forms.candidate.fields.experienceDescription.label')}
            </Label>
            <Controller
              name="experienceDescription"
              control={control}
              rules={{
                required: t('forms.candidate.fields.experienceDescription.error'),
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder={t('forms.candidate.fields.experienceDescription.placeholder')}
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
          <FormCol $width={130}>
            <Label htmlFor="yearsOfExperience">{t('forms.candidate.fields.yearsOfExperience.label')}</Label>
            <Controller
              name="yearsOfExperience"
              control={control}
              rules={{
                required: t('forms.candidate.fields.yearsOfExperience.error'),
                min: {
                  value: 0,
                  message: t('forms.candidate.fields.yearsOfExperience.minError'),
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder={t('forms.candidate.fields.yearsOfExperience.placeholder')}
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.educationInformation')}</SectionTitle>
        {degreeFields.map((field, index) => (
          <FormRow key={field.id}>
            <FormCol $width={200}>
              <Controller
                name={`degrees.${index}.level`}
                control={control}
                rules={{
                  required: t('forms.candidate.fields.degreeLevel.error'),
                }}
                render={({ field: { value, onChange }, fieldState }) => (
                  <Select<DegreeLevel>
                    selectedValues={value ? [value] : []}
                    onSelect={(selectedValue) => {
                      onChange(selectedValue[0]);
                    }}
                    options={Object.values(DegreeLevel).map((el) => ({
                      label: el,
                      value: el,
                    }))}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormCol>
            <FormCol>
              <Controller
                name={`degrees.${index}.program`}
                control={control}
                rules={{
                  required: t('forms.candidate.fields.program.error'),
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    error={fieldState.error?.message}
                    placeholder={t('forms.candidate.fields.program.placeholder')}
                  />
                )}
              />
            </FormCol>
            <FormCol $width={60}>
              <SquaredButton
                size="l"
                variant="outline"
                onClick={() => removeDegree(index)}
              >
                <Cross2Icon />
              </SquaredButton>
            </FormCol>
          </FormRow>
        ))}
        <FormRow>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendDegree({
                level: undefined as unknown as DegreeLevel,
                program: '',
              })
            }
          >
            {t('forms.candidate.fields.addDegree')} <PlusIcon width={20} height={20} />
          </Button>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.hardSkills')}</SectionTitle>
        {!!hardSkills.length && (
          <FormRow>
            <RowContainer>
              {hardSkills.map((hard) => (
                <SkillChip
                  key={hard}
                  value={hard}
                  onRemove={() => removeHardSkill(hard)}
                />
              ))}
            </RowContainer>
          </FormRow>
        )}
        <FormCol>
          <Input
            ref={hardSkillsInputRef}
            placeholder={t('forms.candidate.fields.addSkill')}
            rightIcon={
              <PlusIcon
                width="100%"
                height="100%"
                onClick={() => {
                  const value = hardSkillsInputRef.current?.value;

                  if (value) addHardSkill(value);
                }}
              />
            }
            onKeyDown={(e) => {
              const value = e.currentTarget.value;

              if (e.key === 'Enter' && value) {
                e.preventDefault();

                addHardSkill(value);
              }
            }}
          />
        </FormCol>
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.focusRoles')}</SectionTitle>
        {fields.map((field, index) => (
          <FormRow key={field.id}>
            <FormCol>
              <Controller
                name={`focusRoles.${index}.role`}
                control={control}
                rules={{
                  required: t('forms.candidate.fields.focusRole.error'),
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder={t('forms.candidate.fields.focusRole.placeholder')}
                    error={fieldState.error?.message}
                    rightIcon={
                      fields.length > 1 &&
                      index > 0 && (
                        <Cross2Icon
                          width="100%"
                          height="100%"
                          onClick={() => remove(index)}
                        />
                      )
                    }
                  />
                )}
              />
            </FormCol>
          </FormRow>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              role: '',
            })
          }
        >
          {t('forms.candidate.fields.addFocusRole')} <PlusIcon width={20} height={20} />
        </Button>
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.travelInformation')}</SectionTitle>
        {travelModeFields.map((field, index) => {
          const isTravelModeRemote =
            watch(`travelOptions.${index}.travelMode`) ===
            TravelModeEnum.REMOTE;

          if (isTravelModeRemote) {
            setValue(`travelOptions.${index}.minutesOfRoad`, undefined);
            setValue(`travelOptions.${index}.onSiteDays`, undefined);
          }

          return (
            <>
              {index > 0 && <Separator />}

              <TravelOptionWrapper key={field.id}>
                <TravelOptionDeleteButton
                  onClick={() => removeTravelMode(index)}
                  type="button"
                  variant="outline"
                  size="xs"
                >
                  <Cross2Icon />
                </TravelOptionDeleteButton>

                <FormRow>
                  <FormCol>
                    <Label htmlFor={`travelMode-${index}`}>{t('forms.candidate.fields.travelMode.label')}</Label>
                    <Controller
                      name={`travelOptions.${index}.travelMode`}
                      control={control}
                      render={({ field: { value, onChange }, fieldState }) => {
                        return (
                          <Select<TravelModeEnum>
                            selectedValues={value ? [value] : []}
                            onSelect={(selectedValue) => {
                              onChange(selectedValue[0]);
                            }}
                            options={Object.values(TravelModeEnum).map(
                              (el) => ({
                                label: `${el}`,
                                value: el,
                              }),
                            )}
                            error={fieldState.error?.message}
                          />
                        );
                      }}
                    />
                  </FormCol>
                </FormRow>

                {!isTravelModeRemote && (
                  <FormRow>
                    <FormCol>
                      <Label htmlFor={`minutesOfRoad-${index}`}>
                        {t('forms.candidate.fields.minutesOfRoad.label')}
                      </Label>
                      <Controller
                        name={`travelOptions.${index}.minutesOfRoad`}
                        control={control}
                        rules={{
                          required: {
                            value: !isTravelModeRemote,
                            message: t('forms.candidate.fields.minutesOfRoad.error'),
                          },
                          min: { value: 1, message: t('forms.candidate.fields.minutesOfRoad.minError') },
                        }}
                        render={({
                          field: { value, onChange },
                          fieldState,
                        }) => {
                          return (
                            <Input
                              type="number"
                              min={0}
                              placeholder={t('forms.candidate.fields.minutesOfRoad.placeholder')}
                              error={fieldState.error?.message}
                              value={value}
                              onChange={onChange}
                              disabled={isTravelModeRemote}
                            />
                          );
                        }}
                      />
                    </FormCol>
                    <FormCol>
                      <Label htmlFor={`onSiteDays-${index}`}>
                        {t('forms.candidate.fields.onSiteDays.label')}
                      </Label>
                      <Controller
                        name={`travelOptions.${index}.onSiteDays`}
                        control={control}
                        rules={{
                          required: {
                            value: !isTravelModeRemote,
                            message: t('forms.candidate.fields.onSiteDays.error'),
                          },
                          min: { value: 1, message: t('forms.candidate.fields.onSiteDays.minError') },
                          max: { value: 5, message: t('forms.candidate.fields.onSiteDays.maxError') },
                        }}
                        render={({
                          field: { value, onChange },
                          fieldState,
                        }) => {
                          return (
                            <Input
                              type="number"
                              min={0}
                              max={5}
                              placeholder={t('forms.candidate.fields.onSiteDays.placeholder')}
                              error={fieldState.error?.message}
                              value={value}
                              onChange={onChange}
                              disabled={isTravelModeRemote}
                            />
                          );
                        }}
                      />
                    </FormCol>
                  </FormRow>
                )}
              </TravelOptionWrapper>
            </>
          );
        })}
        <FormRow>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendTravelMode({
                travelMode: undefined as unknown as TravelModeEnum,
                minutesOfRoad: 0,
                onSiteDays: 0,
              })
            }
          >
            {t('forms.candidate.fields.addTravelOption')} <PlusIcon width={20} height={20} />
          </Button>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.salaryInformation')}</SectionTitle>
        <FormRow>
          <FormCol $gap={20} $width={170}>
            <Label htmlFor="salaryPeriod">{t('forms.candidate.fields.salaryPeriod.label')}</Label>
            <Controller
              name="salaryPeriod"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={value}
                  onSwitch={onChange}
                  options={salarySwitchOptions}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="grossSalary">{t('forms.candidate.fields.grossSalary.label')}</Label>
            <Controller
              name="grossSalary"
              control={control}
              rules={{
                required: t('forms.candidate.fields.grossSalary.error'),
                min: {
                  value: 1,
                  message: t('forms.candidate.fields.grossSalary.minError'),
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  placeholder={t('forms.candidate.fields.grossSalary.placeholder')}
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="hoursAWeek">{t('forms.candidate.fields.hoursPerWeek.label')}</Label>
            <Controller
              name="hoursAWeek"
              control={control}
              rules={{
                required: t('forms.candidate.fields.hoursPerWeek.error'),
                min: {
                  value: 1,
                  message: t('forms.candidate.fields.hoursPerWeek.minError'),
                },
              }}
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <Select<WeekHours>
                    selectedValues={value ? [value] : []}
                    onSelect={(selectedValue) => {
                      onChange(selectedValue[0]);
                    }}
                    options={WEEK_HOURS.map((el) => ({
                      label: `${el}`,
                      value: el,
                    }))}
                    error={fieldState.error?.message}
                  />
                );
              }}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>{t('forms.candidate.sections.extraContext')}</SectionTitle>
        <Controller
          name="ambitions"
          control={control}
          render={({ field }) => {
            return (
              <>
                <FormRow>
                  <FormCol>
                    <Textarea {...field} placeholder={t('forms.candidate.fields.ambitions.placeholder')} />
                  </FormCol>
                </FormRow>
              </>
            );
          }}
        />
      </Section>
    </form>
  );
});

CandidateForm.displayName = 'CandidateForm';
