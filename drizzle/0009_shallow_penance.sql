ALTER TABLE "essay_questions" ALTER COLUMN "exam_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "essay_questions" ALTER COLUMN "assignment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz" ALTER COLUMN "exam_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz" ALTER COLUMN "assignment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "status" varchar DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "start_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "exams" ADD COLUMN "end_time" timestamp NOT NULL;