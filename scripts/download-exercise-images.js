    const https = require('https');
    const http = require('http');
    const fs = require('fs');
    const path = require('path');

const images = [
  { id: 'caminhada-lugar', url: 'https://picsum.photos/1200/900?random=1' },
  { id: 'alongamento-bracos', url: 'https://picsum.photos/1200/900?random=2' },
  { id: 'exercicio-cadeira', url: 'https://picsum.photos/1200/900?random=3' },
  { id: 'equilibrio-apoio', url: 'https://picsum.photos/1200/900?random=4' },
  { id: 'respiracao-profunda', url: 'https://picsum.photos/1200/900?random=5' },
  { id: 'flexao-parede', url: 'https://picsum.photos/1200/900?random=6' },
  { id: 'marcha-estacionaria', url: 'https://picsum.photos/1200/900?random=7' },
  { id: 'rotacao-tornozelos', url: 'https://picsum.photos/1200/900?random=8' },
  { id: 'agachamento-cadeira', url: 'https://picsum.photos/1200/900?random=9' },
  { id: 'equilibrio-uma-perna', url: 'https://picsum.photos/1200/900?random=10' }
];

const outDir = path.join(__dirname, '..', 'assets', 'exercises');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(download(res.headers.location, dest));
      }

      const contentType = res.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        // consume body and reject
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => reject(new Error('Invalid content-type: ' + contentType)));
        return;
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });
    req.on('error', (err) => reject(err));
  });
}

(async () => {
  for (const item of images) {
    const dest = path.join(outDir, `${item.id}.jpg`);
    try {
      console.log('Downloading', item.url, '->', dest);
      await download(item.url, dest);
    } catch (e) {
      console.error('Failed to download', item.url, e.message || e);
    }
  }
  console.log('Done');
})();
