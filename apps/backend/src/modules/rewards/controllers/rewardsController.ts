
import { FastifyRequest, FastifyReply } from "fastify";
import { rewardsService } from "../services/rewardsService";

export const getAchievements = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const achievements = await rewardsService.getAllAchievements();
    return reply.send(achievements);
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch achievements" });
  }
};

export const getUserCoins = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const coins = await rewardsService.getUserCoins(request.params.userId);
    return reply.send({ coins });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch user coins" });
  }
};
