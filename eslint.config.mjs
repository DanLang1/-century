// import mantine from 'eslint-config-mantine';
// import tseslint from 'typescript-eslint';


// import eslint from '@eslint/js';

// export default tseslint.config(...mantine, eslint.configs.recommended,
//     tseslint.configs.recommended, { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] });
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
const eslintConfig = [
  ...compat.config({
    extends: ['next', 'prettier'],
  }),
]
export default eslintConfig