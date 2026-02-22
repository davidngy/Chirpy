CREATE TABLE "chirpies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"body" varchar(256) NOT NULL,
	CONSTRAINT "chirpies_body_unique" UNIQUE("body")
);
