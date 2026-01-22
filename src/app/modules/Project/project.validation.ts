import { z } from 'zod';

const ProjectBodySchema = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .strict(); // disallow extra fields;

export const ProjectValidationSchema = z.object({
  body: ProjectBodySchema,
});

export const ProjectUpdateValidationSchema = z.object({
  body: ProjectBodySchema.partial(),
});
