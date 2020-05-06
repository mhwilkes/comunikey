import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layout'
import CssBaseline from "@material-ui/core/CssBaseline";
import {useUser} from "../../lib/hooks";
import redirectTo from "../../lib/redirectTo";



export default () => {
    const [user, {mutate}] = useUser();
    return (
        <ProfilePage title={'Profile'} user={user} mutate={mutate}>

        </ProfilePage>

    );

}

const ProfilePage = ({title, user, mutate}) => {
    const {
        first_name, last_name, email, bio, profilePicture, emailVerified, contact
    } = user || {};

    async function sendVerificationEmail() {
        await fetch('/api/user/email/verify', {
            method: 'POST',
        });
    }

    if (!user) {
        return (
            <p>Please sign in</p>
        );
    }
    return (
        <Layout title={title} user={user} mutate={mutate}>
            <CssBaseline/>
            <style jsx>
                {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          button {
            margin: 0 0.25rem;
          }
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
          }
          div {
            color: #777;
            display: flex;
            align-items: center;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
        `}
            </style>
            {profilePicture ? (
                <img src={profilePicture} width="256" height="256" alt={name}/>
            ) : null}
            <section>
                <div>
                    <h2>{first_name} {last_name}</h2>
                    <Link href="/profile/settings">
                        <button type="button">Edit</button>
                    </Link>
                </div>
                Bio
                <p>{bio}</p>
                Email
                <p>
                    {email}
                    {!emailVerified ? (
                        <>
                            {' '}
                            unverified
                            {' '}
                            {/* eslint-disable-next-line */}
                            <a role="button" onClick={sendVerificationEmail}>
                                Send verification email
                            </a>
                        </>
                    ) : null}
                </p>
            </section>
        </Layout>
    );
};
