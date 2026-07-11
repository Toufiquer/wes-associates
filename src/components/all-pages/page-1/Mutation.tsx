'use client';

import PageTemplateMutation from '../shared/PageTemplateMutation';

import type { ISection1Data } from './data';
import { defaultDataPage1 } from './data';

export interface SectionFormProps {
  data?: ISection1Data;
  onSubmit: (values: ISection1Data) => void;
}

const MutationPage1 = ({ data, onSubmit }: SectionFormProps) => {
  return <PageTemplateMutation data={data} fallbackData={defaultDataPage1} title="Edit Home Page" onSubmit={onSubmit} />;
};

export default MutationPage1;
