import UserList from './components/UserList';
import AddUser from './components/AddUser';

const UsersPage = () => {
  return (
    <div className="mt-5">
      <div>
        <div className="text-3xl font-bold flex flex-nowrap justify-between items-center">
          Users
          <AddUser />
        </div>
      </div>
      <UserList className="mt-8" />
    </div>
  );
};

export default UsersPage;
