import MemberList from './components/MemberList';
import AddMember from './components/AddMember';
import MemberSearch from './components/MemberSearch';

type MembersPageProps = {
  searchParams?: Promise<{
    name?: string;
  }>;
};

const MembersPage = async ({ searchParams }: MembersPageProps) => {
  const { name } = (await searchParams) || {};

  return (
    <div className="mt-5 flex flex-col gap-y-5">
      <div>
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="font-bold text-2xl">幫眾</h2>
          <AddMember />
        </div>
      </div>
      <MemberSearch />
      <MemberList searchParams={{ name }} />
    </div>
  );
};

export default MembersPage;
