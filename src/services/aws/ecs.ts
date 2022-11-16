import { AWS } from './config';

export const awsEcs = new AWS.ECS();

// TODO put on ENV
const subnets = ['subnet-4231374c', 'subnet-d08fc68f', 'subnet-611b072c', 'subnet-8bf5beaa', 'subnet-c14bdbf0', 'subnet-14327e72'];
const securityGroups = ['sg-020d888fae3cf28f6'];

export const ecs = () => ({
  describeTaskDefinition: async ({ taskDefinition }: { taskDefinition: string }) => (
    await awsEcs.describeTaskDefinition({ taskDefinition }).promise()
  ),
  listTaskDefinitions: async () => await awsEcs.listTaskDefinitions({}).promise(),
});

export const ecsCluster = (cluster: string) => ({
  listTasks: async () => (
    await awsEcs.listTasks({ cluster }).promise()
  ),
  describeTasks: async (tasks: AWS.ECS.StringList) => (
    await awsEcs.describeTasks({ cluster, tasks }).promise()
  ),
  stopTask: async (task: string) => (
    await awsEcs.stopTask({ cluster, task }).promise()
  ),
  runTask: async (taskDefinition: string) => (
    await awsEcs.runTask({
      launchType: 'FARGATE',
      cluster,
      count: 1,
      taskDefinition,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets,
          assignPublicIp: 'ENABLED',
          securityGroups,
        },
      },
    }).promise()
  ),
});
