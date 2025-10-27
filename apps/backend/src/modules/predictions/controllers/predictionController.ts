
import { FastifyRequest, FastifyReply } from "fastify";
import { predictionService } from "../services/predictionService";

export const getPredictions = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const predictions = await predictionService.getAllPredictions();
    return reply.send({ success: true, data: predictions });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch predictions" });
  }
};

export const createPrediction = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const prediction = await predictionService.createPrediction(request.body);
    reply.status(201).send({ success: true, data: prediction });
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
    return reply.send({ success: true, data: prediction });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch prediction" });
  }
};

export const enhancedPredict = async (
  request: FastifyRequest<{ Body: { features: number[]; enableAI?: boolean } }>,
  reply: FastifyReply
) => {
  try {
    const { features, enableAI } = request.body;
    const result = await predictionService.predictWithML(features);
    
    return reply.send({
      success: true,
      data: result,
      enhanced: enableAI || false
    });
  } catch (err) {
    reply.status(500).send({ error: "Prediction failed" });
  }
};

export const getConfidenceEvolution = async (
  request: FastifyRequest<{ Params: { predictionId: string } }>,
  reply: FastifyReply
) => {
  try {
    // This would integrate with confidence evolution service
    return reply.send({
      success: true,
      message: "Confidence evolution tracking",
      predictionId: request.params.predictionId
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch confidence evolution" });
  }
};
