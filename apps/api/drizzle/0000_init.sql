CREATE TYPE "public"."project_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('planning', 'in_progress', 'on_hold', 'completed');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"project_name" text NOT NULL,
	"description" text,
	"status" "project_status" NOT NULL,
	"priority" "project_priority" NOT NULL,
	"start_date" date NOT NULL,
	"due_date" date NOT NULL
);
