import { AWS } from './config';

export const awsSqs = new AWS.SQS({ apiVersion: '2012-11-05' });

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export const sqsQueue = (queueUrl: string) => ({
  deleteMessage: async ({ receiveMessageResult }: { receiveMessageResult: AWS.SQS.Types.ReceiveMessageResult }) => {
    return await awsSqs.deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: receiveMessageResult?.Messages?.[0].ReceiptHandle || '',
    }).promise();
  },
  receiveMessage: async (props: { visibilityTimeout: IntRange<0, 999>, waitTimeSeconds: IntRange<0, 20> }) => {
    const { visibilityTimeout = 900, waitTimeSeconds = 20 } = props || {};
    const params: AWS.SQS.Types.ReceiveMessageRequest = {
      QueueUrl: queueUrl,
      AttributeNames: [
        'SentTimestamp',
      ],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: [
        'All',
      ],
      // VisibilityTimeout: 300,
      VisibilityTimeout: visibilityTimeout, // Should be between 0 seconds and 12 hours.
      WaitTimeSeconds: waitTimeSeconds, // Should be between 0 and 20 seconds.
    };
    return await awsSqs.receiveMessage(params).promise();
  },
  sendMessage: async ({
    messageBody,
    messageDeduplicationId,
    messageGroupId,
  }: { messageBody: string, messageDeduplicationId: string, messageGroupId: string }) => {
    return await awsSqs.sendMessage({
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
    }).promise();
  },
  getQueueAttributes: async () => {
    return await awsSqs.getQueueAttributes({ QueueUrl: queueUrl, AttributeNames: ['All'] }).promise();
  },
});
