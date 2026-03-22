import UserList from './components/UserList';
import AddUser from './components/AddUser';

const UsersPage = () => {
  return (
    <div className="mt-5">
      <div>
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="font-bold text-2xl">Users</h2>
          <AddUser />
        </div>
      </div>
      <UserList className="mt-8" />
    </div>
  );
};

export default UsersPage;
