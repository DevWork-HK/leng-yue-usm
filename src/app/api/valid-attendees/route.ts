import { CLAN_NAME } from '@/constants';
import { parse } from 'csv-parse';

export const POST = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  const csvText = await (file as File).text();
  console.log('Parsed file content:', csvText);

  const dataRows = parse(csvText, {
    skip_empty_lines: false,
    trim: true,
    relax_column_count: true,
  });

  const clans: {
    clanName: string;
    totalMembers: number;
    validMembers: string[];
  }[] = [];
  let counter = 0;

  for await (const row of dataRows) {
    if (row.length === 0 || row.every((cell: string) => cell.trim() === '')) {
      if (clans[counter] !== undefined) {
        counter++;
      }

      continue;
    }

    if (row.length === 2) {
      const [clanName, totalMembers] = row.map((cell: string) => cell.trim());

      if (!clans[counter]) {
        clans[counter] = {
          clanName,
          totalMembers: parseInt(totalMembers, 10) || 0,
          validMembers: [],
        };
      }
    } else {
      const isValid = row
        .slice(2)
        .some((cell: string) => parseInt(cell.trim(), 10) || 0 > 0);
      if (isValid && clans[counter]) {
        clans[counter].validMembers.push(row[0].trim());
      }
    }
  }

  return new Response(
    JSON.stringify(clans.find((clan) => clan.clanName === CLAN_NAME)),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
