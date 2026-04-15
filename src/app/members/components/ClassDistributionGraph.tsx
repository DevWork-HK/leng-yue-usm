'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export const description = 'A radar chart with dots';

type ClassDistributionGraphProps = {
  distributionData: {
    class: string;
    count: number;
  }[];
};

const chartConfig = {
  count: {
    label: '人數',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const ClassDistributionGraph = ({
  distributionData,
}: ClassDistributionGraphProps) => {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>職業分佈</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-70"
        >
          <RadarChart data={distributionData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="class" />
            <PolarGrid />
            <Radar
              dataKey="count"
              fill="var(--chart-1)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
export default ClassDistributionGraph;
