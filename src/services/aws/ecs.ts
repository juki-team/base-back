import {
  DescribeTaskDefinitionCommand,
  DescribeTaskDefinitionCommandOutput,
  DescribeTasksCommand,
  DescribeTasksCommandOutput,
  ECSClient,
  ListTaskDefinitionsCommand,
  ListTaskDefinitionsCommandOutput,
  ListTasksCommand,
  RunTaskCommand,
  RunTaskCommandInput,
  RunTaskCommandOutput,
  StopTaskCommand,
  StopTaskCommandOutput,
} from '@aws-sdk/client-ecs';
import { jkLogTelegramBot } from '../telegram';

import {
  AWS_ACCESS_KEY_ID,
  AWS_ECS_SECURITY_GROUPS,
  AWS_ECS_SUBNETS,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  WITHOUT_AWS_KEYS,
} from './config';

export const awsEcs = new ECSClient({
  region: AWS_REGION,
  credentials: WITHOUT_AWS_KEYS
    ? undefined
    : { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
});

const subnets = AWS_ECS_SUBNETS.split(',');

const securityGroups = AWS_ECS_SECURITY_GROUPS.split(',');

export function ecs() {
  return {
    describeTaskDefinition: async ({ taskDefinition }: {
      taskDefinition: string
    }): Promise<DescribeTaskDefinitionCommandOutput> => {
      const command = new DescribeTaskDefinitionCommand({ taskDefinition });
      return await awsEcs.send(command);
    },
    listTaskDefinitions: async (): Promise<ListTaskDefinitionsCommandOutput> => {
      const command = new ListTaskDefinitionsCommand({});
      return await awsEcs.send(command);
    },
  };
}

export function ecsCluster(cluster: string) {
  return {
    listTasks: async () => {
      const command = new ListTasksCommand({ cluster });
      return await awsEcs.send(command);
    },
    describeTasks: async ({ tasks }: { tasks: string[] }): Promise<DescribeTasksCommandOutput> => {
      const command = new DescribeTasksCommand({ cluster, tasks });
      return await awsEcs.send(command);
    },
    stopTask: async ({ task }: { task: string }): Promise<StopTaskCommandOutput> => {
      const stopTaskCommandInput = { cluster, task };
      const command = new StopTaskCommand(stopTaskCommandInput);
      void jkLogTelegramBot.sendInfoMessage('stop task started', stopTaskCommandInput);
      return await awsEcs.send(command);
    },
    runTask: async ({ taskDefinition }: { taskDefinition: string }): Promise<RunTaskCommandOutput> => {
      const runTaskCommandInput: RunTaskCommandInput = {
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
      };
      void jkLogTelegramBot.sendInfoMessage('run task started', runTaskCommandInput);
      const command = new RunTaskCommand(runTaskCommandInput);
      return await awsEcs.send(command);
    },
  };
}
