import { redis } from "./redis"

export async function rateLimit(ip: string) {
  const key = `rate:${ip}`

  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, 60) // 1 minute window
  }

  if (count > 60) {
    return false
  }

  return true
}