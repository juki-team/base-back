import { DescribeInstancesCommand, DescribeInstancesCommandOutput, EC2Client } from '@aws-sdk/client-ec2';
import { AWS_REGION } from './config';

export const awsEC2 = new EC2Client({ region: AWS_REGION });

export function ec2() {
  return {
    describeInstances: async (): Promise<DescribeInstancesCommandOutput> => {
      const command = new DescribeInstancesCommand({});
      return await awsEC2.send(command);
    },
  };
}
