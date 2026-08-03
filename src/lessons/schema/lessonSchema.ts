import{z}from'zod';
const activityType=z.enum(['read-aloud','word-recognition','sequencing','main-idea','retelling','vocabulary','sentence-building','story-evidence','short-response']);
export const lessonActivitySchema=z.object({id:z.string().min(1),type:activityType,prompt:z.string().min(1),options:z.array(z.string()).optional(),answer:z.number().int().nonnegative().optional(),acceptedText:z.array(z.string()).optional()});
export const lessonSchema=z.object({id:z.string().min(1),regionId:z.number().int().positive(),kind:z.enum(['lesson','review','villain','checkpoint']),title:z.string().min(1),mission:z.string().min(1),passage:z.string().min(1),activities:z.array(lessonActivitySchema).min(2),rewardStars:z.number().int().nonnegative(),skills:z.array(z.string()).min(1)});
export const lessonCollectionSchema=z.array(lessonSchema).min(1);
