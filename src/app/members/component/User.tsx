'use client';

import Button from '@/component/Button';
import { UserType } from '@/schema/User';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const User = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>({
    defaultValues: {
      name: 'testing',
    },
  });

  const onFormSubmit = async (data: UserType) => {
    console.log(data);
  };

  return (
    <div className='flex flex-nowrap items-center gap-x-4 border border-zinc-300 p-4 rounded-xl'>
      <div className='rounded-full aspect-square h-full bg-zinc-300 flex justify-center items-center'>Avatar</div>
      <div className='flex-1 flex gap-y-1 flex-col'>
        <div className='text-xl'>Name</div>
        {/* <div className='text-sm text-zinc-500'>User Email</div> */}
      </div>
      <div>
        <button
          className='cursor-pointer aspect-square h-7 w-7 transition-colors rounded-sm hover:bg-zinc-200 flex justify-center items-center p-1'
          onClick={() => setDialogOpen(true)}
        >
          <EditOutlinedIcon className='w-full!' />
        </button>
      </div>

      <Dialog
        sx={{
          '.MuiPaper-root': {
            borderRadius: '10px',
          },
        }}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <form className='p-5 flex flex-col gap-y-4' onSubmit={handleSubmit(onFormSubmit)}>
          <label className='flex flex-col gap-y-1.5 text-xs'>
            Name *{' '}
            <input
              {...register('name')}
              type='text'
              required
              className='bg-zinc-200 rounded-lg p-1.5 focus-visible:outline-zinc-400 w-80 text-base'
            />
            {errors.name && <span>{errors.name.message}</span>}
          </label>
          <div className='flex flex-nowrap gap-2 justify-end'>
            <Button type='button' variant='secondary' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type='submit'>Update</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default User;
