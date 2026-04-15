import MemberList from './components/MemberList';
import AddMember from './components/AddMember';

const MembersPage = () => {
  return (
    <div className="mt-5">
      <div>
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="font-bold text-2xl">幫眾</h2>
          <AddMember />
        </div>
      </div>
      <MemberList className="mt-8" />
    </div>
  );
};

export default MembersPage;
