import { env } from '../config/env.js';

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!env.awsRegion || !env.emailFrom) {
    return; // no-op in dev without config
  }
  try {
    const { SESv2Client, SendEmailCommand } = await import('@aws-sdk/client-sesv2');
    const client = new SESv2Client({ region: env.awsRegion });
    const cmd = new SendEmailCommand({
      Destination: { ToAddresses: [to] },
      FromEmailAddress: env.emailFrom,
      Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html } } } },
    } as any);
    await client.send(cmd);
  } catch (err) {
    // swallow in dev
  }
}