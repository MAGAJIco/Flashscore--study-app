
import { FastifyRequest, FastifyReply } from "fastify";

export const validateKidsMode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const kidsModeHeader = request.headers['x-kids-mode'];
  
  if (kidsModeHeader === 'true') {
    // Enforce kids mode restrictions
    const restrictedPaths = ['/betting', '/marketplace', '/payments'];
    if (restrictedPaths.some(path => request.url.includes(path))) {
      return reply.status(403).send({ 
        error: "This feature is not available in Kids Mode" 
      });
    }
  }
};
