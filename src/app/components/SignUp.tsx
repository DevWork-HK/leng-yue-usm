'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { signUp } from '@/lib/supabase/actions';
import { toastBox } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { object, string, infer as _infer, email } from 'zod';

const signUpFormSchema = object({
  displayName: string().min(1, '顯示名稱必須至少有 1 個字元。'),
  email: email('請輸入有效的電子郵件地址。'),
  password: string().min(6, '密碼必須至少有 6 個字元。'),
  verifyPassword: string().min(6, '確認密碼必須至少有 6 個字元。'),
}).refine((data) => data.password === data.verifyPassword, {
  message: '密碼和確認密碼必須相符。',
  path: ['verifyPassword'],
});

type SignUpFormType = _infer<typeof signUpFormSchema>;

const SignUp = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      verifyPassword: '',
    },
  });

  const handleSignUp = async (data: SignUpFormType) => {
    try {
      setLoading(true);
      await signUp(data.displayName, data.email, data.password);
      setDialogOpen(false);
      toastBox.success(`${data.email} 註冊成功！請重新登入。`);
      reset();
    } catch (error) {
      console.error('Sign Up Error:', error);
      toastBox.error('註冊失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">註冊</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>註冊</DialogTitle>
          <DialogDescription>請填寫以下資訊以完成註冊。</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSignUp)} id="sign-up-form">
          <FieldGroup>
            <Controller
              name="displayName"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>顯示名稱</FieldLabel>
                  <Input {...field} type="text" />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>電子郵件</FieldLabel>
                  <Input {...field} type="email" />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>密碼</FieldLabel>
                  <Input {...field} type="password" />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="verifyPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>確認密碼</FieldLabel>
                  <Input {...field} type="password" />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              取消
            </Button>
          </DialogClose>
          <Button type="submit" form="sign-up-form" disabled={loading}>
            {loading ? <Spinner /> : '註冊'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default SignUp;
