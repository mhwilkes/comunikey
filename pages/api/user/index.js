import nextConnect from 'next-connect';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import middleware from '../../../middlewares/middleware';
import {extractUser} from '../../../lib/api-helpers';

const upload = multer({dest: '/tmp'});
const handler = nextConnect();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

handler.use(middleware);

handler.get(async (req, res) => res.json({user: extractUser(req)}));

handler.patch(upload.single('profilePicture'), async (req, res) => {
    if (!req.user) {
        req.status(401).end();
        return;
    }
    let profilePicture;
    if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
            width: 512,
            height: 512,
            crop: 'fill',
        });
        profilePicture = image.secure_url;
    }
    const {first_name, last_name, bio} = req.body;
    await req.db.collection('users').updateOne(
        {_id: req.user._id},
        {
            $set: {
                ...(first_name && {first_name}),
                ...(last_name && {last_name}),
                bio: bio || '',
                ...(profilePicture && {profilePicture}),
            },
        },
    );
    res.json({user: {name, bio}});
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;
