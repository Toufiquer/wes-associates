'use client';

import Link from 'next/link';

import { AssetProps, defaultDataAsset1, IAssetData, TemplateItem } from './data';
import RenderItem from './RenderItem';

const mobileGridLayoutClasses: Record<IAssetData['mobileGridLayout'], string> = {
  '1x1': 'grid-cols-1',
  '1x2': 'grid-cols-2',
};

const gridLayoutClasses: Record<IAssetData['gridLayout'], string> = {
  '1x1': 'md:grid-cols-1',
  '1x2': 'md:grid-cols-2',
  '1x3': 'md:grid-cols-3',
};

const sortTemplates = (templates: TemplateItem[], sortMode: IAssetData['sortMode']) => {
  if (sortMode === 'custom') return templates;
  return [...templates].sort((a, b) => {
    const result = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
    return sortMode === 'ascending' ? result : -result;
  });
};

const resolveData = (data?: IAssetData | string): IAssetData => {
  if (!data) return defaultDataAsset1;

  try {
    const parsedData = typeof data === 'string' ? (JSON.parse(data) as Partial<IAssetData>) : data;
    const settings = {
      ...defaultDataAsset1,
      ...parsedData,
      title: parsedData.title || parsedData.sectionTitle || defaultDataAsset1.title,
      sortMode: parsedData.sortMode || defaultDataAsset1.sortMode,
      gridLayout: parsedData.gridLayout || defaultDataAsset1.gridLayout,
      mobileGridLayout: parsedData.mobileGridLayout || defaultDataAsset1.mobileGridLayout,
      showSeeMore: parsedData.showSeeMore ?? defaultDataAsset1.showSeeMore,
      seeMore: {
        ...defaultDataAsset1.seeMore,
        ...(parsedData.seeMore || {}),
        name: parsedData.seeMore?.name || parsedData.viewMoreText || defaultDataAsset1.seeMore.name,
      },
      templates: parsedData.templates?.length ? parsedData.templates : defaultDataAsset1.templates,
    };

    return {
      ...settings,
      templates: sortTemplates(settings.templates, settings.sortMode),
    };
  } catch {
    return defaultDataAsset1;
  }
};

const QueryAsset1 = ({ data }: AssetProps) => {
  const settings = resolveData(data);
  const mobileGridClassName = mobileGridLayoutClasses[settings.mobileGridLayout] || mobileGridLayoutClasses[defaultDataAsset1.mobileGridLayout];
  const gridClassName = gridLayoutClasses[settings.gridLayout] || gridLayoutClasses[defaultDataAsset1.gridLayout];

  return (
    <section className="bg-white px-4 pb-8 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600 md:text-3xl">{settings.title}</h2>
          {settings.showSeeMore && (
            <Link
              href={settings.seeMore.url || '#'}
              className="text-sm font-semibold text-white hover:underline md:rounded-lg bg-blue-600 md:px-6 md:py-2 px-2 py-1 rounded-sm"
            >
              {settings.seeMore.name}
            </Link>
          )}
        </div>
        {/* Render Each card */}
        <div className="md:hidden block">
          <div className={`grid items-stretch gap-4 ${mobileGridClassName} ${gridClassName}`}>
            {settings.templates.map(template => (
              <RenderItem key={template.id} item={template} settings={settings} />
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="grid grid-cols-3 items-stretch gap-4 lg:grid-cols-4">
            {settings.templates.map(template => (
              <RenderItem key={template.id} item={template} settings={settings} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueryAsset1;
