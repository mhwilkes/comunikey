import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function useUser() {
  const { data, mutate } = useSWR('/api/user', fetcher);
  const user = data && data.user;
  return [user, { mutate }];
}
