'use client';

import PageTemplateMutation from '../shared/PageTemplateMutation';

import type { ISection2Data } from './data';
import { defaultDataPage2 } from './data';

export interface SectionFormProps {
  data?: ISection2Data;
  onSubmit: (values: ISection2Data) => void;
}

const MutationPage2 = ({ data, onSubmit }: SectionFormProps) => {
  return <PageTemplateMutation data={data} fallbackData={defaultDataPage2} title="Edit About Page" onSubmit={onSubmit} />;
};

export default MutationPage2;
