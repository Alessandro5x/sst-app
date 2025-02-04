import { AppService } from "../src/app.service";

test("Creates and retrieves an item from DynamoDB", async () => {
  const service = new AppService();

  await service.createItem({ userId: "test-user", noteId: "note-1" });
  const item = await service.getData();

  expect(item).toHaveProperty("userId");
  expect(item).toHaveProperty("noteId");
});