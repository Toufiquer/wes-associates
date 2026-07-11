'use client';

import PageTemplateMutation from '../shared/PageTemplateMutation';

import type { ISection4Data } from './data';
import { defaultDataPage4 } from './data';

export interface SectionFormProps {
  data?: ISection4Data;
  onSubmit: (values: ISection4Data) => void;
}

const MutationPage4 = ({ data, onSubmit }: SectionFormProps) => {
  return <PageTemplateMutation data={data} fallbackData={defaultDataPage4} title="Edit Privacy & Policy Page" onSubmit={onSubmit} />;
};

export default MutationPage4;
