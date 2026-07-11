export type CategoryIconKey = 'shopping-basket' | 'wheat' | 'sparkles' | 'laptop' | 'plug' | 'heart';

export interface CategorySliderItem {
  id: number;
  name: string;
  icon: CategoryIconKey;
}

export interface ISection47Data {
  pageUid: string;
  pageName: string;
  categories: CategorySliderItem[];
  cardBackgroundColor: string;
  iconBackgroundColor: string;
  iconHoverBackgroundColor: string;
}

export interface Section47Props {
  data?: ISection47Data;
}

export const defaultDataSection47: ISection47Data = {
  pageUid: 'section-uid-47',
  pageName: 'Section 47',
  cardBackgroundColor: '#ffffff',
  iconBackgroundColor: '#3b82f6',
  iconHoverBackgroundColor: '#2563eb',
  categories: [
    { id: 1, name: 'Grocery', icon: 'shopping-basket' },
    { id: 2, name: 'Agriculture', icon: 'wheat' },
    { id: 3, name: 'Beauty', icon: 'sparkles' },
    { id: 4, name: 'Digital Product', icon: 'laptop' },
    { id: 5, name: 'Electronics', icon: 'plug' },
    { id: 6, name: 'Health', icon: 'heart' },
    { id: 7, name: 'Fashion', icon: 'shopping-basket' },
    { id: 8, name: 'Home', icon: 'wheat' },
  ],
};

