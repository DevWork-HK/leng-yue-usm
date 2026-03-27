'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatDate } from '@/lib/utils';

const chartConfig = {
  attendanceRate: {
    label: 'Attendance Rate',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type AttendanceTrendChartProps = {
  data: {
    date: string;
    attendanceRate: number;
  }[];
};

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Attendance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 16,
              right: 16,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              interval={0}
              tickFormatter={(value) => formatDate(value, 'LLL d')}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => formatDate(label)}
                  className="w-42.5"
                />
              }
            />
            <defs>
              <linearGradient
                id="fillAttendanceRate"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="attendanceRate"
              type="natural"
              fill="url(#fillAttendanceRate)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
