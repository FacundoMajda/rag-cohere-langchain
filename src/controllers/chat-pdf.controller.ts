import { join } from "path";
import { interactWithPDF } from "../utils/file-utils";

export async function chatPDF(req, res) {
  const filePath = join(__dirname, "asd.pdf");

  const response = await interactWithPDF(filePath);
  return res.status(200).json(response);
}
