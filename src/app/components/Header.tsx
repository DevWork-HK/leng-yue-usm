'use client';

import Tabs from '@/app/components/Tabs';
import Tab from '@/app/components/Tab';
import { Users, CalendarCheck2, PartyPopper } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ReactElement } from 'react';

type TabContent = {
  name: string;
  link: string;
  icon: ReactElement;
};

const TabsContent: TabContent[] = [
  {
    name: 'Members',
    link: '/members',
    icon: <Users size="20px" />,
  },
  {
    name: 'Attendance',
    link: '/attendance',
    icon: <CalendarCheck2 size="20px" />,
  },
  {
    name: 'Lucky Draw',
    link: '/lucky-draw',
    icon: <PartyPopper size="20px" />,
  },
];

const Header = ({}) => {
  const pathName = usePathname();

  return (
    <header className="w-full border-b">
      <div className="max-w-5xl m-auto flex justify-between py-3 px-2">
        <div className="flex flex-nowrap gap-x-4">
          <div className="text-2xl font-medium">Member Management System</div>
          <div>
            <Tabs>
              {TabsContent.map((tab) => (
                <Tab
                  isActive={pathName.includes(tab.link)}
                  link={tab.link}
                  key={tab.name}
                >
                  {tab.icon}
                  {tab.name}
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
        <div className="flex flex-nowrap items-center">Logout</div>
      </div>
    </header>
  );
};

export default Header;
