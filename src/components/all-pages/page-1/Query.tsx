import PageTemplateQuery from '../shared/PageTemplateQuery';

import { defaultDataPage1, ISection1Data, Section1Props } from './data';

const QueryPage1 = ({ data }: Section1Props) => {
  return <PageTemplateQuery<ISection1Data> data={data} fallbackData={defaultDataPage1} accent="emerald" />;
};

export default QueryPage1;
