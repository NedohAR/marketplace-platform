CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "adId" TEXT,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Conversation_user1Id_idx" ON "Conversation"("user1Id");
CREATE INDEX "Conversation_user2Id_idx" ON "Conversation"("user2Id");
CREATE INDEX "Conversation_adId_idx" ON "Conversation"("adId");
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");
CREATE UNIQUE INDEX "Conversation_user1Id_user2Id_adId_key" ON "Conversation"("user1Id", "user2Id", "adId");

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message" ADD COLUMN "conversationId" TEXT;
ALTER TABLE "Message" ALTER COLUMN "adId" DROP NOT NULL;

DO $$
DECLARE
    msg_record RECORD;
    conv_id TEXT;
    user1_id TEXT;
    user2_id TEXT;
    recipient_id TEXT;
BEGIN
    FOR msg_record IN 
        SELECT DISTINCT 
            "senderId",
            "recipientId",
            "adId"
        FROM "Message"
        WHERE "conversationId" IS NULL
    LOOP
        recipient_id := COALESCE(msg_record."recipientId", msg_record."senderId");
        
        IF msg_record."senderId" < recipient_id THEN
            user1_id := msg_record."senderId";
            user2_id := recipient_id;
        ELSE
            user1_id := recipient_id;
            user2_id := msg_record."senderId";
        END IF;
        
        SELECT id INTO conv_id
        FROM "Conversation"
        WHERE "user1Id" = user1_id 
          AND "user2Id" = user2_id 
          AND ("adId" = msg_record."adId" OR (msg_record."adId" IS NULL AND "adId" IS NULL))
        LIMIT 1;
        
        IF conv_id IS NULL THEN
            conv_id := 'conv_' || EXTRACT(EPOCH FROM NOW())::TEXT || '_' || floor(random() * 1000000)::TEXT;
            INSERT INTO "Conversation" ("id", "user1Id", "user2Id", "adId", "createdAt", "updatedAt", "lastMessageAt")
            VALUES (conv_id, user1_id, user2_id, msg_record."adId", NOW(), NOW(), NOW());
        END IF;
        
        UPDATE "Message"
        SET "conversationId" = conv_id
        WHERE "senderId" = msg_record."senderId"
          AND COALESCE("recipientId", "senderId") = recipient_id
          AND ("adId" = msg_record."adId" OR (msg_record."adId" IS NULL AND msg_record."adId" IS NULL))
          AND "conversationId" IS NULL;
    END LOOP;
END $$;

ALTER TABLE "Message" ALTER COLUMN "conversationId" SET NOT NULL;

CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
