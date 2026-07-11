export interface PageSectionBlock {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
}

export interface PageTemplateData {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: string;
  secondaryAction: string;
  sections: PageSectionBlock[];
}

export interface PageTemplateProps<TData extends PageTemplateData> {
  data?: TData | string;
}
