import { DescribeInstancesCommand, DescribeInstancesCommandOutput, EC2Client } from '@aws-sdk/client-ec2';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, WITHOUT_AWS_KEYS } from './config';

export const awsEC2 = new EC2Client({
  region: AWS_REGION,
  credentials: WITHOUT_AWS_KEYS
    ? undefined
    : { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
});

export function ec2() {
  return {
    describeInstances: async (): Promise<DescribeInstancesCommandOutput> => {
      const command = new DescribeInstancesCommand({});
      return await awsEC2.send(command);
    },
  };
}
