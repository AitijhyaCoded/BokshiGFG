CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_text" text NOT NULL,
	"accuracy" integer NOT NULL,
	"true_count" integer NOT NULL,
	"partial_count" integer NOT NULL,
	"false_count" integer NOT NULL,
	"unverifiable_count" integer DEFAULT 0 NOT NULL,
	"ai_reasoning" text NOT NULL,
	"verified_claims" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
