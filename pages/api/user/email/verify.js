import crypto from 'crypto';
import nextConnect from 'next-connect';
import middleware from '../../../../middlewares/middleware';

const mailgun = require("mailgun-js");
const DOMAIN = 'comunikey.xyz';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    if (!req.user) {
        res.json(401).send('you need to be authenticated');
        return;
    }
    const token = crypto.randomBytes(32).toString('hex');
    await req.db.collection('tokens').insertOne({
        token,
        userId: req.user._id,
        type: 'emailVerify',
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    const data = {
        to: req.user.email,
        from: process.env.EMAIL_FROM,
        subject: 'Verify Email',
        html: `
      <div>
        <p>Hello, ${req.user.name}</p>
        <p>Please follow <a href="${process.env.WEB_URI}/verify-email/${token}">this link</a> to confirm your email.</p>
      </div>
      `,
    }

    await mg.messages().send(data, function (error, body) {
        res.end('ok')
            .then(msg => console.log(msg));
        console.log(error);
    });
});

export default handler;
