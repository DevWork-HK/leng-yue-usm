import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteMember, updateMember } from '@/lib/supabase/actions';
import { toastBox } from '@/lib/utils';
import { MemberType } from '@/schema/member';
import { useRouter } from 'next/navigation';

type MemberDeleteProps = {
  alertDialogOpen: boolean;
  setAlertDialogOpen: (open: boolean) => void;
  member: MemberType;
};

const MemberDelete = ({
  alertDialogOpen,
  setAlertDialogOpen,
  member,
}: MemberDeleteProps) => {
  const router = useRouter();

  const onDeleteConfirm = async () => {
    try {
      await deleteMember([member.id]);
      toastBox.success('Member deleted successfully.');
      router.refresh();
    } catch (error) {
      console.error('Unexpected error while deleting member:', error);
      toastBox.error('Member delete failed.');
    }
  };

  const onAddMemberConfirm = async () => {
    try {
      await updateMember({ active: true }, member.id);
      toastBox.success('Member added successfully.');
      router.refresh();
    } catch (error) {
      console.error('Unexpected error while adding member:', error);
      toastBox.error('Member added failed.');
    }
  };

  return (
    <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>您確定要執行此操作嗎？</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={
              member.active === true ? onDeleteConfirm : onAddMemberConfirm
            }
          >
            確定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default MemberDelete;
