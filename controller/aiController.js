import Resume from "../models/resume.js";
import ai from "../configs/ai.js";

//controller for enhancing a resumes professional summary
//post: /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });

    }
    
    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS-friendly and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent })

  }


  catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

//controller for enhancing a resume's job description
//post: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert in resume writing. Your task is to enhance job descriptions to make them more compelling and ATS-friendly. Highlight key responsibilities, achievements, and skills. Make it professional and concise. Only return the enhanced text, no additional options or explanations."
        },
        {
          role: "user",
          content: userContent,
        }
      ]
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

//controller for uploading a resume to the database
//post :/api/ai/upload-resume

export const uploadResume = async (req, res) => {
  try {
    const { text, title } = req.body;
    const userId = req.userId

    if (!text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt = "You are an expert AI to extract data from resumes. Extract all relevant information and return it in the specified JSON format."
    const userPrompt = `Extract data from this resume: ${text}

Provide the extracted data in the following JSON format with no additional text before or after:
{
  "title": "string (default: 'untitled resume' if not provided)",
  "public": false,
  "template": "classic",
  "accent_color": "#3B82F6",
  "professional_summary": "string",
  "skills": ["array of strings"],
  "personal_info": {
    "image": "",
    "full_name": "string",
    "profession": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "experience": [
    {
      "company": "string",
      "position": "string",
      "start_date": "string",
      "end_date": "string",
      "description": "string",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "string",
      "type": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduation_date": "string",
      "gpa": "string"
    }
  ]
}`
  
    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({ ...parsedData,userId:userId,title:title});

    return res.json({ resumeId: newResume._id, message: "Resume uploaded successfully" })

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
