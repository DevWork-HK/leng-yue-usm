'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Users, CalendarCheck2, PartyPopper } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Tabs from '@/app/components/Tabs';
import Tab from '@/app/components/Tab';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentUserMetadata, signOut } from '@/lib/supabase/actions';
import SignUp from './SignUp';
import SignIn from './SignIn';

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

const DEFAULT_AVATAR_USER_NAME = '未知';

const Header = () => {
  const pathName = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState(DEFAULT_AVATAR_USER_NAME);

  const updateUserState = async () => {
    const { user_metadata, session_id } =
      (await getCurrentUserMetadata()) || {};
    const displayName = user_metadata?.display_name || DEFAULT_AVATAR_USER_NAME;
    setDisplayName(displayName);
    setIsLoggedIn(!!session_id);
  };
  useEffect(() => {
    (async () => {
      await updateUserState();
    })();
  }, []);

  const logOutUser = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      setDisplayName(DEFAULT_AVATAR_USER_NAME);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar size="lg">
                <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={logOutUser} variant="destructive">
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-x-2">
            <SignUp />
            <SignIn onSignInSuccess={updateUserState} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
