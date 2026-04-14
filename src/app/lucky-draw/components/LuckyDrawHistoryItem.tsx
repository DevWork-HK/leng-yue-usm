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
      <div>
        <h4 className="font-semibold text-lg mb-4 flex items-center justify-between">
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
          <AlertDialogTitle>Deleting {item.event}?</AlertDialogTitle>
        </AlertDialogHeader>

        <div>
          Are you sure to delete this lucky draw event? This action cannot be
          undone.
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button variant="destructive" onClick={removeLuckyDrawEvent}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default LuckyDrawHistoryItem;
