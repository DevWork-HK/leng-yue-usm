import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { DateTime } from 'luxon';
import { IANA_HK_TIME_ZONE } from '@/constants/constants';
import { getEvents } from '@/lib/supabase/actions';
import { formatDate } from '@/lib/utils';

const AttendanceStat = async () => {
  const eventsStartTime = DateTime.local({ zone: IANA_HK_TIME_ZONE })
    .minus({ months: 3 })
    .startOf('month');

  const events = await getEvents({ startTime: eventsStartTime });

  const graphData = events
    .map((event, index) => {
      const existValue = events.findIndex(
        (data, dataIndex) => data.date === event.date && dataIndex !== index,
      );

      let dataName = '';
      if (existValue !== -1) {
        dataName =
          existValue > index
            ? formatDate(event.date, 'LLL d')
            : formatDate(event.date, 'LLL d') + ` (${index - existValue})`;
      } else {
        dataName = formatDate(event.date, 'LLL d');
      }

      return {
        date: event.date,
        name: dataName,
        attendanceRate: Number((event.attendanceRate * 100).toFixed(2)),
      };
    })
    .sort((a, b) =>
      DateTime.fromISO(a.date)
        .diff(DateTime.fromISO(b.date))
        .get('milliseconds'),
    );

  return (
    <div className="w-full">
      <p className="text-gray-500 mb-2">過去三個月的活動統計</p>
      <div className="flex flex-nowrap gap-x-6 w-full mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardDescription>總活動數</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-center font-extrabold">
            {events.length}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardDescription>平均參與率</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-center text-blue-400 font-extrabold">
            {events.length > 0
              ? `${Math.round((events.reduce((acc, event) => acc + event.attendanceRate, 0) * 100) / events.length)}%`
              : 'N/A'}
          </CardContent>
        </Card>
      </div>
      <AttendanceTrendChart data={graphData} />
    </div>
  );
};

export default AttendanceStat;
