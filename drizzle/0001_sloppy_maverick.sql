CREATE TABLE IF NOT EXISTS "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"is_complete" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
