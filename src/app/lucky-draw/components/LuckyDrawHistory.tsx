import { getLuckyDraws, getMembers } from '@/lib/supabase/actions';
import SectionBlock from './SectionBlock';
import { Empty, EmptyTitle } from '@/components/ui/empty';
import { ClassValue } from 'clsx';
import { Separator } from '@/components/ui/separator';
import { DetailedLuckyDrawType } from '@/schema/luckyDraw';
import LuckyDrawHistoryItem from './LuckyDrawHistoryItem';
import React from 'react';

const EmptyLuckyDrawHistory = () => (
  <Empty>
    <EmptyTitle>暫無抽獎歷史</EmptyTitle>
  </Empty>
);

const LuckyDrawHistory = async ({ className }: { className?: ClassValue }) => {
  const [luckyDrawEvents, members] = await Promise.all([
    getLuckyDraws(),
    getMembers(),
  ]);

  const detailedLuckyDraws: DetailedLuckyDrawType[] = luckyDrawEvents.map(
    (event) => {
      const mappedResult = event.result.map((prize) => {
        const mappedWinners = prize.winners
          .map((winnerId) => {
            const member = members.find((member) => member.id === winnerId);
            if (!member) {
              return null;
            }

            return member;
          })
          .filter(
            (member): member is NonNullable<typeof member> => member !== null,
          );

        return {
          ...prize,
          winners: mappedWinners,
        };
      });

      return {
        ...event,
        result: mappedResult,
      };
    },
  );

  return (
    <SectionBlock className={className}>
      <h3 className="flex items-center gap-x-4 font-semibold text-xl justify-between">
        抽獎歷史
      </h3>
      {luckyDrawEvents.length < 1 ? (
        <EmptyLuckyDrawHistory />
      ) : (
        <>
          {detailedLuckyDraws.map((event, index) => (
            <React.Fragment key={event.id}>
              {index !== 0 && <Separator className="my-6" />}
              <LuckyDrawHistoryItem item={event} />
            </React.Fragment>
          ))}
        </>
      )}
    </SectionBlock>
  );
};
export default LuckyDrawHistory;
