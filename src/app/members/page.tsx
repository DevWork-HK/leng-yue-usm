import Button from '@/component/Button';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import UserList from './component/UserList';

const UsersPage = () => {
  return (
    <div className='mt-5'>
      <div>
        <div className='text-3xl font-bold flex flex-nowrap justify-between'>
          Users
          <Button className='text-sm'>
            <PersonAddOutlinedIcon /> Add User
          </Button>
        </div>
      </div>
      <UserList className='mt-8' />
    </div>
  );
};

export default UsersPage;
