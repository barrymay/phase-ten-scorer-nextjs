import fs from 'fs';

const copyIfNotExisting = (fileName: string) => {
  try {
    fs.copyFileSync(
      `scripts/defaultEnvFiles/${fileName}`,
      `${fileName}`,
      fs.constants.COPYFILE_EXCL,
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`File ${fileName} already exists in ${process.cwd()}`);
  }
};

copyIfNotExisting('.env');
copyIfNotExisting('.env.build');
