import { Injectable } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Client as PGClient } from 'pg';

@Injectable()
export class AppService {
  private dynamo = new DynamoDBClient({});
  private tableName = 'MyTable';

  async getData() {
    const params = {
      TableName: this.tableName,
      Key: {
        userId: { S: '123' },
        noteId: { S: 'note-1' },
      },
    };
    const data = await this.dynamo.send(new GetItemCommand(params));
    return data.Item;
  }

  async createItem(body: { userId: string; noteId: string }) {
    const params = {
      TableName: this.tableName,
      Item: {
        userId: { S: body.userId },
        noteId: { S: body.noteId },
      },
    };
    await this.dynamo.send(new PutItemCommand(params));
    return { message: 'Item created' };
  }

  async storeDataInRDS(body: { name: string; value: string }) {
    const client = new PGClient({
      host: process.env.RDS_HOST,
      port: parseInt(process.env.RDS_PORT || '5432'),
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB,
    });

    await client.connect();
    await client.query('CREATE TABLE IF NOT EXISTS data (id SERIAL PRIMARY KEY, name VARCHAR(255), value TEXT)');
    await client.query('INSERT INTO data (name, value) VALUES ($1, $2)', [body.name, body.value]);
    await client.end();

    return { message: 'Data stored in RDS successfully' };
  }
} 