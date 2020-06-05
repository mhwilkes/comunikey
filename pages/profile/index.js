import React from "react";
import Link from 'next/link';
import Layout from '../../components/layout'
import CssBaseline from "@material-ui/core/CssBaseline";
import {useUser} from "../../lib/hooks";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";

const useStyles = makeStyles((theme) => ({
    h2: {
        textAlign: "center",
        marginRight: theme.spacing(2)
    },
    button: {
        margin: "(0, 0, .25rem)"
    },
    img: {
        width: "10rem",
        height: "auto",
        borderRadius: "50%",
        boxShadow: "rgba(0, 0, 0, 0.05) 0 10px 20px 1px",
        marginRight: "1.5rem"
    },
    div: {
        color: "#777",
        display: "flex",
        alignItems: "center"
    },
    p: {
        fontFamily: "monospace",
        color: "#444",
        margin: "0.25rem 0 0 0.75rem"
    },
    a: {
        marginLeft: "0.25rem"
    }
}));

export default () => {
    const [user, {mutate}] = useUser();

    if (!user) {
        return (
            <>
                <p>Please sign in</p>
            </>
        );
    }

    return (
        <ProfilePage title={'Profile'} user={user} mutate={mutate} />
    );

}

const ProfilePage = ({title, user, mutate}) => {
    const classes = useStyles();
    const router = useRouter();
    const {
        first_name, last_name, email, bio, profilePicture, emailVerified, contact
    } = user || {};

    async function sendVerificationEmail() {
        await fetch('/api/user/email/verify', {
            method: 'POST',
        });
    }

    return (
        <Layout title={title} user={user} mutate={mutate}>
            <CssBaseline />

            {profilePicture ? (
                <img className={classes.img} src={profilePicture} width="256" height="256" alt={name} />
            ) : null}
            <section>
                <div className={classes.div}>
                    <h2 className={classes.h2}>{first_name} {last_name}</h2>
                    <Link href="/profile/settings">
                        <button className={classes.button} type="button">Edit</button>
                    </Link>
                </div>
                Bio
                <p className={classes.p}>{bio}</p>
                Email
                <p className={classes.p}>
                    {email}
                    {!emailVerified ? (
                        <>
                            {' '}
                            unverified
                            {' '}
                            <a className={classes.a} role="button" onClick={sendVerificationEmail}>
                                Send verification email
                            </a>
                        </>
                    ) : null}
                </p>
            </section>
        </Layout>
    );
};
