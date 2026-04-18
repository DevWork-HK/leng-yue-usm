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
import { TrendingUp } from 'lucide-react';

const chartConfig = {
  attendanceRate: {
    label: '參與率',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type AttendanceTrendChartProps = {
  data: {
    date: string;
    name: string;
    attendanceRate: number;
  }[];
};

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <TrendingUp className="inline stroke-blue-400 mr-2" /> 活動參與趨勢
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-87.5 w-full">
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
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              interval="preserveStartEnd"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value) => (
                    <>
                      <div className="h-2.5 w-2.5 shrink-0 rounded-xs border-chart-1 bg-chart-1" />
                      <div>參與率</div>
                      <div className="font-semibold">{value}%</div>
                    </>
                  )}
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
