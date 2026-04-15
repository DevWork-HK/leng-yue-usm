import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

const SpinnerEmpty = () => {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>努力加載中</EmptyTitle>
        <EmptyDescription>請稍等，請勿重新加載頁面...</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default SpinnerEmpty;
