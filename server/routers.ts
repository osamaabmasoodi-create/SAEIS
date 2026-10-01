import { Express, Request, Response } from "express";
import * as db from "./db"; // تم التعديل لجلب كافة التصديرات
import { sql } from "drizzle-orm";

export function registerRoutes(app: Express) {
  
  // مسار تنفيذ استعلامات T-SQL/SQL
  app.post("/api/sql/execute", async (req: Request, res: Response) => {
    try {
      const { query } = req.body;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ 
          status: "error", 
          message: "يرجى تقديم استعلام SQL صالح." 
        });
      }

      const sanitizedQuery = query.trim();

      // تنفيذ الاستعلام المباشر عبر Drizzle / SQL Engine
      const result = await (db as any).execute(sql.raw(sanitizedQuery));

      return res.json({
        status: "success",
        data: result.rows || result,
      });
    } catch (error: any) {
      console.error("SQL Execution Error:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "حدث خطأ أثناء تنفيذ استعلام SQL.",
      });
    }
  });

}