import { urls } from "../mappers"
import type { GenerationPlane, ModelEntry, PlatformRequest } from "../types"

const GENJUTSU_RESOLUTION = ["480p", "720p", "1080p"] as const

/**
 * Restyle presets from GET /models/higgsfield/genjutsu/restyle/v1.0/presets
 * (label → preset UUID). The platform expects the UUID as `preset_id`.
 */
export const GENJUTSU_RESTYLE_PRESETS = {
  "Cel-Shaded CG Anime": "c2143317-f28d-4c3c-a0b8-39bd547e08a7",
  "Chunky Textured Low-Poly": "f1d0c30d-a2ec-4c33-a892-d8d158e2d093",
  "Comic 3D": "3dc6d454-808d-4e27-8a4e-4751da818324",
  "Expressive 2D Animation": "368c6a65-4a48-4e3a-80c7-c460455b5e17",
  "Expressive Gouache Fashion": "89484749-e1b9-40c9-979e-fc578c3aad6d",
  "Felt Puppet Stop Motion": "bf6aee41-83a8-433c-b5a5-2309c7bd5b26",
  "Graphic Cel": "523cf5be-67fc-46d6-bfdb-56ccc3e2a8f6",
  "Grotesque Street CGI": "c3268f8d-4cc0-423c-975d-ca1bf7df385a",
  "Hand-Painted Cel Animation": "067b27d4-8d8f-44d1-a24b-0f4c28012e4b",
  "Knitted Yarn World": "2b5b68c4-9253-4d79-9d05-81e7718d8d7a",
  "Neon Graphic Cinematic 3D": "41d02f6d-1d5d-4efa-9942-9fe71de9429b",
  "Nighttime Anime Pixel Art": "e54beac7-ca48-4034-856b-0a6f2b05081a",
  "Outline-free Cel": "55aee79b-bb36-40e3-b957-205e6867a3d9",
  "Painterly Cinematic 3D": "85bc9e2c-f896-41d7-b280-53f2f5e321ac",
  "Painterly Sculpted Animation": "083abd05-afbd-4cda-857f-7f2d2082e9b2",
  "Retro Game 3D": "255f5244-b43d-43fc-9c28-7138f8c12984",
  "Rounded Toy CGI": "6bce8e75-df92-487f-a4f0-a324a6a297f3",
  "Sculptural 3D Fashion": "f7786536-123b-47b8-ab65-ee0647df1509",
  "Textured Gouache Character Illustration":
    "f2b4e920-3b1e-4931-8a86-b06566005145",
  "Warm Painterly 3D Animation": "e82b7bbb-c8bf-4d70-a866-e7b15e744a2b",
} as const

type RestylePreset = keyof typeof GENJUTSU_RESTYLE_PRESETS

const RESTYLE_PRESET_LABELS = Object.keys(
  GENJUTSU_RESTYLE_PRESETS
) as RestylePreset[]

function isRestylePreset(value: unknown): value is RestylePreset {
  return (
    typeof value === "string" && Object.hasOwn(GENJUTSU_RESTYLE_PRESETS, value)
  )
}

const genjutsuSettings = {
  resolution: { type: "enum", values: GENJUTSU_RESOLUTION, default: "720p" },
} as const satisfies ModelEntry["settings"]

/** Source video plus ordered image references; prompt defaults to "". */
function genjutsuBody(plane: GenerationPlane): Record<string, unknown> {
  const [video] = urls(plane, "source")
  return {
    ...(video ? { video_url: video } : {}),
    image_urls: urls(plane, "reference"),
    prompt: plane.prompt.text.trim(),
    resolution: plane.settings.resolution,
  }
}

function mapRestyle(plane: GenerationPlane): PlatformRequest {
  const preset = plane.settings.stylePreset
  if (!isRestylePreset(preset))
    throw new Error("Choose a style preset for Genjutsu Restyle.")
  return {
    path: "higgsfield/genjutsu/restyle/v1.0",
    body: {
      ...genjutsuBody(plane),
      preset_id: GENJUTSU_RESTYLE_PRESETS[preset],
    },
  }
}

export const genjutsuRestyle: ModelEntry = {
  id: "genjutsu-restyle",
  surface: "video",
  label: "Genjutsu Restyle",
  roles: { source: 1, reference: 5 },
  requiredRoles: ["source"],
  settings: {
    stylePreset: {
      type: "enum",
      values: RESTYLE_PRESET_LABELS,
      default: "Cel-Shaded CG Anime",
    },
    ...genjutsuSettings,
  },
  icon: "higgsfield",
  order: 68,
  toPlatform: mapRestyle,
}

export const genjutsuMotionTransfer: ModelEntry = {
  id: "genjutsu-motion-transfer",
  surface: "video",
  label: "Genjutsu Motion Transfer",
  roles: { source: 1, reference: 8 },
  requiredRoles: ["source", "reference"],
  settings: genjutsuSettings,
  icon: "higgsfield",
  order: 69,
  toPlatform: (plane) => ({
    path: "higgsfield/genjutsu/motion-transfer/v1.0",
    body: genjutsuBody(plane),
  }),
}

export const genjutsuObjectSwap: ModelEntry = {
  id: "genjutsu-object-swap",
  surface: "video",
  label: "Genjutsu Object Swap",
  roles: { source: 1, reference: 8 },
  requiredRoles: ["source", "reference"],
  settings: genjutsuSettings,
  icon: "higgsfield",
  order: 70,
  toPlatform: (plane) => ({
    path: "higgsfield/genjutsu/object-swap/v1.0",
    body: genjutsuBody(plane),
  }),
}

const models = [genjutsuRestyle, genjutsuMotionTransfer, genjutsuObjectSwap]
export default models
