"use server"

export async function analyzeFile(formData: FormData) {
  const file = formData.get("file") as File
  if (!file) {
    return {
      success: false,
      message: "No file uploaded.",
    }
  }

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  const fileType = file.type.split("/")[0] // image, audio, or video

  // Choose appropriate model based on file type
  const model = fileType === "image"
    ? {
        version: "efae6be2b69e70a1d0d4a6a2fcab83190a871ad583f4648b1d514e7fc3c38fc0",
        inputName: "image",
      }
    : fileType === "audio"
    ? {
        version: "4c9fa4c6e233ad2653dca8e0bb11f19597d3a79a2081d5a34b71ed7cf26f271e", // fake voice
        inputName: "audio",
      }
    : {
        version: "05b48d82a6b25b8e7b9a5b82e36d735fdc90f5e2e6cd62efb7909a09ccfe0fcb", // deepfake video
        inputName: "video",
      }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: model.version,
        input: {
          [model.inputName]: `data:${file.type};base64,${base64}`,
        },
      }),
    })

    const result = await response.json()

    if (result.error) {
      return {
        success: false,
        message: `Model error: ${result.error}`,
      }
    }

    const output = result?.output

    return {
      success: true,
      prediction: output,
      label: typeof output === "string" ? output : "Check result",
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "Failed to process file.",
    }
  }
}
