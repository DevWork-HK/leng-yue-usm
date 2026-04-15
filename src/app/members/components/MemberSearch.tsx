'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const MemberSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const name = target.value;

      const queryParams = new URLSearchParams(searchParams.toString());
      if (name) {
        queryParams.set('name', name);
      } else {
        queryParams.delete('name');
      }

      router.push(`/members?${queryParams.toString()}`);
    }
  };

  return (
    <InputGroup className="bg-white">
      <InputGroupInput
        id="inline-start-input"
        placeholder="Search..."
        onKeyDownCapture={handleKeyDownSearch}
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>按Enter搜尋</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
};
export default MemberSearch;
