import React, {useState, useEffect} from 'react';
import Layout from '../../components/layout';
import {useUser} from "../../lib/hooks";
import CssBaseline from "@material-ui/core/CssBaseline";

import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default () => {
    const [user, {mutate}] = useUser();

    return (
        <SettingPage user={user} mutate={mutate} />
    )
}

const ProfileSection = ({user, mutate}) => {

    const classes = useStyles();
    const [isUpdating, setIsUpdating] = useState(false);
    const [first_name, setFirstName] = useState(user.first_name);
    const [last_name, setLastName] = useState(user.last_name);
    const [bio, setBio] = useState(user.bio);
    const profilePictureRef = React.createRef();
    const [msg, setMsg] = useState({message: '', isError: false});


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
            setMsg({message: 'Profile updated'});
        } else {
            setMsg({message: await res.text(), isError: true});
        }
    };

    const handleNewSet = async (e) => {

    }

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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        });

        if (res.status === 200) {
            setMsg({message: 'Password updated'});
        } else {
            setMsg({message: await res.text(), isError: true});
        }
    };

    return (
        <Layout user={user} mutate={mutate}>
            <h1>Settings</h1>
            <CssBaseline />
            <h2>Edit Profile</h2>
            {msg.message ?
                <p style={{color: msg.isError ? 'red' : '#0070f3', textAlign: 'center'}}>{msg.message}</p> : null}

            <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">
                    First Name
                    <input
                        required
                        id="first_name"
                        name="first_name"
                        type="text"
                        placeholder="First Name"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <label htmlFor="last_name">
                    Last Name
                    <input
                        required
                        id="last_name"
                        name="last_name"
                        type="text"
                        placeholder="Last Name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <label htmlFor="bio">
                    Bio
                    <textarea
                        id="bio"
                        name="bio"
                        type="text"
                        placeholder="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </label>
                <label htmlFor="avatar">
                    Profile picture
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/png, image/jpeg"
                        ref={profilePictureRef}
                    />
                </label>
                <button disabled={isUpdating} type="submit">Save</button>
            </form>
            <form onSubmit={handleSubmitPasswordChange}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="oldpassword">
                        Old Password
                    </InputLabel>
                    <Input id="oldpassword" name="oldpassword" aria-describedby="oldpasshelptext" />
                    <FormHelperText id="oldpasshelptext">Please enter your old password here</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="newpassword">
                        New Password
                    </InputLabel>
                    <Input id="newpassword" name="newpassword" aria-describedby="newpasshelptext" />
                    <FormHelperText id="newpasshelptext">Please enter your new password here</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Button type="submit" variant="outlined" color="secondary">Change Password</Button>
                </FormControl>
            </form>
            <form onSubmit={handleNewSet}>
                <label htmlFor="set-name">
                    Set Name
                    <input
                        type="text"
                        name="set-name"
                        id="set-name"
                        required
                    />
                </label>
                <label htmlFor="author-name">
                    Author Name
                    <input
                        type="text"
                        name="author-name"
                        id="author-name"
                        required
                    />
                </label>
                <label htmlFor="manufacturer-name">
                    Manufacturer
                    <select
                        name="manufacturer-name"
                        id="manufacturer-name"
                        required>
                        <option value={"GMK"}>GMK</option>
                        <option value={"E-PBT"}>E-PBT</option>
                        <option value={"JTK"}>JTK</option>
                    </select>
                </label>
                <label htmlFor="profile-name">
                    Profile Type
                    <select
                        name="profile-name"
                        id="profile-name"
                        required>
                        <option value={"Cherry"}>Cherry</option>
                        <option value={"SA"}>SA</option>
                        <option value={"DSA"}>DSA</option>
                        <option value={"XDA"}>XDA</option>
                        <option value={"MT3"}>MT3</option>
                        <option value={"KAT"}>KAT</option>
                        <option value={"KAM"}>KAM</option>
                        <option value={"OEM"}>OEM</option>
                        <option value={"MDA"}>MDA</option>
                        <option value={"DCS"}>DCS</option>
                    </select>
                </label>
                <label htmlFor="profile-name">
                    Profile Type
                    <select
                        name="profile-name"
                        id="profile-name"
                        required>
                        <option value={"MX"}>MX</option>
                        <option value={"Topre"}>Topre</option>
                        <option value={"Alps"}>Alps</option>
                    </select>
                </label>
            </form>
        </Layout>
    );
};

const SettingPage = ({user, mutate}) => {
    if (!user) {
        return (
            <>
                <p>Please sign in</p>
            </>
        );
    }
    return (
        <>
            <ProfileSection user={user} mutate={mutate} />
        </>
    );
};




