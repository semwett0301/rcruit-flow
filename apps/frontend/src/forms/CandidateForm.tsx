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
import { Input } from 'ui/Input';
import { Checkbox } from 'ui/Checkbox';
import { Select } from 'ui/Select';
import {
  Degree,
  DegreeLevel,
  SalaryPeriod,
  TravelModeEnum,
  WEEK_HOURS,
  WeekHours,
} from '@repo/dto';
import { Textarea } from 'ui/Textarea';
import { Switch } from 'ui/Switch';
import { SwitchOption } from 'types/ui/SwitchOption';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { RowContainer } from 'containers/RowContainer';
import { SkillChip } from 'ui/SkillChip';
import {
  FormCol,
  FormRow,
  Label,
  Section,
  SectionTitle,
} from 'ui/FormElements';
import { Button } from 'ui/Button';
import { SquaredButton } from 'ui/SquareButton';
import { Separator } from 'ui/Separator';
import styled from 'styled-components';

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
        <SectionTitle>Personal Information</SectionTitle>
        <FormRow>
          <FormCol>
            <Label htmlFor="candidateName">Full Name*</Label>
            <Controller
              name="candidateName"
              control={control}
              rules={{
                required: 'Full name is required',
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Full name"
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="age">Age*</Label>
            <Controller
              name="age"
              control={control}
              rules={{
                required: 'Age is required',
                min: {
                  value: 1,
                  message: "Age can't be less than 1",
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  placeholder="Age"
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
        </FormRow>
        <Label htmlFor="location">Location*</Label>
        <Controller
          name="location"
          control={control}
          rules={{
            required: 'Location is required',
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder="ex. London, United Kingdom"
              error={fieldState.error?.message}
            />
          )}
        />
      </Section>
      <Section>
        <SectionTitle>Employment Information</SectionTitle>
        <FormRow>
          <FormCol>
            <Controller
              name="unemployed"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  checked={value}
                  onCheck={onChange}
                  label="Unemployed"
                />
              )}
            />
          </FormCol>
        </FormRow>
        <FormRow>
          <FormCol>
            <Label htmlFor="currentEmployer">Current employer*</Label>
            <Controller
              name="currentEmployer"
              control={control}
              rules={{
                required: {
                  value: !unemployed,
                  message: 'Current employer is required',
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Current employer"
                  error={fieldState.error?.message}
                  disabled={unemployed}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="currentPosition">Current position*</Label>
            <Controller
              name="currentPosition"
              control={control}
              rules={{
                required: {
                  value: !unemployed,
                  message: 'Current position is required',
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Current position"
                  error={fieldState.error?.message}
                  disabled={unemployed}
                />
              )}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>Work Experience</SectionTitle>
        <FormRow>
          <FormCol>
            <Label htmlFor="experienceDescription">
              Experience description*
            </Label>
            <Controller
              name="experienceDescription"
              control={control}
              rules={{
                required: 'Experience description is required',
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Experience description"
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
          <FormCol $width={130}>
            <Label htmlFor="yearsOfExperience">Years of experience*</Label>
            <Controller
              name="yearsOfExperience"
              control={control}
              rules={{
                required: 'Number of years is required',
                min: {
                  value: 0,
                  message: "Year of experience can't be negative",
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="Years"
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>Education Information*</SectionTitle>
        {degreeFields.map((field, index) => (
          <FormRow key={field.id}>
            <FormCol $width={200}>
              <Controller
                name={`degrees.${index}.level`}
                control={control}
                rules={{
                  required: 'Select dwegree level',
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
                  required: 'Name of the program is required',
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    error={fieldState.error?.message}
                    placeholder="Name of the program"
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
            Add degree <PlusIcon width={20} height={20} />
          </Button>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>Hard skills</SectionTitle>
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
            placeholder="Add skill"
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
        <SectionTitle>Wants to focus on*</SectionTitle>
        {fields.map((field, index) => (
          <FormRow key={field.id}>
            <FormCol>
              <Controller
                name={`focusRoles.${index}.role`}
                control={control}
                rules={{
                  required: 'Focus role is required',
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="Enter focus role"
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
          Add focus role <PlusIcon width={20} height={20} />
        </Button>
      </Section>
      <Section>
        <SectionTitle>Travel information</SectionTitle>
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
                    <Label htmlFor={`travelMode-${index}`}>Travel mode</Label>
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
                        Minutes of road
                      </Label>
                      <Controller
                        name={`travelOptions.${index}.minutesOfRoad`}
                        control={control}
                        rules={{
                          required: {
                            value: !isTravelModeRemote,
                            message: 'Minutes of road are required',
                          },
                          min: { value: 1, message: 'Minimum is 1' },
                        }}
                        render={({
                          field: { value, onChange },
                          fieldState,
                        }) => {
                          return (
                            <Input
                              type="number"
                              min={0}
                              placeholder="Enter minutes of road"
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
                        On-site days
                      </Label>
                      <Controller
                        name={`travelOptions.${index}.onSiteDays`}
                        control={control}
                        rules={{
                          required: {
                            value: !isTravelModeRemote,
                            message: 'On-site days are required',
                          },
                          min: { value: 1, message: 'Minimum is 1' },
                          max: { value: 5, message: 'Maximum is 5' },
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
                              placeholder="Enter on-site days"
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
            Add travel option <PlusIcon width={20} height={20} />
          </Button>
        </FormRow>
      </Section>
      <Section>
        <SectionTitle>Salary Information</SectionTitle>
        <FormRow>
          <FormCol $gap={20} $width={170}>
            <Label htmlFor="salaryPeriod">Salary period*</Label>
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
            <Label htmlFor="grossSalary">Gross salary*</Label>
            <Controller
              name="grossSalary"
              control={control}
              rules={{
                required: 'Gross salary is required',
                min: {
                  value: 1,
                  message: "Gross salary can't be negative or 0",
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  placeholder="Gross salary"
                  error={fieldState.error?.message}
                />
              )}
            />
          </FormCol>
          <FormCol>
            <Label htmlFor="hoursAWeek">Hours per week*</Label>
            <Controller
              name="hoursAWeek"
              control={control}
              rules={{
                required: 'Hours per week is required',
                min: {
                  value: 1,
                  message: "Hours per week can't be negative or 0",
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
        <SectionTitle>Extra context</SectionTitle>
        <Controller
          name="ambitions"
          control={control}
          render={({ field }) => {
            return (
              <>
                <FormRow>
                  <FormCol>
                    <Textarea {...field} placeholder="Any extra context..." />
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
