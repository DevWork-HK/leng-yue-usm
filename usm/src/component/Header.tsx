'use client';

import Tabs from '@/app/component/Tabs';
import Tab from '@/app/component/Tab';
import { usePathname } from 'next/navigation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { ReactElement } from 'react';

type TabContent = {
  name: string;
  link: string;
  icon: ReactElement;
};

const TabsContent: TabContent[] = [
  {
    name: 'Users',
    link: '/users',
    icon: <PeopleOutlineIcon />,
  },
  {
    name: 'Attendance',
    link: '/attendance',
    icon: <CalendarMonthIcon />,
  },
];

const Header = ({}) => {
  const pathName = usePathname();

  return (
    <header className='w-full shadow-sm'>
      <div className='max-w-5xl m-auto flex justify-between py-3 px-2'>
        <div className='flex flex-nowrap gap-x-4'>
          <div className='text-2xl font-medium'>User Management System</div>
          <div>
            <Tabs>
              {TabsContent.map((tab) => (
                <Tab isActive={pathName.includes(tab.link)} link={tab.link} key={tab.name}>
                  {tab.icon}
                  {tab.name}
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
        <div className='flex flex-nowrap items-center'>Logout</div>
      </div>
    </header>
  );
};

export default Header;
