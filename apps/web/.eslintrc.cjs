module.exports = {
  root: false,
  extends: ['../../packages/config/.eslintrc.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
};
