import { SearchCode, Users, LayoutDashboard, FolderPlus, Monitor, StickyNote } from 'lucide-react';

const links = [
  // {
  //   href: '/dashboard',
  //   label: 'témakörök',
  //   icon: <LayoutDashboard />,
  // },
  // {
  //   href: '/dashboard/profile',
  //   label: 'profil',
  //   icon: <SearchCode />,
  // },
  {
    href: '/dashboard/admin',
    label: 'témakörök',
    icon: <FolderPlus />,
  },
  // {
  //   href: '/dashboard/admin/users',
  //   label: 'felhasználók',
  //   icon: <Users />,
  // },
  {
    href: '/dashboard/admin/editor',
    label: 'Jegyzetek',
    icon: <StickyNote />,
  },
  {
    href: '/dashboard/admin/demo',
    label: 'demó',
    icon: <Monitor />,
  }
];

export default links;