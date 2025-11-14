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
    console.log('> Building application using Next.js build...');
    try {
        const build = require('next/dist/build').default;
        build(process.cwd()).then(() => {
            console.log('> Build completed successfully');
            startServer();
        }).catch((error) => {
            console.error('> Build failed:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('> Build import failed, trying alternative method...');
        // Fallback: require next and use its internal build
        try {
            const NextBuild = require('next/dist/build/index').default;
            NextBuild(process.cwd()).then(() => {
                console.log('> Build completed successfully');
                startServer();
            }).catch((err) => {
                console.error('> Build failed:', err);
                process.exit(1);
            });
        } catch (innerError) {
            console.error('> All build methods failed. Exiting.');
            process.exit(1);
        }
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

