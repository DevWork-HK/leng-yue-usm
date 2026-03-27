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

const AttendanceStat = async () => {
  const eventsStartTime = DateTime.local({ zone: IANA_HK_TIME_ZONE })
    .minus({ months: 3 })
    .startOf('month');

  const events = await getEvents({ startTime: eventsStartTime });

  const graphData = events.map((event) => ({
    date: event.date,
    attendanceRate: event.attendanceRate * 100,
  }));

  return (
    <div className="w-full">
      <p className="text-gray-500 mb-2">
        Statistic about event attendance in the past 3 months.
      </p>
      <div className="flex flex-nowrap gap-x-6 w-full mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardDescription>Total Events</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-center font-extrabold">
            {events.length}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardDescription>Average Attendance Rate</CardDescription>
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
