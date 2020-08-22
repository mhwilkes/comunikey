import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import clsx from 'clsx';
import useUser from '../../lib/hooks';
import Layout from '../../components/layout';
import middleware from '../../middlewares/middleware';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  hideInput: {
    display: 'none',
  },
  fileButton: {
    marginBottom: theme.spacing(6),
  },
}));

const ProfileSettings = ({ title = 'Profile Settings', user }) => {
  const classes = useStyles();
  const { mutate } = useUser();
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [bio, setBio] = useState(user.bio);
  const [msg, setMsg] = useState({ message: '', isError: false });
  const [isUpdating, setIsUpdating] = useState(false);
  const profilePictureRef = React.createRef();

  console.log(user);
  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setBio(user.bio);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const formData = new FormData();
    if (profilePictureRef.current.files[0]) {
      formData.append('profilePicture', profilePictureRef.current.files[0]);
    }
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('bio', bio);

    const res = await fetch('/api/user', {
      method: 'PATCH',
      body: formData,
    });

    if (res.status === 200) {
      const userData = await res.json();
      await mutate({
        user: {
          ...user,
          ...userData.user,
        },
      });
      setMsg({ message: 'Profile updated' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    const body = {
      oldPassword: e.currentTarget.oldPassword.value,
      newPassword: e.currentTarget.newPassword.value,
    };
    e.currentTarget.oldPassword.value = '';
    e.currentTarget.newPassword.value = '';

    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      setMsg({ message: 'Password updated' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  return (
    <Layout user={user} mutate={mutate} title={title}>
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h1">Profile Settings</Typography>
          {msg.message
            ? (
              <p style={{
                color: msg.isError ? 'red' : '#0070f3',
                textAlign: 'center',
              }}
              >
                {msg.message}
              </p>
            ) : null}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" component="h2">Edit Profile</Typography>
          <form onSubmit={handleSubmit}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="first_name">
                First Name
              </InputLabel>
              <Input
                required
                id="first_name"
                name="first_name"
                type="text"
                placeholder="First Name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                aria-describedby="first_name_help"
              />
              <FormHelperText id="first_name_help">Enter Your First Name</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="last_name">
                Last Name
              </InputLabel>
              <Input
                required
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Last Name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                aria-describedby="last_name_help"
              />
              <FormHelperText id="last_name_help">Enter Your Last Name</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="bio">
                Biography
              </InputLabel>
              <Input
                required
                id="bio"
                name="bio"
                type="text"
                placeholder="Bio"
                multiline
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                aria-describedby="bio_help"
              />
              <FormHelperText id="bio_help">Fill out a Biography about yourself</FormHelperText>
            </FormControl>
            <FormControl className={clsx(classes.formControl, classes.fileButton)}>
              <InputLabel htmlFor="avatar">
                <Button
                  variant="outlined"
                  component="span"
                  className={classes.button}
                  size="medium"
                  color="primary"
                >
                  <AttachFileIcon />
                </Button>
              </InputLabel>
              <Input
                color="primary"
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                inputRef={profilePictureRef}
                style={{ display: 'none' }}
                aria-describedby="bio_help"
              />
              <FormHelperText id="bio_help">Profile Picture Upload</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <Button disabled={isUpdating} type="submit" variant="outlined" color="secondary">
                Save
                Changes
              </Button>
            </FormControl>

          </form>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" component="h2">Change Password</Typography>
          <form onSubmit={handleSubmitPasswordChange}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="oldpassword">
                Old Password
              </InputLabel>
              <Input
                id="oldpassword"
                name="oldpassword"
                placeholder="********"
                aria-describedby="oldpasshelptext"
              />
              <FormHelperText id="oldpasshelptext">Please enter your old password here</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="newpassword">
                New Password
              </InputLabel>
              <Input
                id="newpassword"
                name="newpassword"
                placeholder="********"
                aria-describedby="newpasshelptext"
              />
              <FormHelperText id="newpasshelptext">Please enter your new password here</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <Button type="submit" variant="outlined" color="secondary">Change Password</Button>
            </FormControl>
          </form>
        </Grid>

      </Grid>

    </Layout>
  );
};
export default ProfileSettings;

export async function getServerSideProps(ctx) {
  await middleware.apply(ctx.req, ctx.res);

  if (!ctx.req.user) {
    ctx.res.writeHeader(301, { Location: '/' });
    ctx.res.end();
    return {
      props: { user: null },
    };
  }
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