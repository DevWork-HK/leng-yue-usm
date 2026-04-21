'use client';

import Tabs from '@/app/components/Tabs';
import Tab from '@/app/components/Tab';
import { Users, CalendarCheck2, PartyPopper } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ReactElement } from 'react';
import Link from 'next/link';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

type HeaderProps = {
  isLoggedIn: boolean;
  displayName: string;
};

const Header = ({ isLoggedIn, displayName }: HeaderProps) => {
  const pathName = usePathname();

  return (
    <header className="w-full border-b">
      <div className="max-w-5xl m-auto flex py-3 px-2 items-center gap-x-6">
        <Link href="/">
          <Image
            src="/images/leng-yue-logo.png"
            alt="Logo"
            width={80}
            height={44}
          />
        </Link>
        <div className="ml-auto">
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
        {isLoggedIn ? (
          <Avatar size="lg">
            <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
        ) : (
          <>
            <SignUp />
            <SignIn />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
