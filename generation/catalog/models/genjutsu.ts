import { urls } from "../mappers"
import type { GenerationPlane, ModelEntry, PlatformRequest } from "../types"

const genjutsuSettings = {
  resolution: {
    type: "enum",
    values: ["480p", "720p", "1080p"],
    default: "720p",
  },
} as const satisfies ModelEntry["settings"]

/** Genjutsu workflows: one 4–30s source video plus 1–8 image references. */
function mapGenjutsu(plane: GenerationPlane, path: string): PlatformRequest {
  const [video] = urls(plane, "source")
  const refs = urls(plane, "reference")
  return {
    path,
    body: {
      ...(video ? { video_url: video } : {}),
      image_urls: refs,
      prompt: plane.prompt.text.trim(),
      resolution: plane.settings.resolution,
    },
  }
}

export const genjutsuMotionTransfer: ModelEntry = {
  id: "genjutsu-motion-transfer",
  surface: "video",
  label: "Genjutsu Motion Transfer",
  roles: { source: 1, reference: 8 },
  requiredRoles: ["source", "reference"],
  settings: genjutsuSettings,
  icon: "higgsfield",
  order: 68,
  toPlatform: (plane) =>
    mapGenjutsu(plane, "higgsfield/genjutsu/motion-transfer/v1.0"),
}

export const genjutsuObjectSwap: ModelEntry = {
  id: "genjutsu-object-swap",
  surface: "video",
  label: "Genjutsu Object Swap",
  roles: { source: 1, reference: 8 },
  requiredRoles: ["source", "reference"],
  settings: genjutsuSettings,
  icon: "higgsfield",
  order: 69,
  toPlatform: (plane) =>
    mapGenjutsu(plane, "higgsfield/genjutsu/object-swap/v1.0"),
}

const models = [genjutsuMotionTransfer, genjutsuObjectSwap]
export default models
