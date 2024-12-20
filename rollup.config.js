import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: {
    'main': 'src/index.ts',
    'services/aws/apigatewaymanagementapi': 'src/services/aws/apigatewaymanagementapi.ts',
    'services/aws/ec2': 'src/services/aws/ec2.ts',
    'services/aws/ecs': 'src/services/aws/ecs.ts',
    'services/aws/s3': 'src/services/aws/s3.ts',
    'services/aws/sqs': 'src/services/aws/sqs.ts',
  },
  // inlineDynamicImports: true,
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
    {
      dir: 'dist/esm',
      format: 'esm',
    },
  ],
  // external: [ ...Object.keys(pkg.peerDependencies || {}) ],
  plugins: [
    peerDepsExternal(),
    typescript({ useTsconfigDeclarationDir: true, tsconfig: './tsconfig.json' }),
    // typescript({
    //   typescript: require('typescript'),
    // }),
  ],
};
