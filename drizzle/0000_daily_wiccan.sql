CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "answer_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"option" varchar NOT NULL,
	"text" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"calendar_id" uuid,
	"class_id" uuid,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"due_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" uuid NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "calendars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"event_type" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"is_online" boolean NOT NULL,
	"link" varchar
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"schedule" varchar NOT NULL,
	"language_class_id" uuid NOT NULL,
	"batch" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"review_text" varchar NOT NULL,
	"rating" integer NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "essay_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"essay_question_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"answer_text" varchar NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"grade" integer NOT NULL,
	"feedback" varchar
);
--> statement-breakpoint
CREATE TABLE "essay_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"assignment_id" uuid NOT NULL,
	"question_text" varchar NOT NULL,
	"max_words" integer
);
--> statement-breakpoint
CREATE TABLE "event_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"calendar_id" uuid,
	"class_id" uuid,
	"title" varchar NOT NULL,
	"description" varchar,
	"exam_date" timestamp DEFAULT now() NOT NULL,
	"is_online" boolean DEFAULT false,
	"link" varchar
);
--> statement-breakpoint
CREATE TABLE "language_class_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "language_classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language_name" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"level" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "magic_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"content" varchar NOT NULL,
	"notification_type" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"send_at" timestamp,
	"is_global" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"class_id" uuid,
	"transaction_id" uuid,
	"amount" integer NOT NULL,
	"currency" varchar,
	"status" varchar,
	"payment_method" varchar NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" varchar NOT NULL,
	"image_url" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"bio" varchar NOT NULL,
	"address" varchar NOT NULL,
	"province" varchar NOT NULL,
	"regency" varchar NOT NULL,
	"district" varchar NOT NULL,
	"village" varchar NOT NULL,
	"postal_code" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_document_agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar,
	"certificate_url" varchar,
	"year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_document_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"grads_certificate_url" varchar,
	"transcript_url" varchar,
	"birth_certificate_url" varchar,
	"family_card_url" varchar,
	"id_card_url" varchar,
	"health_certificate_url" varchar,
	"passport_photo_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"image_url" varchar NOT NULL,
	"gender" varchar NOT NULL,
	"birth_date" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"address" varchar NOT NULL,
	"province" varchar NOT NULL,
	"regency" varchar NOT NULL,
	"district" varchar NOT NULL,
	"village" varchar NOT NULL,
	"postal_code" varchar NOT NULL,
	"education_level_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"text" varchar NOT NULL,
	"correct_answer" varchar NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"assignment_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"token" varchar NOT NULL,
	"token_expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	"role" text,
	"profileCompletion" integer DEFAULT 0,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verify_email_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"token" varchar NOT NULL,
	"token_expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_calendar_id_calendars_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_language_class_id_language_classes_id_fk" FOREIGN KEY ("language_class_id") REFERENCES "public"."language_classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_reviews" ADD CONSTRAINT "class_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_reviews" ADD CONSTRAINT "class_reviews_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_answers" ADD CONSTRAINT "essay_answers_essay_question_id_essay_questions_id_fk" FOREIGN KEY ("essay_question_id") REFERENCES "public"."essay_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_answers" ADD CONSTRAINT "essay_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_questions" ADD CONSTRAINT "essay_questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essay_questions" ADD CONSTRAINT "essay_questions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_calendar_id_calendars_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "language_class_enrollments" ADD CONSTRAINT "language_class_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "language_class_enrollments" ADD CONSTRAINT "language_class_enrollments_class_id_language_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."language_classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "language_classes" ADD CONSTRAINT "language_classes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_agencies" ADD CONSTRAINT "profile_agencies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_document_agencies" ADD CONSTRAINT "profile_document_agencies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_document_participants" ADD CONSTRAINT "profile_document_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_participants" ADD CONSTRAINT "profile_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_participants" ADD CONSTRAINT "profile_participants_education_level_id_education_levels_id_fk" FOREIGN KEY ("education_level_id") REFERENCES "public"."education_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verify_email_tokens" ADD CONSTRAINT "verify_email_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "question_id_idx" ON "answer_options" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "title_assignment_idx" ON "assignments" USING btree ("title");--> statement-breakpoint
CREATE INDEX "class_id_idx" ON "assignments" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "calendar_id_idx" ON "assignments" USING btree ("calendar_id");--> statement-breakpoint
CREATE INDEX "calendars_class_id_idx" ON "calendars" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "calendars_event_type_idx" ON "calendars" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "classes_name_idx" ON "classes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "classes_language_class_id_idx" ON "classes" USING btree ("language_class_id");--> statement-breakpoint
CREATE INDEX "class_reviews_user_id_idx" ON "class_reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "class_reviews_class_id_idx" ON "class_reviews" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "name_idx" ON "education_levels" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "essay_answers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "essay_question_id_idx" ON "essay_answers" USING btree ("essay_question_id");--> statement-breakpoint
CREATE INDEX "exam_id_idx" ON "essay_questions" USING btree ("exam_id");--> statement-breakpoint
CREATE INDEX "assignment_id_idx" ON "essay_questions" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "exams_title_exam_idx" ON "exams" USING btree ("title");--> statement-breakpoint
CREATE INDEX "exams_class_id_idx" ON "exams" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "exams_calendar_id_idx" ON "exams" USING btree ("calendar_id");--> statement-breakpoint
CREATE INDEX "language_class_enrollments_user_id_idx" ON "language_class_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "language_class_enrollments_class_id_idx" ON "language_class_enrollments" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "language_classes_language_name_idx" ON "language_classes" USING btree ("language_name");--> statement-breakpoint
CREATE INDEX "language_classes_user_id_idx" ON "language_classes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_recipients_user_id_idx" ON "notification_recipients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_recipients_notification_id_idx" ON "notification_recipients" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "payments_user_id_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_class_id_idx" ON "payments" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "payments_transaction_id_idx" ON "payments" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "Post_name_idx" ON "posts" USING btree ("name");--> statement-breakpoint
CREATE INDEX "profile_agencies_display_name_idx" ON "profile_agencies" USING btree ("display_name");--> statement-breakpoint
CREATE INDEX "profile_agencies_user_id_idx" ON "profile_agencies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profile_document_agencies_name_idx" ON "profile_document_agencies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "profile_document_agencies_user_id_idx" ON "profile_document_agencies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profile_document_participants_user_id_idx" ON "profile_document_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profile_participants_user_id_idx" ON "profile_participants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_id_idx" ON "questions" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_exam_id_idx" ON "quiz" USING btree ("exam_id");--> statement-breakpoint
CREATE INDEX "quiz_assignment_id_idx" ON "quiz" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "reset_tokens_user_id_idx" ON "reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reset_tokens_token_idx" ON "reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_name_idx" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "verify_email_tokens_user_id_idx" ON "verify_email_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verify_email_tokens_token_idx" ON "verify_email_tokens" USING btree ("token");