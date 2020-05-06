import React from 'react';
import Layout from '../components/layout'
import {useUser} from "../lib/hooks";

export default () => {
    const [user, {mutate}] = useUser();
    return (
        <Layout user={user} mutate={mutate}/>
    );
}
