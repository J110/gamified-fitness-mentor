import axios from 'axios';

const bucket = 'https://d-id-public-bucket.s3.amazonaws.com';
const names = [
    'matt', 'brian', 'amy', 'emma', 'jane', 'john',
    'guy', 'jenny', 'sara', 'michelle', 'eric',
    'davis', 'steve', 'alex', 'mona', 'lisa',
    'driver', 'presenter', 'man', 'woman',
    'face', 'avatar', 'jack'
];
const exts = ['.jpg', '.jpeg', '.png'];

async function check() {
    console.log("Probing bucket...");
    for (const name of names) {
        for (const ext of exts) {
            const url = `${bucket}/${name}${ext}`;
            try {
                await axios.head(url);
                console.log(`FOUND: ${url}`);
            } catch (e) {
                // ignore
            }
        }
    }
}

check();
