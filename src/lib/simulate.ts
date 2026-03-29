export interface SimConfig {
  delay?: number; // 0-5000 ms
  errorRate?: number; // 0-1
  errorStatus?: number; // 400-599
}

export function getConfig(data: Record<string, unknown>): SimConfig {
  const raw = data._config as Record<string, unknown> | undefined;
  if (!raw) return {};
  return {
    delay: Math.min(5000, Math.max(0, Number(raw.delay) || 0)),
    errorRate: Math.min(1, Math.max(0, Number(raw.errorRate) || 0)),
    errorStatus: Math.min(599, Math.max(400, Number(raw.errorStatus) || 500)),
  };
}

export async function applyDelay(config: SimConfig): Promise<void> {
  if (config.delay && config.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, config.delay));
  }
}

export function shouldError(config: SimConfig): boolean {
  if (!config.errorRate || config.errorRate <= 0) return false;
  return Math.random() < config.errorRate;
}
