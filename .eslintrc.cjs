module.exports = {
  root: true,
  extends: ['./packages/config/.eslintrc.cjs'],
  ignorePatterns: ['dist', 'build', 'coverage'],
  overrides: [
    {
      files: ['apps/api/**/*.{ts,tsx}'],
      parserOptions: {
        project: './apps/api/tsconfig.json'
      }
    },
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      parserOptions: {
        project: './apps/web/tsconfig.json'
      }
    }
  ]
};
