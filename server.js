const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// Check if .next directory exists, if not build it programmatically
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir)) {
    console.log('> Building application using Next.js API...');
    const { build } = require('next/dist/build');
    try {
        build(process.cwd()).then(() => {
            console.log('> Build completed successfully');
            startServer();
        }).catch((error) => {
            console.error('> Build failed:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('> Build failed:', error);
        process.exit(1);
    }
} else {
    startServer();
}

function startServer() {
    const app = next({ dev, hostname, port });
    const handle = app.getRequestHandler();

    app.prepare().then(() => {
        createServer(async (req, res) => {
            try {
                const parsedUrl = parse(req.url, true);
                await handle(req, res, parsedUrl);
            } catch (err) {
                console.error('Error occurred handling', req.url, err);
                res.statusCode = 500;
                res.end('Internal server error');
            }
        }).listen(port, hostname, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
    });
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal server error');
        }
    }).listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});

