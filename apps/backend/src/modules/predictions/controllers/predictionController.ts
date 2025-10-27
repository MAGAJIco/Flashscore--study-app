
import { FastifyRequest, FastifyReply } from "fastify";
import { predictionService } from "../services/predictionService";

export const getPredictions = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const predictions = await predictionService.getAllPredictions();
    return reply.send(predictions);
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch predictions" });
  }
};

export const createPrediction = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const prediction = await predictionService.createPrediction(request.body);
    reply.status(201).send(prediction);
  } catch (err) {
    reply.status(400).send({ error: "Failed to create prediction" });
  }
};

export const getPredictionById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const prediction = await predictionService.getPredictionById(request.params.id);
    if (!prediction) {
      return reply.status(404).send({ error: "Prediction not found" });
    }
    return reply.send(prediction);
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch prediction" });
  }
};
