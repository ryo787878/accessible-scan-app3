import { z } from "zod";

export const scanRequestSchema = z.object({
  url: z.string().min(1, "URLを入力してください").max(2048, "URLが長すぎます"),
  maxPages: z
    .number()
    .int("ページ数は整数で指定してください")
    .min(1, "1ページ以上を指定してください")
    .max(20, "最大20ページまで指定できます")
    .optional(),
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;
