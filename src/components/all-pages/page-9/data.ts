export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface TeamRow {
  id: string;
  label: string;
  members: TeamMember[];
}

export interface IPage9Data {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  title: string;
  description: string;
  founderLabel: string;
  ceo: TeamMember;
  rows: TeamRow[];
}

export interface Page9Props {
  data?: IPage9Data | string;
}

export const defaultDataPage9: IPage9Data = {
  pageUid: 'page-uid-8',
  pageName: 'Team',
  eyebrow: 'TecBuzz',
  title: 'The people behind the buzz',
  description: 'Seven people, three disciplines, one goal: turning Bangladeshi businesses into brands worth talking about.',
  founderLabel: 'Founder',
  ceo: {
    id: 'ceo',
    name: 'Tanvir Ahmed',
    title: 'Founder & CEO',
    bio: "Steers TecBuzz's vision, from first client call to shipped product. Ten years turning Dhaka SMEs into brands people remember.",
    image: 'https://i.pravatar.cc/600?img=13',
  },
  rows: [
    {
      id: 'leadership',
      label: 'Leadership',
      members: [
        {
          id: 'creative-director',
          name: 'Nusrat Jahan',
          title: 'Creative Director',
          bio: 'Shapes every visual story TecBuzz tells, from brand identity to campaign art direction.',
          image: 'https://i.pravatar.cc/500?img=47',
        },
        {
          id: 'lead-developer',
          name: 'Rakibul Hasan',
          title: 'Lead Developer',
          bio: 'Builds the fast, reliable web platforms our clients run their business on.',
          image: 'https://i.pravatar.cc/500?img=68',
        },
      ],
    },
    {
      id: 'growth',
      label: 'Growth',
      members: [
        {
          id: 'marketing-lead',
          name: 'Farhana Islam',
          title: 'Marketing Lead',
          bio: 'Turns ad budgets into measurable growth across Meta, Google, and TikTok.',
          image: 'https://i.pravatar.cc/500?img=32',
        },
        {
          id: 'content-strategist',
          name: 'Shahriar Kabir',
          title: 'Content Strategist',
          bio: 'Writes and plans the content calendars that keep client audiences engaged weekly.',
          image: 'https://i.pravatar.cc/500?img=51',
        },
      ],
    },
    {
      id: 'product',
      label: 'Product',
      members: [
        {
          id: 'ui-ux-designer',
          name: 'Mim Akter',
          title: 'UI/UX Designer',
          bio: 'Designs interfaces that feel effortless, tested with real users before every launch.',
          image: 'https://i.pravatar.cc/500?img=25',
        },
        {
          id: 'client-success',
          name: 'Imran Chowdhury',
          title: 'Client Success Manager',
          bio: 'The steady voice clients call first, from onboarding through every project milestone.',
          image: 'https://i.pravatar.cc/500?img=60',
        },
      ],
    },
  ],
};
