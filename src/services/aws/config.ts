export const WITHOUT_AWS_KEYS = !!process.env.WITHOUT_AWS_KEYS;
export const AWS_REGION = process.env.AWS_REGION || '';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_ECS_SECURITY_GROUPS = process.env.AWS_ECS_SECURITY_GROUPS || '';
export const AWS_ECS_SUBNETS = process.env.AWS_ECS_SUBNETS || '';
