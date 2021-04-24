import fs from 'fs';

const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

const writeFile = (fileName: string, fileConfigLocation: object) => {
  try {
    fs.accessSync(fileName, fs.constants.R_OK);
    // eslint-disable-next-line no-console
    console.log(`NOT WRITING! ${fileName}`);
  } catch (e) {
    const output = Object.keys(fileConfigLocation)
      .map(key => `${key}=${process.env[key]}`)
      .join('\n');

    fs.writeFileSync(fileName, output);
  }
};

writeFile('.env', vercelConfig.env);
writeFile('.env.build', vercelConfig.build.env);
