'use client';

import { DetailedLuckyDrawType } from '@/schema/luckyDraw';
import DrawResultItem from './DrawResultItem';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteLuckyDraw } from '@/lib/supabase/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { delay, toastBox } from '@/lib/utils';

type LuckyDrawHistoryItemProps = {
  item: DetailedLuckyDrawType;
};

const LuckyDrawHistoryItem = ({ item }: LuckyDrawHistoryItemProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const removeLuckyDrawEvent = async () => {
    try {
      setDialogOpen(false);
      await deleteLuckyDraw([item.id]);

      toastBox.success('Lucky draw event deleted successfully');
      await delay(1000);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete lucky draw event:', error);
      toastBox.error('Failed to delete lucky draw event');
    }
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex flex-col gap-y-4">
        <h4 className="font-semibold text-lg flex items-center justify-between">
          {item.event}
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="cursor-pointer bg-white"
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
        </h4>
        {item.result.map((result) => {
          return result.winners.map((winner) => (
            <DrawResultItem key={winner.id} member={winner} result={result} />
          ));
        })}
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>刪除 {item.event}?</AlertDialogTitle>
        </AlertDialogHeader>

        <div>確定要刪除這個抽獎活動嗎？此操作無法撤銷。</div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              取消
            </Button>
          </AlertDialogCancel>
          <Button variant="destructive" onClick={removeLuckyDrawEvent}>
            刪除
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default LuckyDrawHistoryItem;
