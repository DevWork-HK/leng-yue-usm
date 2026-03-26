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

  return (
    <div className="w-full">
      <div className="flex flex-nowrap gap-x-6 w-full mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardDescription>Total Events</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-center font-extrabold">
            8
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardDescription>Average Attendance Rate</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl text-center text-blue-600 font-extrabold">
            88%
          </CardContent>
        </Card>
      </div>

      <AttendanceTrendChart />
    </div>
  );
};

export default AttendanceStat;
