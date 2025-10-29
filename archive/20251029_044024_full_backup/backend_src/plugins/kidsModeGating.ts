import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

// --- Core gating function factory (disabled) ---
const preventKidsModeAction = (action: 'payments' | 'betting') => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    // Kids mode restrictions disabled - allow all actions
    return;
  };
};

// --- Export Fastify Plugin ---
export const kidsModeGatingPlugin: FastifyPluginAsync = async (fastify) => {
  // Register hooks but they do nothing
  fastify.decorate('preventKidsModeMonetization', preventKidsModeAction('payments'));
  fastify.decorate('preventKidsModeBetting', preventKidsModeAction('betting'));
};

export default kidsModeGatingPlugin;