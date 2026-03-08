import { PropsWithChildren } from 'react';

const Tabs = ({ children }: PropsWithChildren) => {
  return <div className='flex gap-x-2 flex-nowrap'>{children}</div>;
};

export default Tabs;
