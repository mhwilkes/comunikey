import nextConnect from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import bcrypt from 'bcryptjs';
import middleware from '../../middlewares/middleware';
import {extractUser} from '../../lib/api-helpers';

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    const {first_name, last_name, password, contact} = req.body;
    const email = normalizeEmail(req.body.email);
    const bio = '';
    if (!isEmail(email)) {
        res.status(400).send('The email you entered is invalid.');
        return;
    }
    if (!password || !first_name || !last_name) {
        res.status(400).send('Missing field(s)');
        return;
    }
    if ((await req.db.collection('users').countDocuments({email})) > 0) {
        res.status(403).send('The email has already been used.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await req.db
        .collection('users')
        .insertOne({email, password: hashedPassword, first_name, last_name, contact, bio})
        .then(({ops}) => ops[0]);
    req.logIn(user, (err) => {
        if (err) throw err;
        res.status(201).json({
            user: extractUser(user),
        });
    });
});

export default handler;
