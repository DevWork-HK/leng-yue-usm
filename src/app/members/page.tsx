import MemberList from './components/MemberList';
import AddMember from './components/AddMember';
import MemberSearch from './components/MemberSearch';
import ClassDistributionGraph from './components/ClassDistributionGraph';
import { getMembers } from '@/lib/supabase/actions';
import { CLASS } from '@/constants';
import { getClassName } from '@/lib/utils';

type MembersPageProps = {
  searchParams?: Promise<{
    name?: string;
  }>;
};

const MembersPage = async ({ searchParams }: MembersPageProps) => {
  const { name } = (await searchParams) || {};

  const members = await getMembers();

  const classDistributionMap = new Map<CLASS, number>([
    [CLASS.TIE_YI, 0],
    [CLASS.SU_WEN, 0],
    [CLASS.JIU_LING, 0],
    [CLASS.LONG_YIN, 0],
    [CLASS.SHEN_XIANG, 0],
    [CLASS.SUI_MENG, 0],
    [CLASS.XUAN_JI, 0],
    [CLASS.XUE_HE, 0],
  ]);

  members.forEach((member) => {
    if (member.active) {
      classDistributionMap.set(
        member.class,
        (classDistributionMap.get(member.class) || 0) + 1,
      );
    }
  });

  const distributionData = Array.from(classDistributionMap.entries()).map(
    ([classEnum, count]) => ({ class: getClassName(classEnum), count }),
  );

  return (
    <div className="mt-5 flex flex-col gap-y-8">
      <div>
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="font-bold text-2xl">幫眾</h2>
          <AddMember />
        </div>
      </div>
      <ClassDistributionGraph distributionData={distributionData} />
      <MemberSearch />
      <MemberList searchParams={{ name }} members={members} />
    </div>
  );
};

export default MembersPage;
