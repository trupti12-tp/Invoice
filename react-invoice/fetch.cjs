const https = require('https');
https.get('https://sikkoindia.com/', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log(d.match(/[\w\/\:\.\-]+\.mp4/g)));
});
