CREATE TABLE "candidate_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_profile_id" uuid NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"employment_type" varchar(50),
	"location" varchar(255),
	"start_date" varchar(10) NOT NULL,
	"end_date" varchar(10),
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_profile_id" uuid NOT NULL,
	"institution" varchar(255) NOT NULL,
	"degree" varchar(255),
	"field_of_study" varchar(255),
	"start_date" varchar(10),
	"end_date" varchar(10),
	"is_current" boolean DEFAULT false NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_profile_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"proficiency" varchar(50),
	"years_of_experience" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidate_skills_profile_name_unique" UNIQUE("candidate_profile_id","name")
);
--> statement-breakpoint
CREATE TABLE "candidate_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_profile_id" uuid NOT NULL,
	"desired_job_titles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"desired_employment_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"work_location_preference" varchar(50) DEFAULT 'any' NOT NULL,
	"preferred_locations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"salary_currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"salary_minimum" integer,
	"salary_maximum" integer,
	"relocation_preference" varchar(50) DEFAULT 'negotiable' NOT NULL,
	"sponsorship_required" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidate_preferences_candidate_profile_id_unique" UNIQUE("candidate_profile_id")
);
--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD COLUMN "display_name" varchar(255);--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD COLUMN "state" varchar(100);--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD COLUMN "country" varchar(100);--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD COLUMN "postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "candidate_experiences" ADD CONSTRAINT "candidate_experiences_candidate_profile_id_candidate_profiles_id_fk" FOREIGN KEY ("candidate_profile_id") REFERENCES "public"."candidate_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_education" ADD CONSTRAINT "candidate_education_candidate_profile_id_candidate_profiles_id_fk" FOREIGN KEY ("candidate_profile_id") REFERENCES "public"."candidate_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_skills" ADD CONSTRAINT "candidate_skills_candidate_profile_id_candidate_profiles_id_fk" FOREIGN KEY ("candidate_profile_id") REFERENCES "public"."candidate_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_preferences" ADD CONSTRAINT "candidate_preferences_candidate_profile_id_candidate_profiles_id_fk" FOREIGN KEY ("candidate_profile_id") REFERENCES "public"."candidate_profiles"("id") ON DELETE cascade ON UPDATE no action;