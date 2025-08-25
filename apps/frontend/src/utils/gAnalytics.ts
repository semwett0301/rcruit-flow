import ReactGA from 'react-ga4';
import { UaEventOptions } from 'react-ga4/types/ga4';

export enum EventCategory {
  INTRO_MAIL = 'Introduction mail',
}

interface CustomUaOption extends UaEventOptions {
  category: EventCategory;
}

export const gAnalytics = {
  init: (gTag: string) => {
    ReactGA.initialize(gTag);
  },
  registerPageView: (page: string, title?: string) => {
    ReactGA.send({
      hitType: 'pageview',
      page,
      title,
    });
  },
  registerEvent: (options: CustomUaOption) => {
    ReactGA.event(options);
  },
};
