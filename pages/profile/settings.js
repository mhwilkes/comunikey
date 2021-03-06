import React, {useState, useEffect} from 'react';
import Layout from '../../components/layout'
import {useUser} from "../../lib/hooks";
import CssBaseline from "@material-ui/core/CssBaseline";

export default () => {
    const [user, {mutate}] = useUser();

    return(
        <SettingPage user={user} mutate={mutate}/>
    )
}

const ProfileSection = ({user, mutate}) => {

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
            <CssBaseline/>
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
                <label htmlFor="oldpassword">
                    Old Password
                    <input
                        type="password"
                        name="oldPassword"
                        id="oldpassword"
                        required
                    />
                </label>
                <label htmlFor="newpassword">
                    New Password
                    <input
                        type="password"
                        name="newPassword"
                        id="newpassword"
                        required
                    />
                </label>
                <button type="submit">Change Password</button>
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
            <ProfileSection user={user} mutate={mutate}/>
        </>
    );
};




