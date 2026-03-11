'use client';

import { UserType } from '@/schema/user';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PencilLine } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const User = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserType>({
        defaultValues: {
            name: 'testing'
        }
    });

    const onFormSubmit = async (data: UserType) => {
        console.log(data);
    };

    return (
        <div className='flex flex-nowrap items-center gap-x-4 border border-zinc-300 rounded-xl'>
            <Dialog>
                <Item>
                    <Avatar size='lg'>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <ItemContent>
                        <ItemTitle>Name</ItemTitle>
                        <ItemDescription>User Email</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <DialogTrigger asChild>
                            <Button size='icon' variant='ghost' className='cursor-pointer'>
                                <PencilLine />
                            </Button>
                        </DialogTrigger>
                    </ItemActions>
                </Item>

                <DialogContent showCloseButton={false}>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type='button' variant='outline'>Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default User;
