import {
  ChangeMessageVisibilityCommand,
  ChangeMessageVisibilityCommandOutput,
  DeleteMessageCommand,
  DeleteMessageCommandOutput,
  GetQueueAttributesCommand,
  GetQueueAttributesCommandOutput,
  PurgeQueueCommand,
  PurgeQueueCommandOutput,
  ReceiveMessageCommand,
  ReceiveMessageCommandOutput,
  ReceiveMessageRequest,
  ReceiveMessageResult,
  SendMessageCommand,
  SendMessageCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from './config';

export const awsSqs = new SQSClient({
  region: AWS_REGION,
  apiVersion: '2012-11-05',
  credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
});

export function sqsQueue(queueUrl: string) {
  return {
    deleteMessage: async ({ receiveMessageResult }: {
      receiveMessageResult: ReceiveMessageResult
    }): Promise<DeleteMessageCommandOutput> => {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiveMessageResult?.Messages?.[0].ReceiptHandle || '',
      });
      return await awsSqs.send(command);
    },
    receiveMessage: async (props?: {
      visibilityTimeout: number,
      waitTimeSeconds: number
    }): Promise<ReceiveMessageCommandOutput> => {
      const { visibilityTimeout = 900, waitTimeSeconds = 20 } = props || {};
      const params: ReceiveMessageRequest = {
        QueueUrl: queueUrl,
        AttributeNames: [
          // 'SentTimestamp', // QueueAttributeName..
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
          'All',
        ],
        VisibilityTimeout: visibilityTimeout, // Should be between 0 seconds and 12 hours.
        WaitTimeSeconds: waitTimeSeconds, // Should be between 0 and 20 seconds.
      };
      const command = new ReceiveMessageCommand(params);
      return await awsSqs.send(command);
    },
    sendMessage: async ({
                          messageBody,
                          messageDeduplicationId,
                          messageGroupId,
                        }: {
      messageBody: string,
      messageDeduplicationId: string,
      messageGroupId: string
    }): Promise<SendMessageCommandOutput> => {
      const command = new SendMessageCommand({
        // Remove DelaySeconds parameter and value for FIFO queues
        // DelaySeconds: 10,
        MessageAttributes: {
          'Type': {
            DataType: 'String',
            StringValue: 'Exec command',
          },
        },
        QueueUrl: queueUrl,
        MessageBody: messageBody,
        MessageDeduplicationId: messageDeduplicationId,
        MessageGroupId: messageGroupId,
      });
      return await awsSqs.send(command);
    },
    changeMessageVisibility: async ({
                                      receiveMessageResult,
                                      visibilityTimeout,
                                    }: {
      receiveMessageResult: ReceiveMessageResult,
      visibilityTimeout: number
    }): Promise<ChangeMessageVisibilityCommandOutput> => {
      const command = new ChangeMessageVisibilityCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiveMessageResult?.Messages?.[0].ReceiptHandle || '',
        VisibilityTimeout: visibilityTimeout,
      });
      return await awsSqs.send(command);
    },
    getQueueAttributes: async (): Promise<GetQueueAttributesCommandOutput> => {
      const command = new GetQueueAttributesCommand({ QueueUrl: queueUrl, AttributeNames: [ 'All' ] });
      return await awsSqs.send(command);
    },
    purgeQueue: async (): Promise<PurgeQueueCommandOutput> => {
      const command = new PurgeQueueCommand({ QueueUrl: queueUrl });
      return await awsSqs.send(command);
    },
  };
}
