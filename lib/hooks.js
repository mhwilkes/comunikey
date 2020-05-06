import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser() {
    const { data, mutate } = useSWR('/api/user', fetcher);
    const user = data && data.user;
    console.log('Data has been requested about user')
    return [user, { mutate }];
}
