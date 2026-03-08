import jwt from "jsonwebtoken"

const REFRESH_SECRET = process.env.REFRESH_SECRET!

// export function generateAccessToken(userId: string) {
//   return jwt.sign({ userId }, ACCESS_SECRET, {
//     expiresIn: "15m"
//   })
// }
interface RefreshTokenPayload {
  userId: string
  tokenId: string
}

export function generateAccessToken(userId: string) {
  return jwt.sign(
    { userId: userId },
    process.env.ACCESS_SECRET!,
    { expiresIn: "15m" }
  )
}

export function generateRefreshToken(
  userId: string,
  tokenId: string
) {
  return jwt.sign(
    { userId, tokenId },
    process.env.REFRESH_SECRET!,
    { expiresIn: "7d" }
  )
}

// export function verifyAccessToken(token: string) {
//   return jwt.verify(token, ACCESS_SECRET) as { userId: string }
// }

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.ACCESS_SECRET!) as {
    userId: string
  }
}
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(
    token,
    process.env.REFRESH_SECRET!
  ) as RefreshTokenPayload
}