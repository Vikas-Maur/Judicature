'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@components/auth/Button';
import InputField from '@components/auth/InputField';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { LOGIN, SIGNUP } from '@graphql/index';

const Auth = () => {
    const { register, handleSubmit } = useForm();

    const [isSignup, setIsSignup] = useState(false);

    const inputFields = [
        {
            title: 'Name',
            icon: FaUser,
            signup: true,
        },
        {
            title: 'Email',
            icon: FaEnvelope,
            type: 'email',
        },
        {
            title: 'Password',
            icon: FaLock,
            type: 'password',
        },
        {
            title: 'Confirm Password',
            icon: FaLock,
            signup: true,
            type: 'password',
        },
    ];

    const navigate = useRouter();

    const [login, { error: loginError, loading: loginLoading }] =
        useMutation(LOGIN);
    const [signup, { error: signupError, loading: signupLoading }] =
        useMutation(SIGNUP);

    const onSubmit = async (data) => {
        const { email, password, confirm_password } = data;

        try {
            if (isSignup) {
                if (password !== confirm_password) {
                    toast.error("Passwords don't match");

                    return;
                }
                await signup({
                    variables: {
                        user: {
                            username: email,
                            password,
                        },
                    },
                });

                toast.success('Signup successful');
            } else {
                await login({
                    variables: {
                        user: {
                            username: email,
                            password,
                        },
                    },
                });
            }
            navigate.replace('/');
        } catch (error) {
            toast.error(loginError?.message || signupError?.message);
        }
    };
    return (
        <>
            <ToastContainer />
            <div className="bg-white w-[425px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-8 rounded-md shadow-lg">
                <h1 className="text-center text-3xl  font-semibold text-blue-600 mb-4">
                    {isSignup ? 'SIGN UP' : 'LOGIN'}
                </h1>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {inputFields.map(
                        (i) =>
                            (!i.signup || isSignup) && (
                                <InputField
                                    key={i.title}
                                    label={i.title}
                                    icon={i.icon}
                                    register={register}
                                    type={i.type}
                                />
                            )
                    )}
                    <Button disabled={signupLoading || loginLoading}>
                        Submit
                    </Button>

                    {!isSignup && (
                        <button className="text-center block text-gray-500 text-sm font-medium hover:underline">
                            Forgot Password?
                        </button>
                    )}
                    <div className="text-center text-gray-700 text-sm font-medium">
                        <p>
                            {isSignup ? "Don't" : 'Already'} have an account?{' '}
                            <span
                                onClick={() =>
                                    setIsSignup((loggedIn) => !loggedIn)
                                }
                                className="text-blue-600 cursor-pointer hover:underline"
                            >
                                {isSignup ? 'Login' : 'Sign up'}
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Auth;

