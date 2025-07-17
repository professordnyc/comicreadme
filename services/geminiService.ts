import { GoogleGenAI, Type } from "@google/genai";
import { ART_STYLES, CHARACTERS, GEMINI_IMAGE_MODEL, GEMINI_TEXT_MODEL, IMAGE_GEN_FAILED } from '../constants';
import { ComicScript, ProjectType, ComicPanelData, SpeechBubble, PanelType } from '../types';

if (!process.env.API_KEY) {
  // This check is primarily for build-time/server-side validation.
  // The main App component will handle the user-facing error for the client-side.
  console.error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateFullComic(readmeContent: string): Promise<ComicScript> {
    console.log("Starting comic generation process...");

    const scriptPrompt = `
You are an expert comic book creator. Your task is to turn a GitHub README into an exciting comic book script.

**README Content:**
\`\`\`
${readmeContent}
\`\`\`

**Instructions:**
1.  **Analyze Project Type:** First, determine if this is a 'CLI', 'WEB_APP', or 'GAME'. This will define the art style.
2.  **Assign Characters:** Analyze the README for key functions, features, or concepts (e.g., 'install', 'build', 'run', 'database', 'API'). Assign a unique, consistent character from the provided list to each key concept. The characters should be quirky and memorable.
3.  **Create Panels:** Generate a sequence of 5-6 comic panels to explain the project.
    *   **Panel 1 (TITLE):** A dynamic title page. The project name should be the comic title. Create a dramatic visual concept.
    *   **Panel 2 (OVERVIEW):** An introduction to the project. What is it? Use a mascot character to explain.
    *   **Panel 3 (INSTALL):** A panel explaining the installation process. Show the 'install' character in action.
    *   **Panel 4+ (FEATURE):** One or two panels showcasing the main features or usage examples. Use the assigned characters.
    *   **Final Panel (FINAL):** A dramatic "Coming Soon" or "The End?" splash page, teasing future developments.
4.  **Output JSON:** Structure your entire output as a single, valid JSON object that strictly adheres to the provided schema. The 'panels' array must not be empty.

**Character list to choose from:** ${CHARACTERS.join(', ')}.
`;

    const response = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: scriptPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                required: ["projectType", "characterMap", "panels"],
                properties: {
                    projectType: { 
                        type: Type.STRING,
                        enum: [ProjectType.CLI, ProjectType.WEB_APP, ProjectType.GAME, ProjectType.UNKNOWN],
                        description: "The detected type of the project."
                    },
                    characterMap: {
                        type: Type.ARRAY,
                        description: "A list of project features/functions and their assigned characters.",
                        items: {
                            type: Type.OBJECT,
                            required: ["feature", "character"],
                            properties: {
                                feature: {
                                    type: Type.STRING,
                                    description: "The project feature, command, or concept (e.g., 'install', 'build')."
                                },
                                character: {
                                    type: Type.STRING,
                                    description: "The assigned character persona for the feature."
                                }
                            }
                        }
                    },
                    panels: {
                        type: Type.ARRAY,
                        description: "The sequence of comic panels.",
                        items: {
                            type: Type.OBJECT,
                            required: ["type", "visualDescription", "narration"],
                            properties: {
                                type: { 
                                    type: Type.STRING,
                                    enum: [PanelType.TITLE, PanelType.OVERVIEW, PanelType.INSTALL, PanelType.FEATURE, PanelType.FINAL],
                                    description: "The type of the panel."
                                },
                                visualDescription: { 
                                    type: Type.STRING,
                                    description: "A detailed visual description for the AI image generator."
                                },
                                narration: { 
                                    type: Type.STRING,
                                    description: "Narrator's text box, like in a comic book."
                                },
                                speech: {
                                    type: Type.ARRAY,
                                    description: "Speech bubbles for characters in the panel.",
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            character: { type: Type.STRING, description: "The character speaking." },
                                            text: { type: Type.STRING, description: "The dialogue." }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    console.log("Received script from Gemini:", response.text);
    const script = JSON.parse(response.text) as ComicScript;

    // Defensively check the response structure. The AI can sometimes return valid JSON that doesn't match the schema.
    if (!script || !Array.isArray(script.panels)) {
        console.error("Invalid script format from Gemini: 'panels' array is missing or not an array.", script);
        throw new Error("The AI failed to generate a valid comic script structure. Please try modifying your README or try again.");
    }

    console.log("Generating images for panels...");
    const artStyle = ART_STYLES[script.projectType] || ART_STYLES[ProjectType.UNKNOWN];
    const imagePromises = script.panels.map(panel => 
        generatePanelImage(panel.visualDescription, artStyle)
    );

    const imageUrls = await Promise.all(imagePromises);
    
    script.panels.forEach((panel, index) => {
        panel.imageUrl = imageUrls[index];
    });

    console.log("Comic generation complete.");
    return script;
}

export async function generatePanelImage(description: string, style: string): Promise<string> {
    const prompt = `A single comic book panel, in a ${style} style. The panel should be vibrant and dynamic. Scene: ${description}. Do not include any text, letters, or speech bubbles in the image.`;

    try {
        const response = await ai.models.generateImages({
            model: GEMINI_IMAGE_MODEL,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated by the API.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        // Return a specific failure constant instead of a placeholder URL
        return IMAGE_GEN_FAILED;
    }
}