'use client';

import PageTemplateMutation from '../shared/PageTemplateMutation';

import type { ISection5Data } from './data';
import { defaultDataPage5 } from './data';

export interface SectionFormProps {
  data?: ISection5Data;
  onSubmit: (values: ISection5Data) => void;
}

const MutationPage5 = ({ data, onSubmit }: SectionFormProps) => {
  return <PageTemplateMutation data={data} fallbackData={defaultDataPage5} title="Edit Terms & Conditions Page" onSubmit={onSubmit} />;
};

export default MutationPage5;
