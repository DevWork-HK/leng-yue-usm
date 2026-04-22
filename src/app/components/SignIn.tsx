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
import { signIn } from '@/lib/supabase/actions';
import { toastBox } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { object, string, infer as _infer, email } from 'zod';

const signInFormSchema = object({
  email: email('請輸入有效的電子郵件地址。'),
  password: string().min(1, '請輸入密碼。'),
});

type SignInFormType = _infer<typeof signInFormSchema>;

type SignInProps = {
  onSignInSuccess?: () => void;
};

const SignIn = ({ onSignInSuccess }: SignInProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (data: SignInFormType) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
      setDialogOpen(false);
      toastBox.success(`${data.email} 登入成功！`);
      if (onSignInSuccess) {
        onSignInSuccess();
      }
      reset();
    } catch (error) {
      console.error('Sign In Error:', error);
      toastBox.error('登入失敗，請稍後再試。');
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
        <Button variant="default">登入</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>登入</DialogTitle>
          <DialogDescription>請填寫以下資訊以完成登入。</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSignIn)} id="sign-in-form">
          <FieldGroup>
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
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              取消
            </Button>
          </DialogClose>
          <Button type="submit" form="sign-in-form" disabled={loading}>
            {loading ? <Spinner /> : '登入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default SignIn;
