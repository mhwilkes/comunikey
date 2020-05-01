import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useUser} from '../lib/hooks';

export default ({children}) => {
    const [user, {mutate}] = useUser();

    const handleLogout = async () => {
        await fetch('/api/auth', {
            method: 'DELETE',
        });
        mutate(null);
    };
    return (
        <>

            <Head>
                <title>Next.js + MongoDB App</title>
                <meta
                    key="viewport"
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
            </Head>
            <header>
                <nav>
                    <Link href="/">
                        <a>
                            <h1>Next.js + MongoDB App</h1>
                        </a>
                    </Link>
                    <div>
                        {!user ? (
                            <>
                                <Link href="/login">
                                    <a>Sign in</a>
                                </Link>
                                <Link href="/signup">
                                    <a>Sign up</a>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/profile">
                                    <a>Profile</a>
                                </Link>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a tabIndex={0} role="button" onClick={handleLogout}>
                                    Logout
                                </a>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main>{children}</main>
            <footer>

            </footer>
        </>
    );
};
