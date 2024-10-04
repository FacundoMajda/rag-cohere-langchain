import {researcher} from "../services/research.service";

export async function smartSearch(req, res) {
    const {query} = req.body
    if (!query) {
        return res.status(400).json({status: "error", message: "Se requiere query."})
    }
    const response = await researcher(query)
    return res.status(200).json(response)
}