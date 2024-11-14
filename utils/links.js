import { SearchCode, Users, LayoutDashboard, FolderPlus, Monitor } from 'lucide-react';

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
    label: 'témakör létrehozás',
    icon: <FolderPlus />,
  },
  // {
  //   href: '/dashboard/admin/users',
  //   label: 'felhasználók',
  //   icon: <Users />,
  // },
  {
    href: '/dashboard/admin/demo',
    label: 'demó',
    icon: <Monitor />,
  }
];

export default links;