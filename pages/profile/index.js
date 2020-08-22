import React, {useEffect} from "react";
import Link from 'next/link';
import Layout from '../../components/layout'
import CssBaseline from "@material-ui/core/CssBaseline";
import {useUser} from "../../lib/hooks";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import middleware from "../../middlewares/middleware";

const useStyles = makeStyles((theme) => ({
    h2: {
        textAlign: "left",
        marginRight: theme.spacing(2),
        margin: "0.25rem 0 0 0.75rem",
    },
    button: {
        marginRight: theme.spacing(2),
        margin: "0.25rem 0 0 0.75rem",
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
        display: "block",
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

const Profile = ({title, user}) => {
    const {mutate} = useUser();
    const classes = useStyles();
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
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            {profilePicture ? (
                                <img className={classes.img} src={profilePicture} width="256" height="256" alt={"user_profile_avatar"} />
                            ) : null}
                        </Grid>
                        <Grid item xs={8}>
                            <div className={classes.div}>
                                <Typography className={classes.h2} variant={"h4"} component={"h4"}>User
                                                                                                   Profile</Typography>
                                <Typography className={classes.h2} variant={"h5"}
                                            component={"h5"}>Username: {first_name} {last_name}</Typography>
                                <Link href="/profile/settings">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        className={classes.button}
                                        size="medium"
                                        color="primary"
                                    >Edit Your Profile</Button>
                                </Link>
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={6}>
                    <section>
                        <Typography className={classes.h2} variant={"h5"} component={"h5"}>Bio</Typography>

                        <p className={classes.p}>{bio}</p>
                        <Typography className={classes.h2} variant={"h5"} component={"h5"}>Email</Typography>
                        <p className={classes.p}>
                            {email}
                            {!emailVerified ? (
                                <div>
                                    <div>
                                        <span className={classes.p}>Status: Unverified</span>
                                    </div>
                                    <div>
                                        <a className={classes.a} role="button" onClick={sendVerificationEmail}>
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                className={classes.button}
                                                size="medium"
                                                color="primary"
                                            >Send Verification Email</Button>
                                        </a>
                                    </div>
                                </div>
                            ) : null}
                        </p>
                    </section>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Profile;

export async function getServerSideProps(ctx) {
    await middleware.apply(ctx.req, ctx.res);

    if (!ctx.req.user) {
        ctx.res.writeHeader(301, {Location: "/"});
        ctx.res.end();
        return {
            props: {user: null}
        }
    }
    const {
        _id, first_name, last_name, email, bio, profilePicture, emailVerified, contact
    } = ctx.req.user;
    const _oid = _id.toString();
    return {
        props: {user: {_id: _oid, first_name, last_name, email, bio, profilePicture, emailVerified, contact}}
    }
}
