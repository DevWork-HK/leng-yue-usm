
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import UserList from './components/UserList';

const UsersPage = () => {
  return (
    <div className='mt-5'>
      <div>
        <div className='text-3xl font-bold flex flex-nowrap justify-between'>
          Users
          <Button className='text-sm'>
            <UserPlus /> Add User
          </Button>
        </div>
      </div>
      <UserList className='mt-8' />
    </div>  
  );
};

export default UsersPage;
