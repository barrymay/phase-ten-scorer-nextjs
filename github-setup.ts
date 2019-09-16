import fs from 'fs';

const nowConfig = JSON.parse(fs.readFileSync('now.json', 'utf8'));

const writeFile = (fileName: string, fileConfigLocation: object) => {
  try {
    fs.accessSync(fileName, fs.constants.R_OK);
    console.log(`NOT WRITING! ${fileName}`);
  } catch (e) {
    const output = Object.keys(fileConfigLocation)
      .map(key => `${key}=${process.env[key]}`)
      .join('\n');

    fs.writeFileSync(fileName, output);
  }
};

writeFile('.env', nowConfig.env);
writeFile('.env.build', nowConfig.build.env);
