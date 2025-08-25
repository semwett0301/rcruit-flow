import { IntroMailStepKey } from 'pages/IntroductionPage';

export enum GtmForm {
  INTRO_MAIL = 'intro_mail',
  PREPARATION_MAIL = 'preparation_mail',
}

export type Common = {
  formName: GtmForm;
};

interface IntroMailStep extends Common {
  formName: GtmForm.INTRO_MAIL;
  step: IntroMailStepKey;
}

interface PreparationMailStep extends Common {
  formName: GtmForm.PREPARATION_MAIL;
  step: '';
}

type StepCommon = IntroMailStep | PreparationMailStep;

const pushToDL = (
  event: string,
  params: Record<string, string | number> = {},
) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};

export const gtmTracking = {
  trackStepSubmitSuccess: ({ formName, step }: StepCommon) =>
    pushToDL('form_step_submit_success', {
      form_name: formName,
      status: 'success',
      form_step: step,
    }),

  trackRegenerate: ({ formName }: Common) =>
    pushToDL('form_regenerate', {
      form_name: formName,
    }),

  trackReset: ({ formName }: Common) =>
    pushToDL('form_reset', {
      form_name: formName,
    }),
};
