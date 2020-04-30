import nextConnect from 'next-connect'
import auth from '../../middleware/auth'
import {getAllUsers, createUser, findUserByUsername} from '../../lib/db'

const handler = nextConnect()

handler
    .use(auth)
    .get((req, res) => {
        // For demo purpose only. You will never have an endpoint which returns all users.
        // Remove this in production
        res.json({users: getAllUsers(req)})
    })
    .post((req, res) => {
        const {first_name, last_name, email, password, contact} = req.body
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send('Missing fields')
        }
        // Here you check if the username has already been used
        const usernameExisted = !!findUserByUsername(req, email)
        if (usernameExisted) {
            return res.status(409).send('The username has already been used')
        }
        const user = {first_name, last_name, email, password, contact}
        // Security-wise, you must hash the password before saving it
        // const hashedPass = await argon2.hash(password);
        // const user = { username, password: hashedPass, name }
        createUser(req, user)
        req.logIn(user, err => {
            if (err) throw err
            // Log the signed up user in
            res.status(201).json({
                user,
            })
        })
    })

export default handler