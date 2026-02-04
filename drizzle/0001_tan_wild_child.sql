CREATE TABLE "themes" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"favorite" boolean DEFAULT false
);
