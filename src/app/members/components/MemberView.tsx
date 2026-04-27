import { MemberType } from '@/schema/member';

type MemberViewProps = {
  member: MemberType;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

const MemberView = ({ member, dialogOpen, setDialogOpen }: MemberViewProps) => {
  return null;
};
export default MemberView;
