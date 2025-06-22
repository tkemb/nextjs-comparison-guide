CREATE TABLE "click_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"hour" text,
	"source" text NOT NULL,
	"provider_id" text NOT NULL,
	"total_clicks" text DEFAULT '0',
	"successful_forwards" text DEFAULT '0',
	"failed_forwards" text DEFAULT '0',
	"avg_response_time" text DEFAULT '0',
	"unique_visitors" text DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"click_id" text NOT NULL,
	"source" text NOT NULL,
	"provider_id" text NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"request_url" text,
	"params" jsonb DEFAULT '{}'::jsonb,
	"provider_url" text,
	"forwarded_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clicks_click_id_unique" UNIQUE("click_id")
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" text NOT NULL,
	"name" text NOT NULL,
	"base_url" text NOT NULL,
	"auth_type" text DEFAULT 'none',
	"auth_credentials" jsonb DEFAULT '{}'::jsonb,
	"custom_headers" jsonb DEFAULT '{}'::jsonb,
	"custom_params" jsonb DEFAULT '{}'::jsonb,
	"is_active" text DEFAULT 'true',
	"timeout" text DEFAULT '5000',
	"retry_attempts" text DEFAULT '3',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "providers_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE INDEX "click_stats_date_idx" ON "click_stats" USING btree ("date");--> statement-breakpoint
CREATE INDEX "click_stats_date_hour_idx" ON "click_stats" USING btree ("date","hour");--> statement-breakpoint
CREATE INDEX "click_stats_source_provider_idx" ON "click_stats" USING btree ("source","provider_id");--> statement-breakpoint
CREATE INDEX "clicks_click_id_idx" ON "clicks" USING btree ("click_id");--> statement-breakpoint
CREATE INDEX "clicks_source_idx" ON "clicks" USING btree ("source");--> statement-breakpoint
CREATE INDEX "clicks_provider_id_idx" ON "clicks" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "clicks_status_idx" ON "clicks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "clicks_created_at_idx" ON "clicks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "providers_provider_id_idx" ON "providers" USING btree ("provider_id");