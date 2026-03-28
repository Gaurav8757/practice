// import fs from "fs";

// fs.writeFileSync("hello.txt", "Hello World");

// fs.appendFileSync("hello.txt", "\nHello World");

// fs.unlinkSync("hello.txt");

// async

// fs.writeFile("hello1.txt", "Hello World", (err) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("File written successfully");
// });

// fs.appendFile("hello1.txt", "\nHello World", (err) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("File appended successfully");
// });

// fs.readFile("hello1.txt", (err, data) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(data.toString());
// });

// fs.rename("hello1.txt", "hello2.txt", (err) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("File renamed successfully");
// });

// fs.copyFile("hello2.txt", "hello3.txt", (err) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("File copied successfully");
// });

// fs.mkdir("hello4", (err) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("Directory created successfully");
// });

// fs.rmdir("hello4", (err) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("Directory deleted successfully");
// });

// fs.unlink("hello1.txt", (err) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("File deleted successfully");
// });

// path

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log(path.basename("hello.txt"));
// console.log(path.dirname("hello.txt"));
// console.log(path.extname("hello.txt"));
// console.log(path.join("hello.txt", "hello1.txt"));
// console.log(path.resolve("hello.txt", "hello1.txt"));
// console.log(path.relative("hello.txt", "hello1.txt"));
// console.log(path.parse("hello.txt"));
// console.log(path.join(__dirname, "hello.txt"));
// console.log(__dirname);
// console.log(__filename);
// const filePath = path.join(__dirname, "data", "users.json");
// console.log(filePath);


// express static serve 
import express from 'express';
import { createServer } from 'http2';
import fs from "fs";
import os from 'os';
import path  from "path";
import EventEmitter from "events";
import { Buffer } from 'buffer';
import zlib from 'zlib';
import dns from "dns";
const eventEmitter = new EventEmitter();

// __dirname and __filename in ES module
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// const config = {
//     port: PORT,
//     host: "localhost",
//     https: true,
//     key: fs.readFileSync(path.join(__dirname, "key.pem")),   
//     cert: fs.readFileSync(path.join(__dirname, "cert.pem")),   
// };

// const rootDir = path.join(process.cwd(), 'uploads');
// console.log(`${rootDir}`);


// dns.lookup("google.com", (err, address, family) => {
//   console.log("IP:", address);
//   console.log("Family:", family); // IPv4 or IPv6
// });

// dns.resolve("gmail.com", "MX", (err, records) => {
//   console.log(records);
// });
// dns.reverse("8.8.8.8", (err, hostnames) => {
//   console.log("Hostnames:", hostnames);
// });


// console.log(os.platform());
// console.log(os.arch());
// console.log(os.cpus().length);
// console.log(os.type());
// console.log(os.uptime());

const app = express();
// const student = express();
// const teacher = express();

const server = createServer(app);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));


// Multiple mounting 
// teacher.on('mount', function (parent) {
//     console.log('Teacher Mounted');
// });

// student.on('mount', function (parent) {
//     console.log('Student Mounted');
// });

// app.use('/teacher', teacher);

// app.use('/student', student);

// eventEmitter.on("greet", () => {
//     console.log("Hello World!");
// });

// eventEmitter.emit("greet");

app.get("/IS", (req, res) => {
    // console.log(req.app._eventsCount);
    // console.log(req.baseUrl);
    // console.log(req.path);
    // console.log(req.originalUrl);
    // console.log(req.route.stack[0].method);
    // res.append('Warning', '201 Warning');
    // console.log(res.get('Warning'));
    // res.attachment('Hello.txt'); // it also download works
    // res.download('Hello2.txt'); // it also download works
    // res.redirect('https://www.google.com');
    // console.log(res.get('Content-Disposition'));
    console.log(req.fresh);
    res.send("Hello World!");
    console.log("/user called")
    res.end();
});

app.get("/buffer", (req, res) => {
    const buffer = Buffer.from("Hello World");
    res.send(buffer);
});

const stream = fs.createReadStream("hello.txt");
// it will read file in chunks
// stream.on("data", chunk => {
//   console.log("Chunk size:", chunk, chunk.toString());
// });

// ZIP FILE 
fs.createReadStream("hello.txt").pipe(zlib.createGzip()).pipe(fs.createWriteStream("hello.txt.gz"));


// VIDEO PLAY FROM PUBLIC FOLDER without controls
app.get("/video", (req, res) => {
//   const videoPath = path.join(__dirname, "public", "101731-video-1080.mp4");
const mp3 = path.join(__dirname, "public", "mixkit-latin-lovers-39.mp3");
  const stream = fs.createReadStream(mp3);
//   res.writeHead(200, { "Content-Type": "video/mp4" });
res.writeHead(200, {"Content-Type": "audio/mp3"});
  stream.pipe(res);
});



// video with controls
app.get("/video-controls", (req, res) => {
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    const videoPath = path.join(__dirname, "public", "101731-video-1080.mp4");
    
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send("Video file not found");
    }

    const videoSize = fs.statSync(videoPath).size;

    // Parse Range: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});



// read hello.txt file
app.get("/hello", (req, res) => {
    fs.readFile("hello.txt", (err, data) => {
        if (err) {
            console.log(err);
        }
        res.send(data.toString());
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});




