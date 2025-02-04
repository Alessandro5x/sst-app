/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },

  async run() {
    // DynamoDB Table
    const table = new sst.aws.Dynamo("MyTable", {
      fields: {
        userId: "string",
        noteId: "string",
      },
      primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
    });

    const vpc = new sst.aws.Vpc("MyVpc", { bastion: true, nat: "ec2" });
    const rds = new sst.aws.Postgres("MyPostgres", { vpc, proxy: true });

    new sst.x.DevCommand("Studio", {
      link: [rds],
      dev: {
        command: "npx drizzle-kit studio",
      },
    });

    new sst.aws.Function("MyApiFunction", {
      vpc,
      url: true,
      link: [rds],
      handler: "src/main.handler",
    });

    // API Gateway V2
    const api = new sst.aws.ApiGatewayV2("MyApi", {
      link: [rds]
    });

    api.route("GET /", "src/app.controller.getHandler");
    api.route("POST /", "src/app.controller.postHandler");
    api.route("POST /data", "src/app.controller.postDataHandler");

    // Outputs
    return {
      ApiEndpoint: api.url,
      DynamoDBTable: table.name,
    };
  },
});