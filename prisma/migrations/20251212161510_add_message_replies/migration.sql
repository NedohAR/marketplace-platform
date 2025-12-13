ALTER TABLE "Message" ADD COLUMN     "parentMessageId" TEXT,
ADD COLUMN     "recipientId" TEXT;

CREATE INDEX "Message_recipientId_idx" ON "Message"("recipientId");

CREATE INDEX "Message_parentMessageId_idx" ON "Message"("parentMessageId");

ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message" ADD CONSTRAINT "Message_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
