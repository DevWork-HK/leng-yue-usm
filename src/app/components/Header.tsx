'use client';

import Tabs from '@/app/components/Tabs';
import Tab from '@/app/components/Tab';
import { Users, CalendarCheck2, PartyPopper } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ReactElement } from 'react';

type TabContent = {
  name: string;
  link: string;
  icon: ReactElement;
};

const TabsContent: TabContent[] = [
  {
    name: '幫眾',
    link: '/members',
    icon: <Users size="24px" />,
  },
  {
    name: '出席',
    link: '/attendance',
    icon: <CalendarCheck2 size="24px" />,
  },
  {
    name: '抽獎',
    link: '/lucky-draw',
    icon: <PartyPopper size="24px" />,
  },
];

const Header = () => {
  const pathName = usePathname();

  return (
    <header className="w-full border-b">
      <div className="max-w-5xl m-auto flex justify-between py-3 px-2">
        <Image
          src="/images/leng-yue-logo.png"
          alt="Logo"
          width={80}
          height={44}
        />
        <div>
          <Tabs>
            {TabsContent.map((tab) => (
              <Tab
                isActive={pathName.includes(tab.link)}
                link={tab.link}
                key={tab.name}
              >
                {tab.icon}
                <span className="hidden sm:block">{tab.name}</span>
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    </header>
  );
};

export default Header;
