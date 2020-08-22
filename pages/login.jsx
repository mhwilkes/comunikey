import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import middleware from '../middlewares/middleware';
import LoginForm from '../components/LoginForm';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <LoginForm />
    </Grid>
  );
}

export async function getServerSideProps(ctx) {
  await middleware.apply(ctx.req, ctx.res);

  if (ctx.req.user) {
    ctx.res.writeHeader(301, { Location: '/' });
    ctx.res.end();
    const {
      _id, first_name, last_name, email, bio, profilePicture, emailVerified, contact,
    } = ctx.req.user;
    const _oid = _id.toString();
    return {
      props: {
        user: {
          _id: _oid, first_name, last_name, email, bio, profilePicture, emailVerified, contact,
        },
      },
    };
  }

  return {
    props: { user: null },
  };
}
