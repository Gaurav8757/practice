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
import path  from "path";

// __dirname and __filename in ES module
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const config = {
    port: PORT,
    host: "localhost",
    https: true,
    key: fs.readFileSync(path.join(__dirname, "key.pem")),   
    cert: fs.readFileSync(path.join(__dirname, "cert.pem")),   
};


const app = express();
const server = createServer(app);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hello World!");
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

server.listen(3000, () => {
    console.log("Server started on port 3000");
});




