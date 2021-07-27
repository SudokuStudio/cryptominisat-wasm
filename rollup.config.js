import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/cryptominisat.ts',
    output: {
        sourcemap: true,
        format: 'es',
        dir: 'dist'
    },
    external: [ './cryptominisat5_simple' ],
    plugins: [
        copy({
            targets: [
                {
                    src: 'cryptominisat/build/cryptominisat5_simple.js',
                    dest: 'dist/',
                },
            ],
        }),
        typescript({ tsconfig: './tsconfig.json' }),
    ],
};
