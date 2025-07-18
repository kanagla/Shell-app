const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');
const version = pkg.version;
const name = pkg.name;
const buildTime = new Date().toISOString();

const versionInfo = {
  version,
  name,
  buildTime
};

const publicPath = path.join(__dirname, 'public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
}

fs.writeFileSync(
  path.join(publicPath, 'version.json'),
  JSON.stringify(versionInfo, null, 2)
);

console.log('✅ version.json generated:', versionInfo);
