import { AWS } from './config';

export const awsEC2 = new AWS.EC2();

export function ec2() {
  return {
    runInstances: async () => (
      await awsEC2.runInstances()
    ),
  };
}
