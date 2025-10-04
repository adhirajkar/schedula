'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { usernameSchema } from '@/lib/validators';
import useFetch from '@/hooks/useFetch';
import { updateUsername } from '@/actions/users';
import { BarLoader } from 'react-spinners';

const DashboardPage = () => {
    const { user, isLoaded } = useUser();
    const [origin, setOrigin] = useState('');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(usernameSchema),
    })
    const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

    const onSubmit = async (data) => {
        console.log(data)
        fnUpdateUsername(data.username)
    }

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    useEffect(() => {
        setValue('username', user?.username)
    }, [isLoaded, user?.username, setValue])

    return (
        <div className='space-y-8'>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.firstName}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Your unique link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <span>{origin}/</span>
                                <Input placeholder="username" {...register('username')} />
                            </div>
                            {
                                errors.username && <p className='text-xs text-red-500'>{errors.username.message}</p>
                            }
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
                            )}
                        </div>
                        {loading && (
                            <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                        )}
                        <Button type='submit'>Update Username</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardPage