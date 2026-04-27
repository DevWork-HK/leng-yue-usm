'use client';

import { MemberType } from '@/schema/member';
import { Eye, PencilLine, SquarePlus, Trash2 } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { POSITION } from '@/constants';
import { cn, getClassName, getPositionName } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import ClassAvatar from '@/components/custom/ClassAvatar';
import MemberEdit from './MemberEdit';
import MemberDelete from './MemberDelete';
import MemberView from './MemberView';

type MemberProps = {
  member: MemberType;
};

const PositionLabel = ({ position }: { position: POSITION }) => {
  switch (position) {
    case POSITION.DA_DANG_JIA:
    case POSITION.ER_DANG_JIA:
    case POSITION.SAN_DANG_JIA:
    case POSITION.SI_DANG_JIA:
    case POSITION.WU_DANG_JIA:
      return (
        <Badge className="bg-amber-200 text-white rounded-sm text-[10px]">
          {getPositionName(position)}
        </Badge>
      );
    case POSITION.RONG_YU_BANG_ZHONG:
      return (
        <Badge className="bg-green-300 text-white rounded-sm text-[10px]">
          {getPositionName(position)}
        </Badge>
      );
    case POSITION.TANG_ZHU:
      return (
        <Badge className="bg-blue-200 text-white rounded-sm text-[10px]">
          {getPositionName(position)}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-zinc-300 text-white rounded-sm">
          {getPositionName(position)}
        </Badge>
      );
  }
};

const Member = ({ member }: MemberProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  return (
    <>
      <Item
        className={cn(
          'border border-zinc-300 rounded-xl bg-white',
          member.active === false && 'opacity-50',
        )}
      >
        <ItemMedia>
          <ClassAvatar memberClass={member.class} fallbackText={member.name} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{member.name}</ItemTitle>
          <ItemDescription>{getClassName(member.class)}</ItemDescription>
        </ItemContent>
        <ItemContent>
          <PositionLabel position={member.position} />
        </ItemContent>
        <ItemActions>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setViewDialogOpen(true)}
          >
            <Eye />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setEditDialogOpen(true)}
          >
            <PencilLine />
          </Button>
          {member.active ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="cursor-pointer bg-white"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="cursor-pointer text-green-600 hover:bg-green-100 hover:text-green-600"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <SquarePlus />
            </Button>
          )}
        </ItemActions>
      </Item>

      <MemberView
        member={member}
        dialogOpen={viewDialogOpen}
        setDialogOpen={setViewDialogOpen}
      />

      <MemberEdit
        member={member}
        dialogOpen={editDialogOpen}
        setDialogOpen={setEditDialogOpen}
      />

      <MemberDelete
        alertDialogOpen={deleteDialogOpen}
        setAlertDialogOpen={setDeleteDialogOpen}
        member={member}
      />
    </>
  );
};

export default Member;
